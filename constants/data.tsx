export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: any;
  label?: string;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    label: "Dashboard",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "ShoppingCart",
    label: "products",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: "Logs",
    label: "orders",
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: "Combine",
    label: "categories",
  },
  {
    title: "Colors",
    href: "/dashboard/colors",
    icon: "Colors",
    label: "colors",
  },
  {
    title: "Sizes",
    href: "/dashboard/sizes",
    icon: "Sizes",
    label: "sizes",
  },
  {
    title: "Landing Website",
    href: "/dashboard/landing-website",
    icon: "landing",
    label: "landing website",
  },
  {
    title: "SEO",
    href: "/dashboard/seo",
    icon: "seo",
    label: "seo",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
    label: "profile",
  },
];

export const products: any[] = [
  {
    id: "1",
    name: "ZTextured Sweater Dress",
    description: "Description for Product 1 ",
    mainImage: "/assets/product-1.jpg",
    images: [
      "/assets/product-3.jpg",
      "/assets/product-2.jpg",
      "/assets/product-4.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-12-02T08:15:49.427+00:00",
  },
  {
    id: "2",
    name: "F Textured Sweater Dress",
    description: "Description for Product 2 ",
    mainImage: "/assets/product-2.jpg",
    images: [
      "/assets/product-3.jpg",
      "/assets/product-1.jpg",
      "/assets/product-4.jpg",
    ],
    price: 900,
    estimatedPrice: 0,
    soldOut: false,
    category: "girls",
    offer: false,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-02-02T08:15:49.427+00:00",
  },
  {
    id: "3",
    name: "Textured Sweater Dress",
    description: "Description for Product 3 ",
    mainImage: "/assets/product-1.jpg",
    images: [
      "/assets/product-4.jpg",
      "/assets/product-3.jpg",
      "/assets/product-2.jpg",
    ],
    price: 350,
    estimatedPrice: 0,
    soldOut: false,
    category: "boys",
    offer: false,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years old",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-11-02T08:15:49.427+00:00",
  },
  {
    id: "4",
    name: "A Textured Sweater Dress ",
    description: "Description for Product 4 ",
    mainImage: "/assets/product-4.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 400,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-09-02T08:15:49.427+00:00",
  },
  {
    id: "5",
    name: "Textured Sweater Dress",
    description: "Description for Product 5 ",
    mainImage: "/assets/product-1.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 400,
    estimatedPrice: 250,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: false,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-05-02T08:15:49.427+00:00",
  },
  {
    id: "6",
    name: "Textured Sweater Dress ",
    description: "Description for Product 6 ",
    mainImage: "/assets/product-4.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 1200,
    estimatedPrice: 0,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-03-02T08:15:49.427+00:00",
  },
  {
    id: "7",
    name: "Textured Sweater Dress ",
    description: "Description for Product 7 ",
    mainImage: "/assets/product-3.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 1500,
    estimatedPrice: 1300,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-04-02T08:15:49.427+00:00",
  },
  {
    id: "8",
    name: "Textured Sweater Dress ",
    description: "Description for Product 8 ",
    mainImage: "/assets/product-2.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 900,
    estimatedPrice: 0,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year old",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years old",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years old",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-01-02T08:15:49.427+00:00",
  },
  {
    id: "9",
    name: "Textured Sweater Dress ",
    description: "Description for Product 9 ",
    mainImage: "/assets/product-3.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: false,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years ",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-07-02T08:15:49.427+00:00",
  },
  {
    id: "10",
    name: "Textured Sweater Dress ",
    description: "Description for Product 10 ",
    mainImage: "/assets/product-1.jpg",
    images: [
      "/assets/product-2.jpg",
      "/assets/product-1.jpg",
      "/assets/product-3.jpg",
    ],
    price: 600,
    estimatedPrice: 500,
    soldOut: true,
    category: "general",
    offer: true,
    sizes: [
      {
        typeEn: "one year ",
        typeAr: "سنة ",
        soldOut: true,
      },
      {
        typeEn: "two years",
        typeAr: "سنتين ",
        soldOut: false,
      },
      {
        typeEn: "three years ",
        typeAr: "ثلاث سنين",
        soldOut: false,
      },
    ],
    createdAt: "2024-10-02T08:15:49.427+00:00",
  },
];

export const categories: any[] = [
  {
    id: "1516541651465",
    value: "Boys",
  },
  {
    id: "1516515615651",
    value: "Girls",
  },
];

export const defaultValues = {
  id: "b055dc16-538b-459d-a367-86df3c5e265a",
  name: "Product 1",
  category: "cat-1",
  price: 1500,
  estimatedPrice: 1200,
  descriptionAr: "وصف بالعربي تجريبي ",
  descriptionEn: "Test Description",
  sku: "LM-12551",
  soldOut: false,
  images: [
    {
      file: "/assets/product-1.jpg",
      id: "f16f3ec4-8794-4184-9366-9e8354607a5a",
      isMain: false,
      linkedColorHex: "#000000",
    },
    {
      file: "/assets/product-2.jpg",
      id: "f2d902084-3c04-4c25-a1d3-6e5f91bfdfefa",
      isMain: true,
      linkedColorHex: "#ff0000",
    },
  ],
  keywordsEn: ["product", "clothes", "kids"],
  keywordsAr: ["منتج", "ملابس", "اطفال"],
  publicPro: true,
  sizes: [
    {
      colors: [
        {
          hex: "#ff0000",
          id: "9a94e7a0-765b-4a51-bab5-210cb74e5c9c",
          nameAr: "أحمر",
          nameEn: "Red",
          soldout: false,
        },
        {
          hex: "#008000",
          id: "9be1f5a2-9d25-4cc0-a0fd-2712e97cc78e",
          nameAr: "أخضر",
          nameEn: "Green",
          soldout: false,
        },
        {
          hex: "#000000",
          id: "43c5deae-3e89-4f1e-88ef-2d45043fa7da",
          nameAr: "أسود",
          nameEn: "Black",
          soldout: false,
        },
      ],
      id: "1ce0696b-aacf-4fa9-a7c1-5d8fa61c4375",
      soldout: false,
      value: "38",
    },
  ],
};
