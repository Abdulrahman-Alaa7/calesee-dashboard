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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLoading from "@/components/ui/main-loading";
import { toast } from "sonner";
import { useMutation } from "@apollo/client";
import { CREATE_COLOR } from "@/graphql/actions/mutations/colors/createColor";
import { UPDATE_COLOR } from "@/graphql/actions/mutations/colors/updateColor";
import { GET_ALL_COLORS } from "@/graphql/actions/queries/colors/getAllColors";

const formSchema = z.object({
  nameEn: z.string().min(2, { message: "English name is required" }),
  nameAr: z.string().optional(),
  hex: z
    .string()
    .min(4, { message: "Hex code is required" })
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
      message: "Invalid Hex color code (e.g. #FFFFFF)",
    }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const ColorModal: React.FC<ColorModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [createColor, { loading: creating }] = useMutation(CREATE_COLOR);
  const [updateColor, { loading: updating }] = useMutation(UPDATE_COLOR);

  const isLoading = creating || updating;
  const title = initialData ? "Edit Color" : "Add New Color";
  const action = initialData ? "Save Changes" : "Create Color";

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      hex: "#000000",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        nameEn: initialData.nameEn,
        nameAr: initialData.nameAr || "",
        hex: initialData.hex || "#000000",
      });
    } else {
      form.reset({
        nameEn: "",
        nameAr: "",
        hex: "#000000",
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (values: ColorFormValues) => {
    try {
      if (initialData) {
        await updateColor({
          variables: {
            id: initialData.id,
            hex: values.hex,
            nameEn: values.nameEn,
            nameAr: values.nameAr,
          },
          refetchQueries: [{ query: GET_ALL_COLORS }],
        });
        toast.success("Color updated successfully");
      } else {
        await createColor({
          variables: {
            hex: values.hex,
            nameEn: values.nameEn,
            nameAr: values.nameAr,
          },
          refetchQueries: [{ query: GET_ALL_COLORS }],
        });
        toast.success("Color created successfully");
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-border shadow-sm"
              style={{ backgroundColor: form.watch("hex") }}
            />
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            <FormField
              control={form.control}
              name="hex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-input shadow-sm cursor-pointer transition-transform active:scale-95">
                        <input
                          type="color"
                          {...field}
                          className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                        />
                      </div>

                      <div className="flex-1">
                        <Input
                          placeholder="#000000"
                          disabled={isLoading}
                          {...field}
                          className="font-mono uppercase"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        placeholder="e.g. Red, Dark Blue"
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
                        placeholder="مثال: أحمر، كحلي"
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
