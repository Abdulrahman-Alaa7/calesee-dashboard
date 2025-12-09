"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import MainLoading from "@/components/ui/main-loading";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { CREATE_LANDING } from "../../graphql/actions/mutations/landing/createLanding";
import { UPDATE_LANDING } from "../../graphql/actions/mutations/landing/updateLanding";
import { GET_ALL_LANDINGS } from "@/graphql/actions/queries/landing/getAllLanding";

const formSchema = z.object({
  titleEn: z.string().min(3, "Title (EN) is required"),
  titleAr: z.string().min(3, "Title (AR) is required"),
  descEn: z.string().min(4, "Description (EN) is required"),
  descAr: z.string().min(4, "Description (AR) is required"),
  linkTitleEn: z.string().min(4, "link's Title En is required"),
  linkTitleAr: z.string().min(4, "link's Title Ar is required"),
  link: z.string().url("Must be a valid URL"),
  image: z.any().optional(),
});

type LandingFormValues = z.infer<typeof formSchema>;

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const LandingModal: React.FC<LandingModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createLanding, { loading: creating }] = useMutation(CREATE_LANDING);
  const [updateLanding, { loading: updating }] = useMutation(UPDATE_LANDING);

  const isLoading = creating || updating;
  const title = initialData ? "Edit Slide" : "Add New Slide";
  const action = initialData ? "Save Changes" : "Create Slide";

  const form = useForm<LandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      descEn: "",
      descAr: "",
      link: "",
      linkTitleEn: "",
      linkTitleAr: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        descEn: initialData.descEn,
        descAr: initialData.descAr,
        link: initialData.link,
        linkTitleEn: initialData.linkTitleEn,
        linkTitleAr: initialData.linkTitleAr,
      });
      setImagePreview(initialData.image);
      setImageFile(null);
    } else {
      form.reset({
        titleEn: "",
        titleAr: "",
        descEn: "",
        descAr: "",
        link: "",
        linkTitleEn: "",
        linkTitleAr: "",
        image: undefined,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, isOpen, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setValue("image", file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    form.setValue("image", undefined);
  };

  const onSubmit = async (values: LandingFormValues) => {
    try {
      if (!initialData && !imageFile) {
        toast.error("Image is required for new slides.");
        return;
      }

      const variables: any = {
        titleEn: values.titleEn,
        titleAr: values.titleAr,
        descEn: values.descEn,
        descAr: values.descAr,
        link: values.link,
        linkTitleEn: values.linkTitleEn,
        linkTitleAr: values.linkTitleAr,
      };

      if (initialData) {
        variables.id = initialData.id;
        if (imageFile) variables.image = imageFile;

        await updateLanding({
          variables: variables,
          refetchQueries: [{ query: GET_ALL_LANDINGS }],
        });
        toast.success("Slide updated successfully");
      } else {
        variables.image = imageFile;
        await createLanding({
          variables: variables,
          refetchQueries: [{ query: GET_ALL_LANDINGS }],
        });
        toast.success("Slide created successfully");
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="space-y-2">
              <FormLabel>
                Banner Image <span className="text-red-500">*</span>
              </FormLabel>
              {!imagePreview ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                      <ImagePlus className="w-10 h-10 mb-2 opacity-50" />
                      <p className="mb-1 text-sm font-semibold">
                        Upload Banner (1920x600 recommended)
                      </p>
                      <p className="text-xs">SVG, PNG, JPG or WEBP</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border group">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="rounded-full w-10 h-10"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 p-4 border rounded-xl bg-gray-50/50">
                <h3 className="font-semibold text-sm text-gray-500">
                  English Content
                </h3>
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (EN)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          {...field}
                          placeholder="Title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          disabled={isLoading}
                          {...field}
                          placeholder="Description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 p-4 border rounded-xl bg-gray-50/50">
                <h3 className="font-semibold text-sm text-gray-500 text-right">
                  المحتوى العربي
                </h3>
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem dir="rtl">
                      <FormLabel className="text-right block">
                        العنوان (AR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-right"
                          disabled={isLoading}
                          placeholder="العنوان"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descAr"
                  render={({ field }) => (
                    <FormItem dir="rtl">
                      <FormLabel className="text-right block">
                        الوصف (AR)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          className="text-right"
                          disabled={isLoading}
                          placeholder="الوصف"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="https://example.com/products"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkTitleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Title (En)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className=""
                        placeholder="Shop Now"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkTitleAr"
              render={({ field }) => (
                <FormItem dir="rtl">
                  <FormLabel>عنوان الرابط (بالعربي)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className=""
                        placeholder="تسوق الأن"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button
                disabled={isLoading}
                variant="outline"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                type="submit"
                className="min-w-[120px]"
              >
                {isLoading ? <MainLoading /> : action}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
