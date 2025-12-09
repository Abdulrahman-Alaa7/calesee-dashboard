import { z } from "zod";

export const orderShema = z.object({
  id: z.string(),
  fullName: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      img: z.string(),
      price: z.number(),
      quantity: z.number(),
      color: z.string().optional(),
      size: z.string().optional(),
    })
  ),
  address: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  secPhone_number: z.string().optional(),
  governorate: z.string().optional(),
  city: z.string().optional(),
  secAddress: z.string().optional(),
  secGovernorate: z.string().optional(),
  secCity: z.string().optional(),
  note: z.string().optional(),
  status: z.string().optional(),
});

export type Order = z.infer<typeof orderShema>;
