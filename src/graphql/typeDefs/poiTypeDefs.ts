import { gql } from 'apollo-server-express';

export const poiTypeDefs = gql`
  type PointOfInterest {
    id: ID!
    name: String!
    location: String!
    chargingPoints: Int!
  }

  type Query {
    getPOIs: [PointOfInterest]
  }
`;
