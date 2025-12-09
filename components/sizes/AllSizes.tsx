"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2, Ruler } from "lucide-react";
import { Button } from "../ui/button";
import { AlertModal } from "../ui/alert-modal";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import MainLoading from "../ui/main-loading";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import { SizeModal } from "./SizeForm";
import { GET_ALL_SIZES } from "@/graphql/actions/queries/sizes/getAllSizes";
import { DELETE_SIZE } from "@/graphql/actions/mutations/sizes/deleteSize";

type Props = {};

const AllSizes = (props: Props) => {
  const { data, loading: getSizesLoading } = useQuery(GET_ALL_SIZES);
  const [deleteSize, { loading: loadingDelete }] = useMutation(DELETE_SIZE);

  const sizes = data?.getSizes;

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedSize, setSelectedSize] = useState<any | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleCreate = () => {
    setSelectedSize(null);
    setOpenFormModal(true);
  };

  const handleEdit = (size: any) => {
    setSelectedSize(size);
    setOpenFormModal(true);
  };

  const handleDeleteRequest = (size: any) => {
    setSelectedSize(size);
    setOpenDeleteAlert(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedSize) return;
    try {
      await deleteSize({
        variables: { id: selectedSize.id },
        refetchQueries: [{ query: GET_ALL_SIZES }],
      });
      toast.success("Size deleted successfully");
      setOpenDeleteAlert(false);
      setSelectedSize(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <AlertModal
        isOpen={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
          setSelectedSize(null);
        }}
        onConfirm={onConfirmDelete}
        loading={loadingDelete}
      />

      <SizeModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        initialData={selectedSize}
      />

      <div className="flex items-center justify-between my-4">
        <HeadPage
          title={`Sizes ${getSizesLoading ? `...` : `(${sizes?.length || 0})`}`}
          description="Manage shoe and clothing sizes"
        />

        <Button
          onClick={handleCreate}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2 w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add New
        </Button>
      </div>

      <Separator />

      {getSizesLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <MainLoading />
        </div>
      ) : (
        <>
          {sizes?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-6 pb-12">
              {sizes?.map((size: any) => (
                <div
                  key={size.id}
                  className="group relative flex flex-col items-center justify-between w-full aspect-square rounded-2xl border border-border bg-white shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 p-4"
                >
                  <div className="absolute top-2 right-2 flex gap-1 ">
                    <Button
                      onClick={() => handleEdit(size)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-gray-100 hover:bg-primary hover:text-white"
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteRequest(size)}
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full bg-gray-100 hover:bg-destructive hover:text-white"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>

                  <div className="flex-1 flex items-center justify-center w-full">
                    <span className="text-4xl font-black text-foreground tracking-tighter">
                      {size.valueSize}
                    </span>
                  </div>

                  <div className="w-full text-center border-t border-dashed pt-2 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground truncate">
                      {size.labelEn}
                    </p>
                    {size.labelAr && (
                      <p className="text-[10px] text-muted-foreground/70 truncate mt-0.5">
                        {size.labelAr}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] text-muted-foreground">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Ruler className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">No Sizes Found</p>
              <p className="text-sm opacity-70">
                Start by adding size charts (e.g. 41, 42, XL).
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllSizes;
