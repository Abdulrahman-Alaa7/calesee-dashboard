import { gql, DocumentNode } from "@apollo/client";

export const UPDATE_PRODUCT: DocumentNode = gql`
  mutation updateProduct(
    $id: String!
    $name: String!
    $mainImage: Upload
    $images: [Upload!]
    $existingImageUrls: [String!]
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
    updateProduct(
      updateProductDto: {
        id: $id
        name: $name
        mainImage: $mainImage
        images: $images
        existingImageUrls: $existingImageUrls
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
