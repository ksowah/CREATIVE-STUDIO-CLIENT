import { gql } from "@apollo/client";


export const DEPOSIT_TO_WALLET = gql`
mutation Deposit($amount: Float!) {
  deposit(amount: $amount) {
    _id
    user
    balance
  }
}
`