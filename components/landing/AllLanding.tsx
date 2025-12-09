"use client";
import { useState } from "react";
import {
  Pencil,
  Plus,
  Trash2,
  ExternalLink,
  LayoutTemplate,
} from "lucide-react";
import { Button } from "../ui/button";
import { AlertModal } from "../ui/alert-modal";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import MainLoading from "../ui/main-loading";
import { HeadPage } from "../ui/HeadPage";
import { Separator } from "../ui/separator";
import Image from "next/image";
import Link from "next/link";
import { LandingModal } from "./LandingForm";
import { DELETE_LANDING } from "@/graphql/actions/mutations/landing/deleteLanding";
import { GET_ALL_LANDINGS } from "@/graphql/actions/queries/landing/getAllLanding";

type Props = {};

const AllLandings = (props: Props) => {
  const { data, loading: getLoading } = useQuery(GET_ALL_LANDINGS);
  const [deleteLanding, { loading: loadingDelete }] =
    useMutation(DELETE_LANDING);

  const landings = data?.getLandings;

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [openFormModal, setOpenFormModal] = useState(false);

  const handleCreate = () => {
    setSelectedItem(null);
    setOpenFormModal(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setOpenFormModal(true);
  };

  const handleDeleteRequest = (item: any) => {
    setSelectedItem(item);
    setOpenDeleteAlert(true);
  };

  const onConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteLanding({
        variables: { id: selectedItem.id },
        refetchQueries: [{ query: GET_ALL_LANDINGS }],
      });
      toast.success("Slide deleted successfully");
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

      <LandingModal
        isOpen={openFormModal}
        onClose={() => setOpenFormModal(false)}
        initialData={selectedItem}
      />

      <div className="flex items-center justify-between my-4">
        <HeadPage
          title={`Landing Slides ${
            getLoading ? `...` : `(${landings?.length || 0})`
          }`}
          description="Manage main slider images and content"
        />

        <Button
          onClick={handleCreate}
          className="text-sm flex justify-center items-center shadow-md bg-primary text-white gap-2 w-[140px] h-[40px] rounded-3xl hover:opacity-85 transition-all"
        >
          <Plus size={17} /> Add Slide
        </Button>
      </div>

      <Separator />

      {getLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <MainLoading />
        </div>
      ) : (
        <>
          {landings?.length > 0 ? (
            <div className="flex flex-col gap-6 mt-6 pb-12">
              {landings?.map((item: any) => (
                <div
                  key={item.id}
                  className="group relative w-full h-[280px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-gray-900 border border-gray-200"
                >
                  <Image
                    src={item.image}
                    alt={item.titleEn}
                    fill
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-transparent" />

                  <div className="absolute top-4 right-4 flex gap-2  duration-300 z-20">
                    <Link
                      href={item.link}
                      target="_blank"
                      className="flex justify-center items-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    <Button
                      onClick={() => handleEdit(item)}
                      className="flex justify-center items-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary transition-colors p-0"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteRequest(item)}
                      variant="ghost"
                      className="flex justify-center items-center w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors p-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full p-8 z-10 flex flex-col items-center gap-2 max-w-[80%]">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-white font-bold text-3xl leading-tight drop-shadow-lg text-center">
                        {item.titleEn}
                      </h2>
                      <h3 className="text-white font-bold text-3xl text-center ">
                        {item.titleAr}
                      </h3>
                      <p className="text-gray-200 text-xs line-clamp-2 mt-2 opacity-80 max-w-[600px] text-center">
                        {item.descEn}
                      </p>
                      <p className="text-gray-200 text-xs line-clamp-2 mt-2 opacity-80 max-w-[600px] text-center">
                        {item.descAr}
                      </p>
                      <div className="flex justify-center items-center gap-2 ">
                        <Button className="text-white text-base line-clamp-2 mt-2 opacity-80 max-w-[600px] text-center">
                          {item.linkTitleEn}
                        </Button>
                        <Button className="text-white text-base line-clamp-2 mt-2 opacity-80 max-w-[600px] text-center">
                          {item.linkTitleAr}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center w-full min-h-[300px] text-muted-foreground">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <LayoutTemplate className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">No Slides Found</p>
              <p className="text-sm opacity-70">
                Start by adding banners for your homepage.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllLandings;
