import { gql } from "apollo-server";

const typeDefs = gql`
  type Blog {
    id: ID
    title: String!
    content: String!
    postedAt: String
  }

  type Login {
    username: String
    success: String
    error: String
    role: String
  }

  type Users {
    id: ID
    username: String
    phone: String
    role: String
  }

  type Query {
    allBlogs: [Blog]
    blog(id: ID): Blog
    login(username: String!, password: String!): Login
    allUsers: [Users]
  }

  type RegisterResponse {
    successResponse: String
    errorResponse: String
    id: ID
    username: String
    role: String
  }

  type DeletedUser {
    response: String
  }

  type UpdatedUser {
    successResponse: String
    errorResponse: String
  }

  input BlogInput {
    title: String!
    content: String!
  }

  input BlogUpdateInput {
    title: String
    content: String
  }

  input Register {
    username: String!
    password: String!
    confirmPassword: String!
    phone: String!
    role: String
  }

  input UserUpdateInput {
    username: String
    phone: String
    role: String
  }

  type Mutation {
    createBlog(newBlog: BlogInput): Blog
    deleteBlog(id: ID): Blog
    updateBlog(id: ID, update: BlogUpdateInput): Blog
    register(registerData: Register): RegisterResponse!
    deleteUser(username: String): DeletedUser
    updateUser(username: String, update: UserUpdateInput): UpdatedUser
  }
`;

export default typeDefs;
