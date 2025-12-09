"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { AlertModal } from "../ui/alert-modal";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../../graphql/actions/queries/category/getAllCategories";
import { DELETE_CATEGORY } from "../../graphql/actions/mutations/category/deleteCategory";
import { toast } from "sonner";
import MainLoading from "../ui/main-loading";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { CategoryModal } from "./CategoryForm";

type Props = {};

const AllCategories = (props: Props) => {
  const { data, loading: getCategoiesLoading } = useQuery(GET_ALL_CATEGORIES);
  const [deleteCategory, { loading: loadingDeleteCate }] =
    useMutation(DELETE_CATEGORY);

  const categories = data?.getCategories;

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [openFormModal, setOpenFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const onConfirm = async () => {
    if (!selectedCategoryId) return;
    try {
      setLoading(true);
      await deleteCategory({
        variables: { id: selectedCategoryId },
        refetchQueries: [{ query: GET_ALL_CATEGORIES }],
      });
      toast.success("Category deleted successfully");
      setOpen(false);
      setSelectedCategoryId(null);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setOpenFormModal(true);
  };

  const handleEdit = (category: any) => {
    setSelectedCategory(category);
    setOpenFormModal(true);
  };

  return (
    <div>
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setSelectedCategoryId(null);
        }}
        onConfirm={onConfirm}
        loading={loadingDeleteCate}
      />
      <CategoryModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        initialData={selectedCategory}
      />
      <div className="flex items-start justify-between my-4 ">
        <HeadPage
          title={`Categories ${
            getCategoiesLoading ? `...` : `(${categories?.length})`
          }`}
          description="Manage Categories  from here"
        />

        <Button
          onClick={handleCreate}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2  w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add New
        </Button>
      </div>
      <Separator />
      {getCategoiesLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <MainLoading />
        </div>
      ) : (
        <>
          {categories?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-12">
              {categories?.map((category: any, index: number) => (
                <div
                  key={category.id}
                  className="group relative w-full h-[220px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-100"
                >
                  <Image
                    src={category?.imageUrl}
                    alt={category?.nameEn || "Category Image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                  <div className="absolute top-3 right-3 flex gap-2   transition-all duration-300 z-10">
                    <Button
                      onClick={() => handleEdit(category)}
                      className="flex justify-center items-center w-9 h-9 rounded-full bg-primary/60 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary transition-colors"
                      title="Edit Category"
                    >
                      <Pencil size={18} />
                    </Button>

                    <Button
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setOpen(true);
                      }}
                      variant="ghost"
                      className="flex justify-center items-center w-9 h-9 rounded-full bg-red-400 backdrop-blur-md border border-white/30 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors p-0"
                      title="Delete Category"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-5 z-10">
                    <h2 className="text-white font-bold text-xl leading-tight drop-shadow-sm">
                      {category?.nameEn}
                      <span className="block text-sm font-normal text-gray-200 mt-1 opacity-90">
                        {category?.nameAr}
                      </span>
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] text-muted-foreground">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <span className="text-4xl">📂</span>
              </div>
              <p className="text-lg font-medium">No Categories Found</p>
              <p className="text-sm opacity-70">
                Start by adding a new category to the system.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllCategories;
