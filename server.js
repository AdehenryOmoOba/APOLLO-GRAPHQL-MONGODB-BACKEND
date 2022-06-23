import dotenv from "dotenv";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const app = new ApolloServer({ typeDefs, resolvers });
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const URI = process.env.DB_URI;
mongoose.connect(
  URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(`Connection to database fail: ${err}`);
    } else {
      console.log("Connection to database successful");
      app.listen(process.env.PORT || 2000, () => {
        console.log(`Apollo server running on port 2000...`);
      });
    }
  }
);
