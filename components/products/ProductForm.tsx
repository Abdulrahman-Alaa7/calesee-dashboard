"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import clsx from "clsx";
import {
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  Check,
  Star,
  X,
} from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GET_ALL_CATEGORIES } from "@/graphql/actions/queries/category/getAllCategories";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_COLORS } from "@/graphql/actions/queries/colors/getAllColors";
import { GET_ALL_SIZES } from "@/graphql/actions/queries/sizes/getAllSizes";
import MainLoading from "../ui/main-loading";
import {
  CREATE_PRODUCT,
  GET_PRODUCTS_ADMIN,
  UPDATE_PRODUCT,
} from "@/graphql/actions/products/adminProducts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

const colorInSizeSchema = z.object({
  id: z.string().optional(),
  hex: z.string(),
  nameEn: z.string().optional().default("").nullable(),
  nameAr: z.string().optional().default("").nullable(),
  soldout: z.boolean().optional().default(false),
  catalogColorId: z.string().optional().nullable(),
});

const sizeSchema = z.object({
  id: z.string().optional(),
  valueSize: z.string(),
  soldout: z.boolean().optional().default(false),
  catalogSizeId: z.string().optional().nullable(),
  colors: z.array(colorInSizeSchema).optional().default([]),
});

const imageSchema = z.object({
  id: z.string(),
  file: z.any().optional(),
  preview: z.string(),
  linkedColorHex: z.string().optional().nullable(),
  isMain: z.boolean().optional().default(false),
  existingUrl: z.string().nullable().optional(),
});

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  category: z.string().min(1),
  price: z.coerce.number().min(10),
  estimatedPrice: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.coerce.number().optional()
  ),
  sku: z.string().optional(),
  publicPro: z.boolean().default(true),
  soldOut: z.boolean().default(false),
  descriptionEn: z.string().optional().default(""),
  descriptionAr: z.string().optional().default(""),
  keywordsEn: z.string().optional().default(""),
  keywordsAr: z.string().optional().default(""),
  images: z.array(imageSchema).min(1).max(MAX_IMAGES).optional().default([]),
  sizes: z.array(sizeSchema).optional().default([]),
});

type FormValues = z.infer<typeof formSchema>;

const ImageDisplay = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const isBlob = src?.startsWith?.("blob:") || src?.startsWith?.("data:");
  // eslint-disable-next-line @next/next/no-img-element
  if (isBlob) return <img src={src} alt={alt} className={className} />;
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
};

export default function ProductFormAdvanced({
  initialProduct,
  onSuccess,
}: {
  initialProduct?: any;
  onSuccess?: (product: any) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const isEdit = !!initialProduct;

  const initialImageIdsRef = useRef<string[]>([]);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data, loading: getCategoiesLoading } = useQuery(GET_ALL_CATEGORIES);
  const categories = data?.getCategories || [];

  const { data: colorsData, loading: getColorsLoading } =
    useQuery(GET_ALL_COLORS);
  const colors = colorsData?.getColors || [];

  const { data: sizesData, loading: getSizesLoading } = useQuery(GET_ALL_SIZES);
  const sizesCatalog = sizesData?.getSizes || [];

  const [createProductMutation] = useMutation(CREATE_PRODUCT, {
    refetchQueries: ["GetProductsAdmin"],
    awaitRefetchQueries: true,
  });

  const [updateProductMutation] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: ["GetProductsAdmin"],
    awaitRefetchQueries: true,
  });

  const hasExistingMain = initialProduct?.images?.some(
    (img: any) => img.isMain
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialProduct?.id || uuidv4(),
      name: initialProduct?.name || "",
      category: initialProduct?.categoryId || "",
      price: initialProduct?.price || 0,
      estimatedPrice:
        initialProduct?.estimatedPrice !== null
          ? initialProduct?.estimatedPrice
          : undefined,
      sku: initialProduct?.sku ?? "",
      publicPro: initialProduct?.publicPro ?? true,
      soldOut: initialProduct?.soldOut ?? false,
      descriptionEn: initialProduct?.descriptionEn || "",
      descriptionAr: initialProduct?.descriptionAr || "",
      keywordsEn: Array.isArray(initialProduct?.keywordsEn)
        ? initialProduct.keywordsEn.join(", ")
        : initialProduct?.keywordsEn || "",
      keywordsAr: Array.isArray(initialProduct?.keywordsAr)
        ? initialProduct.keywordsAr.join(", ")
        : initialProduct?.keywordsAr || "",
      images: initialProduct?.images
        ? initialProduct.images.map((img: any, idx: number) => {
            const id = img.id || uuidv4();
            if (!initialImageIdsRef.current.includes(id))
              initialImageIdsRef.current.push(id);
            const url = img.url || img.existingUrl || "";
            return {
              id,
              preview: url,
              file: undefined,
              isMain: !!img.isMain || (!hasExistingMain && idx === 0),
              linkedColorHex: img.linkedColorHex ?? null,
              existingUrl: url || null,
            };
          })
        : [],
      sizes: initialProduct?.sizes
        ? initialProduct.sizes.map((s: any) => ({
            id: s.id || uuidv4(),
            valueSize: s.sizeValue,
            soldout: !!s.soldout,
            catalogSizeId: s.catalogSizeId ?? null,
            colors: (s.colors || []).map((c: any) => ({
              id: c.id || uuidv4(),
              hex: c.hex,
              nameEn: c.nameEn || "",
              nameAr: c.nameAr || "",
              soldout: !!c.soldout,
              catalogColorId: c.catalogColorId ?? null,
            })),
          }))
        : [],
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = form;

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: sizesFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({ control, name: "sizes" });

  const watchedImages = watch("images") || [];
  const watchedSizes = watch("sizes") || [];

  const [deletedImageIds, setDeletedImageIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    return () => {
      (getValues("images") || []).forEach((im: any) => {
        if (im.preview?.startsWith?.("blob:")) URL.revokeObjectURL(im.preview);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValidImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setValidationError("Only image files are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setValidationError(`Max image size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return false;
    }
    return true;
  };

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const currentCount = getValues("images")?.length || 0;
    if (currentCount + files.length > MAX_IMAGES) {
      setValidationError(`Max ${MAX_IMAGES} images allowed.`);
      return;
    }

    Array.from(files).forEach((file) => {
      if (!isValidImageFile(file)) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        appendImage({
          id: uuidv4(),
          file,
          preview: dataUrl,
          linkedColorHex: null,
          isMain: getValues("images").length === 0,
          existingUrl: null,
        } as any);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    setValidationError(null);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    const currentCount = getValues("images")?.length || 0;
    if (currentCount + files.length > MAX_IMAGES) {
      setValidationError(`Max ${MAX_IMAGES} images allowed.`);
      return;
    }
    Array.from(files).forEach((file) => {
      if (!isValidImageFile(file)) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        appendImage({
          id: uuidv4(),
          file,
          preview: dataUrl,
          linkedColorHex: null,
          isMain: getValues("images").length === 0,
          existingUrl: null,
        } as any);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const current = getValues("images") || [];
    const removed = current[index];
    if (removed?.existingUrl && removed?.id) {
      setDeletedImageIds((prev) => {
        const next = new Set(prev);
        next.add(removed.id);
        return next;
      });
    }
    if (removed?.preview?.startsWith?.("blob:"))
      URL.revokeObjectURL(removed.preview);
    removeImage(index);
  };

  const setMainImage = (index: number) => {
    const updated = getValues("images").map((im, i) => ({
      ...im,
      isMain: i === index,
    }));
    setValue("images", updated);
  };

  const setImageColorLink = (index: number, colorHex: string | null) => {
    setValue(`images.${index}.linkedColorHex`, colorHex);
  };

  const addColorToSize = (
    index: number,
    catalogColorId?: string,
    customHex?: string,
    nameEn?: string,
    nameAr?: string
  ) => {
    const currentColors = getValues(`sizes.${index}.colors`) || [];

    let colorObj: any;
    if (catalogColorId) {
      const c = colors.find((x: any) => x.id === catalogColorId)!;
      colorObj = {
        id: uuidv4(),
        hex: c.hex,
        nameEn: c.nameEn,
        nameAr: c.nameAr,
        soldout: false,
        catalogColorId: c.id,
      };
    } else if (customHex) {
      colorObj = {
        id: uuidv4(),
        hex: customHex,
        nameEn: nameEn || customHex,
        nameAr: nameAr || customHex,
        soldout: false,
        catalogColorId: null,
      };
    } else return;

    if (
      currentColors.some(
        (c: any) => c.hex.toLowerCase() === colorObj.hex.toLowerCase()
      )
    )
      return;

    setValue(`sizes.${index}.colors`, [...currentColors, colorObj]);
  };

  const removeColorFromSize = (sizeIndex: number, colorIndex: number) => {
    const currentColors = getValues(`sizes.${sizeIndex}.colors`) || [];
    const updated = currentColors.filter(
      (_: any, idx: number) => idx !== colorIndex
    );
    setValue(`sizes.${sizeIndex}.colors`, updated);
  };

  const toggleColorSoldout = (
    sizeIndex: number,
    colorIndex: number,
    val: boolean
  ) => {
    const currentColors = getValues(`sizes.${sizeIndex}.colors`) || [];
    const updated = currentColors.map((c: any, i: number) =>
      i === colorIndex ? { ...c, soldout: val } : c
    );
    setValue(`sizes.${sizeIndex}.colors`, updated);
  };

  const toggleSizeSoldout = (index: number, val: boolean) => {
    setValue(`sizes.${index}.soldout`, val);
  };

  const addSizeFromCatalog = (sizeId: string) => {
    const s = sizesCatalog.find((x: any) => x.id === sizeId);
    if (!s) return;
    if (getValues("sizes").some((c: any) => c.valueSize === s.valueSize))
      return;
    appendSize({
      id: uuidv4(),
      valueSize: s.valueSize,
      soldout: false,
      catalogSizeId: s.id,
      colors: [],
    } as any);
  };

  const uniqueColors = Array.from(
    new Set(
      watchedSizes
        .flatMap((s) => s.colors || [])
        .map((c) => JSON.stringify({ hex: c.hex, name: c.nameEn }))
    )
  ).map((str) => JSON.parse(str));

  const onSubmit = async (values: FormValues) => {
    setValidationError(null);
    setUploadError(null);
    setUploadProgress(0);
    setUploading(true);

    try {
      const payloadBase: any = {
        name: values.name,
        categoryId: values.category,
        price: values.price,
        estimatedPrice:
          values.estimatedPrice !== undefined ? values.estimatedPrice : null,
        sku: values.sku || null,
        publicPro: values.publicPro,
        soldOut: values.soldOut,
        descriptionEn: values.descriptionEn || "",
        descriptionAr: values.descriptionAr || "",
        keywordsEn: (values.keywordsEn || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        keywordsAr: (values.keywordsAr || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const sizesPayload =
        (values.sizes || []).map((s: any) => ({
          id: s.id,
          sizeValue: s.valueSize,
          catalogSizeId: s.catalogSizeId ?? null,
          soldout: !!s.soldout,
          colors: (s.colors || []).map((c: any) => ({
            id: c.id,
            hex: c.hex,
            nameEn: c.nameEn || "",
            nameAr: c.nameAr || "",
            soldout: !!c.soldout,
            catalogColorId: c.catalogColorId ?? null,
          })),
        })) || [];

      const currentImages = (values.images || []).map((im) => {
        const base: any = {
          id: im.id,
          isMain: !!im.isMain,
          linkedColorHex: im.linkedColorHex ?? null,
        };
        if (im.file instanceof File) {
          base.file = im.file;
        } else {
          base.existingUrl = im.existingUrl ?? im.preview ?? null;
        }
        return base;
      });

      const currentIds = new Set(currentImages.map((i) => i.id));
      const deletedArray = Array.from(deletedImageIds)
        .filter((id) => !currentIds.has(id))
        .map((id) => ({ id, deleted: true }));

      const imagesPayload = [...currentImages, ...deletedArray];

      const input = isEdit
        ? {
            id: values.id,
            ...payloadBase,
            images: imagesPayload,
            sizes: sizesPayload,
          }
        : {
            ...payloadBase,
            images: imagesPayload,
            sizes: sizesPayload,
          };

      setUploadProgress(60);

      const { data: resp } = await (isEdit
        ? updateProductMutation({
            variables: { input },
            refetchQueries: [{ query: GET_PRODUCTS_ADMIN }],
            awaitRefetchQueries: true,
          })
        : createProductMutation({
            variables: { input },
            refetchQueries: [{ query: GET_PRODUCTS_ADMIN }],
            awaitRefetchQueries: true,
          }));

      setUploadProgress(100);

      const product = isEdit
        ? resp?.updateProduct?.product
        : resp?.createProduct?.product;

      toast.success(
        isEdit ? "Product updated successfully" : "Product created successfully"
      );

      if (onSuccess) onSuccess(product);

      router.push("/dashboard/products");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Upload error";
      setUploadError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const nextStep = async () => {
    let fields: any[] = [];
    if (step === 1) fields = ["name", "category", "price"];
    if (step === 3) fields = ["images"];
    const isValid = await trigger(fields);
    if (isValid) setStep((s) => s + 1);
  };

  return (
    <div className="max-w-[350px] sm:max-w-7xl md:max-w-full mx-auto pt-6 pb-24">
      <Card className=" border bg-white rounded-3xl">
        <CardHeader className="border-b bg-slate-50/60  ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {isEdit ? "Edit Product" : "Create New Product"}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                Manage your inventory.
              </p>
            </div>
            <div className=" flex items-center bg-slate-100 p-1.5 rounded-full overflow-x-auto no-scrollbar mx-auto md:mr-0">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={clsx(
                    "px-3 sm:px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                    step === s
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {s === 1
                    ? "Basic"
                    : s === 2
                    ? "Variants"
                    : s === 3
                    ? "Images"
                    : "Review"}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 md:p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="md:col-span-8 space-y-6">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Product Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Product name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={control}
                        name="descriptionEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (EN)</FormLabel>
                            <FormControl>
                              <Textarea
                                className="h-32 resize-none"
                                {...field}
                                placeholder="Description En.."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="descriptionAr"
                        render={({ field }) => (
                          <FormItem dir="rtl">
                            <FormLabel>الوصف (عربي)</FormLabel>
                            <FormControl>
                              <Textarea
                                className="h-32 resize-none text-right"
                                {...field}
                                placeholder="الوصف عربي.."
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="keywordsEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Keywords (EN) (comma separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Boots,Sneakers.. "
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="keywordsAr"
                        render={({ field }) => (
                          <FormItem dir="rtl">
                            <FormLabel>
                              الكلمات الرئيسية (مفصولة بفاصلة)
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="text-right"
                                {...field}
                                placeholder="احذية, شباشب"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-4 space-y-6">
                    <Card className="bg-slate-50 border-slate-100 rounded-3xl">
                      <CardContent className="p-4 space-y-4">
                        <FormField
                          control={control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Category <span className="text-red-500">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getCategoiesLoading ? (
                                    <div className="flex justify-center items-center mx-auto">
                                      <MainLoading />
                                    </div>
                                  ) : (
                                    <>
                                      {categories.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                          {c.nameEn} / {c.nameAr}
                                        </SelectItem>
                                      ))}
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Price <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="bg-white"
                                  {...field}
                                  placeholder="0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="estimatedPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Est. Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="bg-white"
                                  placeholder="0"
                                  {...field}
                                  value={field.value ?? ""}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="sku"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SKU</FormLabel>
                              <FormControl>
                                <Input
                                  className="bg-white"
                                  {...field}
                                  placeholder="EG12345"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-50 border-slate-100 rounded-3xl">
                      <CardContent className="p-4 space-y-4">
                        <FormField
                          control={control}
                          name="publicPro"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between bg-white p-3.5 rounded-full border">
                              <div className="space-y-0.5">
                                <FormLabel>Public</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="soldOut"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between bg-white p-3.5 rounded-full border">
                              <div className="space-y-0.5">
                                <FormLabel>Global Sold Out</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-dashed border-slate-300">
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                      <div className="flex-1 w-full">
                        <Label className="mb-2 block font-semibold">
                          Add Size
                        </Label>
                        <div className="flex gap-2">
                          <Select onValueChange={addSizeFromCatalog} value="">
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select Standard Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {getSizesLoading ? (
                                <div className="flex justify-center items-center mx-auto">
                                  <MainLoading />
                                </div>
                              ) : (
                                <>
                                  {sizesCatalog.map((s: any) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.valueSize}
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sizesFields.length === 0 && (
                      <div className="text-center py-12 text-slate-400 md:col-span-2 border rounded-3xl">
                        No sizes added yet.
                      </div>
                    )}

                    {sizesFields.map((sizeField, sIdx) => {
                      const currentSize = watchedSizes[sIdx];
                      return (
                        <Card
                          key={sizeField.id}
                          className="overflow-hidden border-l-4 border-l-primary/80 shadow-sm "
                        >
                          <CardHeader className="pb-3 bg-slate-50/50 border-b px-4 pt-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary text-white min-w-[2.5rem] h-10 flex items-center justify-center rounded-md font-bold text-lg px-2">
                                  {currentSize.valueSize}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    id={`sold-${sizeField.id}`}
                                    checked={currentSize.soldout}
                                    onCheckedChange={(c) =>
                                      toggleSizeSoldout(sIdx, !!c)
                                    }
                                  />
                                  <Label
                                    htmlFor={`sold-${sizeField.id}`}
                                    className="cursor-pointer text-xs text-slate-600 font-medium"
                                  >
                                    Sold Out
                                  </Label>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                onClick={() => removeSize(sIdx)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4 px-4">
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <Select
                                  value=""
                                  onValueChange={(v) => addColorToSize(sIdx, v)}
                                >
                                  <SelectTrigger className="h-12 text-sm w-full bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="+ Add Color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getColorsLoading ? (
                                      <div className="flex justify-center items-center mx-auto">
                                        <MainLoading />
                                      </div>
                                    ) : (
                                      <>
                                        {colors.map((c: any) => (
                                          <SelectItem key={c.id} value={c.id}>
                                            <div className="flex items-center gap-2">
                                              <div
                                                className="w-6 h-6 rounded-full border"
                                                style={{
                                                  backgroundColor: c.hex,
                                                }}
                                              />{" "}
                                              {c.nameEn} - {c.nameAr}
                                            </div>
                                          </SelectItem>
                                        ))}
                                      </>
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex flex-wrap gap-2 min-h-[2rem]">
                                {currentSize.colors?.map(
                                  (col: any, cIdx: number) => (
                                    <div
                                      key={col.id || cIdx}
                                      className={clsx(
                                        "flex items-center gap-2 px-5 py-3  border text-xs bg-white shadow-sm rounded-3xl",
                                        col.soldout && "opacity-60 bg-slate-100"
                                      )}
                                    >
                                      <div
                                        className="w-4 h-4 rounded-full border shadow-sm"
                                        style={{ backgroundColor: col.hex }}
                                      />
                                      <span className="max-w-[80px] truncate font-medium">
                                        {col.nameEn || col.hex}
                                      </span>
                                      <div className="h-5 w-px bg-slate-200 mx-1" />
                                      <Checkbox
                                        checked={col.soldout}
                                        onCheckedChange={(c) =>
                                          toggleColorSoldout(sIdx, cIdx, !!c)
                                        }
                                        className="w-6 h-6 rounded-[8px]"
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeColorFromSize(sIdx, cIdx)
                                        }
                                        className="text-slate-400 hover:text-red-500 ml-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )
                                )}
                                {!currentSize.colors?.length && (
                                  <span className="text-xs text-slate-400 italic py-1">
                                    No colors added yet.
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border">
                    <div>
                      <h3 className="text-sm sm:text-lg font-semibold">
                        Product Gallery
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageInput}
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="bg-primary text-white hover:bg-primary/90"
                        disabled={uploading}
                      >
                        <UploadCloud className="w-4 h-4 mr-2" /> Upload
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current = getValues("images") || [];
                          current.forEach((im: any) => {
                            if (im.existingUrl && im.id) {
                              setDeletedImageIds((prev) => {
                                const next = new Set(prev);
                                next.add(im.id);
                                return next;
                              });
                            }
                            if (im.preview?.startsWith?.("blob:"))
                              URL.revokeObjectURL(im.preview);
                          });
                          setValue("images", []);
                        }}
                        disabled={watchedImages.length === 0 || uploading}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  {validationError && (
                    <div className="text-red-600 text-sm">
                      {validationError}
                    </div>
                  )}

                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDropFiles}
                  >
                    {imageFields.map((field, idx) => {
                      const img = watchedImages[idx];
                      return (
                        <Card
                          key={field.id}
                          className={clsx(
                            "group relative overflow-hidden transition-all border-2",
                            img.isMain
                              ? "border-primary/80 shadow-md"
                              : "border-transparent hover:border-slate-200"
                          )}
                        >
                          <div
                            className="relative h-64 bg-slate-50 cursor-pointer"
                            onClick={() => setMainImage(idx)}
                          >
                            <ImageDisplay
                              src={img.preview}
                              alt={`img-${idx}`}
                              className="w-full h-full object-cover"
                            />
                            {img.isMain && (
                              <div className="absolute top-3 left-3 bg-primary/90 text-white px-2 py-1 rounded shadow text-xs font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Main
                                Image
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 p-2 rounded-full text-slate-500 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={uploading}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="p-3 space-y-3 bg-white border-t">
                            <Select
                              value={img.linkedColorHex || "none"}
                              onValueChange={(v) =>
                                setImageColorLink(idx, v === "none" ? null : v)
                              }
                            >
                              <SelectTrigger className="h-9 text-xs w-full">
                                <SelectValue placeholder="Link to Color Variant" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">
                                  No Color Link
                                </SelectItem>
                                {uniqueColors.map((c: any) => (
                                  <SelectItem key={c.hex} value={c.hex}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full border"
                                        style={{ backgroundColor: c.hex }}
                                      />{" "}
                                      {c.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => setMainImage(idx)}
                            >
                              <div
                                className={clsx(
                                  "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                  img.isMain
                                    ? "border-primary/80 bg-primary/80"
                                    : "border-slate-300"
                                )}
                              >
                                {img.isMain && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </div>
                              <span
                                className={clsx(
                                  "text-sm font-medium select-none",
                                  img.isMain ? "text-primary" : "text-slate-500"
                                )}
                              >
                                Set as Main Image
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>

                  {imageFields.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-xl h-64 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50">
                      <ImageIcon className="w-16 h-16 opacity-20" />
                      <span>No images uploaded yet.</span>
                    </div>
                  )}

                  {uploading && (
                    <div className="w-full bg-slate-100 rounded p-2">
                      <div className="text-xs mb-1">
                        Uploading: {uploadProgress}%
                      </div>
                      <div className="w-full bg-slate-200 h-3 rounded overflow-hidden">
                        <div
                          className="h-3 rounded bg-primary transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {uploadError && (
                    <div className="text-red-600 text-sm mt-2">
                      {uploadError}
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Details</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-slate-500 block">Name</Label>
                          <span className="font-medium">
                            {getValues("name")}
                          </span>
                        </div>
                        <div>
                          <Label className="text-slate-500 block">Price</Label>
                          <span className="font-medium">
                            {getValues("price")} EGP
                          </span>
                        </div>
                        {getValues("estimatedPrice") && (
                          <div>
                            <Label className="text-slate-500 block">
                              Est.Price
                            </Label>
                            {getValues("estimatedPrice")
                              ? `${getValues("estimatedPrice")} EGP`
                              : "_"}
                          </div>
                        )}
                        <div>
                          <Label className="text-slate-500 block">
                            Category
                          </Label>
                          <span>
                            {categories.find(
                              (c: any) => c.id === getValues("category")
                            )?.nameEn || "-"}
                          </span>
                        </div>
                        <div>
                          <Label className="text-slate-500 block">
                            Visibility
                          </Label>
                          <div className="flex gap-1 mt-1">
                            {getValues("publicPro") ? (
                              <Badge className="bg-green-100 !text-green-800 hover:bg-green-100">
                                Public
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="!text-black"
                              >
                                Hidden
                              </Badge>
                            )}
                            {getValues("soldOut") && (
                              <Badge variant="destructive">Sold Out</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-slate-500 block">Images</Label>
                          <span className="font-medium text-2xl">
                            {watchedImages.length}
                          </span>
                        </div>
                        <div>
                          <Label className="text-slate-500 block">
                            Variants
                          </Label>
                          <span className="font-medium text-2xl">
                            {watchedSizes.length}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Inventory Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border divide-y overflow-hidden">
                        {watchedSizes.map((s, i) => (
                          <div
                            key={i}
                            className="p-3 flex items-center justify-between bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-slate-100 px-3 py-1 rounded font-bold text-sm">
                                {s.valueSize}
                              </div>
                              {s.soldout && (
                                <Badge
                                  variant="outline"
                                  className="!text-red-500 border-red-200"
                                >
                                  Sold Out
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
                              {s.colors?.length ? (
                                s.colors.map((c, ci) => (
                                  <div
                                    key={ci}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-50 rounded text-[10px] border"
                                    title={c.nameEn || ""}
                                  >
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: c.hex }}
                                    />
                                    {c.soldout && (
                                      <span className="text-red-500 font-bold ml-1">
                                        ×
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <span className="text-slate-400 text-xs">
                                  No colors
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {watchedSizes.length === 0 && (
                          <div className="p-4 text-center text-slate-400 text-sm">
                            No inventory added.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>Saving... {uploadProgress}%</>
                      ) : (
                        <>{isEdit ? "Save Changes" : "Create Product"}</>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step < 4 && (
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      step > 1 ? setStep((s) => s - 1) : window.history.back()
                    }
                    className="text-slate-500"
                    disabled={uploading}
                  >
                    {step === 1 ? "Cancel" : "Back"}
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="min-w-[140px] bg-primary text-white hover:bg-primary/80"
                    disabled={uploading}
                  >
                    Next Step
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
