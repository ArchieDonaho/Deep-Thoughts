// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs tagged template literal
const typeDefs = gql`
  type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }

  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }

  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }

  type Query {
    users: [User]
    user(username: String!): User
    thoughts(username: String): [Thought]
    thought(_id: ID!): Thought
  }
`;
// ID is the same as string, except it must be a unique identifier
// the ! indicates the data MUST exist otherwise apollo will return an error

// export the typeDefs
module.exports = typeDefs;
