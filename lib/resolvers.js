import gql from "graphql-tag";

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }

  # extend type Launch {
  #   isInCart: Boolean!
  # }

  # extend type Mutation {
  #   addOrRemoveFromCart(id: ID!): [Launch]
  # }
`;

export const resolvers = {};

export const defaults = {};
