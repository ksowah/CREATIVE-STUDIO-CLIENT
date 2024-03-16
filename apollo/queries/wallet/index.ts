import { gql } from "@apollo/client";


export const GET_WALLET_BALLANCE = gql`
  query Query {
    getWalletBallance {
      _id
      user
      balance
    }
  }
`;
