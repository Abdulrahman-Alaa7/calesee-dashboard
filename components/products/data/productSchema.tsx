export type Product = {
  id: string;
  name: string;
  price: number;
  estimatedPrice?: number | null;
  publicPro: boolean;
  soldOut: boolean;
  purchased?: number | null;
  category?: {
    id: string;
    nameEn: string;
    nameAr: string;
  } | null;
  images: {
    id: string;
    url: string;
    isMain: boolean;
    linkedColorHex?: string | null;
  }[];
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    imageUrl?: string | null;
    status: "Pending" | "Approved" | "Rejected";
  }[];
};
