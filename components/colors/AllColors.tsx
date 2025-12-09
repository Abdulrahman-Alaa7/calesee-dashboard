"use client";
import { useState } from "react";
import { Copy, Pencil, Plus, Trash2, Palette } from "lucide-react";
import { Button } from "../ui/button";
import { AlertModal } from "../ui/alert-modal";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import MainLoading from "../ui/main-loading";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import { ColorModal } from "./ColorForm";
import { GET_ALL_COLORS } from "../../graphql/actions/queries/colors/getAllColors";
import { DELETE_COLOR } from "../../graphql/actions/mutations/colors/deleteColor";

type Props = {};

const AllColors = (props: Props) => {
  const { data, loading: getColorsLoading } = useQuery(GET_ALL_COLORS);
  const [deleteColor, { loading: loadingDeleteColor }] =
    useMutation(DELETE_COLOR);

  const colors = data?.getColors;

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleCreate = () => {
    setSelectedColor(null);
    setOpenFormModal(true);
  };

  const handleEdit = (color: any) => {
    setSelectedColor(color);
    setOpenFormModal(true);
  };

  const handleDeleteRequest = (color: any) => {
    setSelectedColor(color);
    setOpenDeleteAlert(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedColor) return;
    try {
      await deleteColor({
        variables: { id: selectedColor.id },
        refetchQueries: [{ query: GET_ALL_COLORS }],
      });
      toast.success("Color deleted successfully");
      setOpenDeleteAlert(false);
      setSelectedColor(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex} to clipboard`);
  };

  return (
    <div>
      <AlertModal
        isOpen={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
          setSelectedColor(null);
        }}
        onConfirm={onConfirmDelete}
        loading={loadingDeleteColor}
      />

      <ColorModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        initialData={selectedColor}
      />

      <div className="flex items-center justify-between my-4">
        <HeadPage
          title={`Colors ${
            getColorsLoading ? `...` : `(${colors?.length || 0})`
          }`}
          description="Manage system colors and palettes"
        />

        <Button
          onClick={handleCreate}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2 w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add New
        </Button>
      </div>

      <Separator />

      {getColorsLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <MainLoading />
        </div>
      ) : (
        <>
          {colors?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6 pb-12">
              {colors?.map((color: any) => (
                <div
                  key={color.id}
                  className="group relative flex flex-col w-full h-[200px] rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div
                    className="h-[70%] w-full relative transition-all duration-300"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 bg-black/10  flex items-center justify-center gap-2">
                      <Button
                        onClick={() => handleEdit(color)}
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 text-black hover:bg-white hover:scale-110 transition-all shadow-sm"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        onClick={() => handleDeleteRequest(color)}
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 rounded-full hover:scale-110 transition-all shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="h-[30%] p-3 flex flex-col justify-center bg-white">
                    <div className="flex items-center justify-between">
                      <h3
                        className="font-semibold text-gray-800 truncate text-sm"
                        title={color.nameEn}
                      >
                        {color.nameEn}
                      </h3>
                      <span className="text-xs text-gray-400 font-light">
                        {color.nameAr}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-2 mt-1 cursor-pointer hover:text-primary transition-colors group/hex"
                      onClick={() => copyToClipboard(color.hex)}
                      title="Click to copy"
                    >
                      <p className="text-xs font-mono text-gray-500 uppercase group-hover/hex:font-bold">
                        {color.hex}
                      </p>
                      <Copy size={10} className="text-gray-400 " />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] text-muted-foreground">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Palette className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">No Colors Found</p>
              <p className="text-sm opacity-70">
                Start by adding a new color palette to the system.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllColors;
