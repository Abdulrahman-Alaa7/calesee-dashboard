"use client";
import { useEffect } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Globe } from "lucide-react";
import MainLoading from "@/components/ui/main-loading";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { CREATE_SEO } from "@/graphql/actions/mutations/seo/createSeo";
import { UPDATE_SEO } from "@/graphql/actions/mutations/seo/updateSeo";
import { GET_SEO } from "@/graphql/actions/queries/seo/getSeo";

const formSchema = z.object({
  page: z.string().min(2, "Page identifier is required (e.g., 'Home')"),
  titleEn: z.string().min(3, "Meta Title (EN) is required"),
  titleAr: z.string().min(3, "Meta Title (AR) is required"),
  descEn: z.string().min(10, "Meta Description (EN) is required"),
  descAr: z.string().min(10, "Meta Description (AR) is required"),
  keywordsEn: z.string().min(2, "Keywords (EN) are required"),
  keywordsAr: z.string().min(2, "Keywords (AR) are required"),
});

type SeoFormValues = z.infer<typeof formSchema>;

interface SeoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const SeoModal: React.FC<SeoModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [createSeo, { loading: creating }] = useMutation(CREATE_SEO);
  const [updateSeo, { loading: updating }] = useMutation(UPDATE_SEO);

  const isLoading = creating || updating;
  const title = initialData ? "Edit SEO Metadata" : "Add Page SEO";
  const action = initialData ? "Save Changes" : "Create SEO";

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      page: "",
      titleEn: "",
      titleAr: "",
      descEn: "",
      descAr: "",
      keywordsEn: "",
      keywordsAr: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        page: initialData.page,
        titleEn: initialData.titleEn,
        titleAr: initialData.titleAr,
        descEn: initialData.descEn,
        descAr: initialData.descAr,
        keywordsEn: Array.isArray(initialData.keywordsEn)
          ? initialData.keywordsEn.join(", ")
          : initialData.keywordsEn,
        keywordsAr: Array.isArray(initialData.keywordsAr)
          ? initialData.keywordsAr.join(", ")
          : initialData.keywordsAr,
      });
    } else {
      form.reset({
        page: "",
        titleEn: "",
        titleAr: "",
        descEn: "",
        descAr: "",
        keywordsEn: "",
        keywordsAr: "",
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (values: SeoFormValues) => {
    try {
      const keywordsEnArray = values.keywordsEn
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");
      const keywordsArArray = values.keywordsAr
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");

      const variables: any = {
        page: values.page,
        titleEn: values.titleEn,
        titleAr: values.titleAr,
        descEn: values.descEn,
        descAr: values.descAr,
        keywordsEn: keywordsEnArray,
        keywordsAr: keywordsArArray,
      };

      if (initialData) {
        variables.id = initialData.id;
        await updateSeo({
          variables: variables,
          refetchQueries: [{ query: GET_SEO }],
        });
        toast.success("SEO data updated successfully");
      } else {
        await createSeo({
          variables: variables,
          refetchQueries: [{ query: GET_SEO }],
        });
        toast.success("SEO data created successfully");
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
              <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Page Identifier <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9 font-mono text-sm"
                          placeholder="e.g. Home, About-Us, Store"
                          disabled
                          {...field}
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Unique name to identify this page in your system.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <span className="text-2xl">🇺🇸</span>
                  <h3 className="font-semibold text-gray-700">English SEO</h3>
                </div>

                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title (EN)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Page Title | Brand Name"
                          disabled={isLoading}
                          {...field}
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
                      <FormLabel>Meta Description (EN)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Brief description appearing in search results..."
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywordsEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (EN)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seo, calesee,slippers "
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Separate words with commas (,)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-end gap-2 pb-2 border-b">
                  <h3 className="font-semibold text-gray-700">SEO العربي</h3>
                  <span className="text-2xl">🇸🇦</span>
                </div>

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
                          placeholder="عنوان الصفحة | اسم البراند"
                          disabled={isLoading}
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
                          rows={4}
                          className="text-right"
                          placeholder="وصف مختصر يظهر في نتائج البحث..."
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keywordsAr"
                  render={({ field }) => (
                    <FormItem dir="rtl">
                      <FormLabel className="text-right block">
                        الكلمات المفتاحية (AR)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-right"
                          placeholder="تسويق, محركات بحث, احذية"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-right">
                        افصل بين الكلمات بفاصلة (,)
                      </FormDescription>
                      <FormMessage className="text-right" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t">
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
