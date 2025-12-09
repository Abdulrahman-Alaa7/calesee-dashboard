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
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, X } from "lucide-react";
import Image from "next/image";
import MainLoading from "@/components/ui/main-loading";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { CREATE_CATEGORY } from "../../graphql/actions/mutations/category/createCategory";
import { UPDATE_CATEGORY } from "../../graphql/actions/mutations/category/updateCategory";
import { GET_ALL_CATEGORIES } from "../../graphql/actions/queries/category/getAllCategories";

const formSchema = z.object({
  nameEn: z
    .string()
    .min(2, { message: "English name is required (min 2 chars)" }),
  nameAr: z.string().optional(),
  image: z.any().optional(),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

  const isLoading = creating || updating;
  const title = initialData ? "Edit Category" : "Add New Category";
  const action = initialData ? "Save Changes" : "Create Category";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      image: undefined,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nameEn: initialData.nameEn,
        nameAr: initialData.nameAr || "",
      });
      setImagePreview(initialData.imageUrl);
      setImageFile(null);
    } else {
      form.reset({
        nameEn: "",
        nameAr: "",
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

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (!initialData && !imageFile) {
        toast.error("Image is required for new categories.");
        return;
      }

      if (initialData) {
        const updateVariables: any = {
          id: initialData.id,
          nameEn: values.nameEn,
          nameAr: values.nameAr,
        };

        if (imageFile) {
          updateVariables.image = imageFile;
        }

        await updateCategory({
          variables: updateVariables,
          refetchQueries: [{ query: GET_ALL_CATEGORIES }],
        });
        toast.success("Category updated successfully");
      } else {
        await createCategory({
          variables: {
            nameEn: values.nameEn,
            nameAr: values.nameAr,
            image: imageFile,
          },
          refetchQueries: [{ query: GET_ALL_CATEGORIES }],
        });
        toast.success("Category created successfully");
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[360px] sm:max-w-[500px] !rounded-3xl">
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
                Category Image <span className="text-red-500">*</span>
              </FormLabel>

              {!imagePreview ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
                      <ImagePlus className="w-10 h-10 mb-2 opacity-50" />
                      <p className="mb-1 text-sm font-semibold">
                        Click to upload
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

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name (English) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g. Electronics"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem dir="rtl">
                    <FormLabel>الاسم (بالعربي)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="مثال: إلكترونيات"
                        {...field}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
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
