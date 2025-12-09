import { gql, DocumentNode } from "@apollo/client";

export const CREATE_PRODUCT: DocumentNode = gql`
  mutation createProduct(
    $name: String!
    $mainImage: Upload
    $images: [Upload!]
    $descriptionEn: String
    $descriptionAr: String
    $price: Float!
    $estimatedPrice: Float
    $categoryId: String!
    $sku: String
    $keywordsEn: String
    $keywordsAr: String
    $sizes: [Size!]
    $colors: [Color!]
    $soldOut: Boolean!
    $publicPro: Boolean!
  ) {
    createProduct(
      productDto: {
        name: $name
        mainImage: $mainImage
        images: $images
        descriptionEn: $descriptionEn
        descriptionAr: $descriptionAr
        price: $price
        estimatedPrice: $estimatedPrice
        categoryId: $categoryId
        sku: $sku
        keywordsEn: $keywordsEn
        keywordsAr: $keywordsAr
        sizes: $sizes
        colors: $colors
        soldOut: $soldOut
        publicPro: $publicPro
      }
    ) {
      product {
        id
        name
      }
    }
  }
`;
