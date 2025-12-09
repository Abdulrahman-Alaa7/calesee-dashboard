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
import { CREATE_SIZE } from "@/graphql/actions/mutations/sizes/createSize";
import { UPDATE_SIZE } from "@/graphql/actions/mutations/sizes/updateSize";
import { GET_ALL_SIZES } from "@/graphql/actions/queries/sizes/getAllSizes";

const formSchema = z.object({
  valueSize: z.string().min(1, { message: "Size value is required" }),
  labelEn: z.string().optional(),
  labelAr: z.string().optional(),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null;
}

export const SizeModal: React.FC<SizeModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const [createSize, { loading: creating }] = useMutation(CREATE_SIZE);
  const [updateSize, { loading: updating }] = useMutation(UPDATE_SIZE);

  const isLoading = creating || updating;
  const title = initialData ? "Edit Size" : "Add New Size";
  const action = initialData ? "Save Changes" : "Create Size";

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      valueSize: "",
      labelEn: "",
      labelAr: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        valueSize: initialData.valueSize,
        labelEn: initialData.labelEn,
        labelAr: initialData.labelAr || "",
      });
    } else {
      form.reset({
        valueSize: "",
        labelEn: "",
        labelAr: "",
      });
    }
  }, [initialData, isOpen, form]);

  const onSubmit = async (values: SizeFormValues) => {
    try {
      if (initialData) {
        await updateSize({
          variables: {
            id: initialData.id,
            valueSize: values.valueSize,
            labelEn: values.labelEn,
            labelAr: values.labelAr,
          },
          refetchQueries: [{ query: GET_ALL_SIZES }],
        });
        toast.success("Size updated successfully");
      } else {
        await createSize({
          variables: {
            valueSize: values.valueSize,
            labelEn: values.labelEn,
            labelAr: values.labelAr,
          },
          refetchQueries: [{ query: GET_ALL_SIZES }],
        });
        toast.success("Size created successfully");
      }
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] !rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">📏</span>
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 mt-2"
          >
            <FormField
              control={form.control}
              name="valueSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Size Value (Main Display)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={isLoading}
                        placeholder="e.g. 42, XL, 9.5"
                        {...field}
                        className="pl-4 font-mono font-bold text-lg tracking-wider"
                      />
                    </div>
                  </FormControl>
                  <p className="text-[10px] text-muted-foreground">
                    This is what appears on the product card.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="labelEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label (English)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g. EUR 42"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labelAr"
                render={({ field }) => (
                  <FormItem dir="rtl">
                    <FormLabel>العنوان (عربي)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="مثال: أوروبي 42"
                        {...field}
                        className="text-right"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                className="min-w-[100px]"
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
