"use client";
import { useState } from "react";
import { Pencil, Plus, Trash2, Search, Hash } from "lucide-react";
import { Button } from "../ui/button";
import { AlertModal } from "../ui/alert-modal";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import MainLoading from "../ui/main-loading";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { SeoModal } from "./SeoForm";
import { DELETE_SEO } from "../../graphql/actions/mutations/seo/deleteSeo";
import { GET_SEO } from "@/graphql/actions/queries/seo/getSeo";

type Props = {};

const AllSeo = (props: Props) => {
  const { data, loading: getLoading } = useQuery(GET_SEO);
  const [deleteSeo, { loading: loadingDelete }] = useMutation(DELETE_SEO);

  const seoRecords = data?.getSeos;

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  // const handleCreate = () => {
  //   setSelectedItem(null);
  //   setOpenFormModal(true);
  // };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setOpenFormModal(true);
  };

  // const handleDeleteRequest = (item: any) => {
  //   setSelectedItem(item);
  //   setOpenDeleteAlert(true);
  // };

  const onConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteSeo({
        variables: { id: selectedItem.id },
        refetchQueries: [{ query: GET_SEO }],
      });
      toast.success("SEO Record deleted successfully");
      setOpenDeleteAlert(false);
      setSelectedItem(null);
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
          setSelectedItem(null);
        }}
        onConfirm={onConfirmDelete}
        loading={loadingDelete}
      />

      <SeoModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        initialData={selectedItem}
      />

      <div className="flex items-center justify-between my-4">
        <HeadPage
          title={`SEO Manager ${
            getLoading ? `...` : `(${seoRecords?.length || 0})`
          }`}
          description="Manage Meta Titles, Descriptions, and Keywords"
        />

        {/* <Button
          onClick={handleCreate}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2 w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add Page
        </Button> */}
      </div>

      <Separator />

      {getLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <MainLoading />
        </div>
      ) : (
        <>
          {seoRecords?.length > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 pb-12">
              {seoRecords?.map((item: any) => (
                <div
                  key={item.id}
                  className="relative flex flex-col p-6 rounded-2xl border border-border bg-white shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4 border-b pb-3 border-dashed">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-primary">
                        <Hash size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                          Page
                        </p>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.page}
                        </h3>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        onClick={() => handleEdit(item)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-primary"
                      >
                        <Pencil size={16} />
                      </Button>
                      {/* <Button
                        onClick={() => handleDeleteRequest(item)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button> */}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 flex-1">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                        English Preview
                      </p>
                      <div className="font-sans">
                        <h4 className="text-black-600 text-sm font-medium hover:underline truncate cursor-pointer">
                          {item.titleEn}
                        </h4>
                        <p className="text-green-700 text-xs mb-1">
                          https://calesee.com/en/{item.page.toLowerCase()}
                        </p>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {item.descEn}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.keywordsEn
                          ?.slice(0, 5)
                          .map((k: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 font-normal !text-gray-900 bg-gray-200/50"
                            >
                              {k}
                            </Badge>
                          ))}
                        {item.keywordsEn?.length > 5 && (
                          <span className="text-[10px] text-gray-400 flex items-center">
                            +{item.keywordsEn.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className="p-3 bg-gray-50 rounded-xl border border-gray-100"
                      dir="rtl"
                    >
                      <p className="text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1">
                        معاينة بالعربي
                      </p>
                      <div className="font-sans">
                        <h4 className="text-black-600 text-sm font-medium  truncate ">
                          {item.titleAr}
                        </h4>
                        <p className="text-green-700 text-xs mb-1">
                          https://calesee.com/ar/{item.page.toLowerCase()}
                        </p>
                        <p className="text-gray-600 text-xs line-clamp-2">
                          {item.descAr}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.keywordsAr
                          ?.slice(0, 5)
                          .map((k: string, i: number) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 font-normal !text-gray-900 bg-gray-200/50"
                            >
                              {k}
                            </Badge>
                          ))}
                        {item.keywordsAr?.length > 5 && (
                          <span className="text-[10px] text-gray-400 flex items-center">
                            +{item.keywordsAr.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] text-muted-foreground">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Search className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">No SEO Records Found</p>
              <p className="text-sm opacity-70">
                Start by configuring SEO for your main pages.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllSeo;
