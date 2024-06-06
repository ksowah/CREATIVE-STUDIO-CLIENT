import { gql } from "@apollo/client";

export const GET_CART_ITEMS = gql`
  query Query {
    getCartItems {
      item {
        _id
        title
        artist
        artPreview
        dimensions
        price
        category
      }
      artist {
        fullName
      }
    }
  }
`;

export const GET_USER_ORDERS = gql`
  query Query {
  getOrders {
    _id
    title
    artist {
      fullName
    }
    artPreview
    price
    dimensions
    category
  }
}
`;
