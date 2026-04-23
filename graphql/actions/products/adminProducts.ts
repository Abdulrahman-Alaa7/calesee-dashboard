import { gql } from "@apollo/client";

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    name
    category {
      id
      nameEn
      nameAr
    }
    categoryId
    price
    estimatedPrice
    sku
    publicPro
    soldOut
    descriptionEn
    descriptionAr
    keywordsEn
    keywordsAr
    purchased
    images {
      id
      url
      filename
      isMain
      linkedColorHex
      sortOrder
      createdAt
      updatedAt
    }
    sizes {
      id
      sizeValue
      catalogSizeId
      soldout
      createdAt
      updatedAt
      colors {
        id
        hex
        catalogColorId
        nameEn
        nameAr
        soldout
        createdAt
        updatedAt
      }
    }
    reviews {
      id
      name
      comment
      rating
      imageUrl
      status
      createdAt
    }
    createdAt
    updatedAt
  }
`;

export const GET_PRODUCTS_ADMIN = gql`
  query GetProductsAdmin {
    getProductsAdmin {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;

export const GET_PRODUCT_BY_ID_ADMIN = gql`
  query GetProductByIdAdmin($id: String!) {
    getProductByIdAdmin(id: $id) {
      ...ProductFields
    }
  }
  ${PRODUCT_FIELDS}
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FIELDS}
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FIELDS}
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      message
      success
    }
  }
`;
