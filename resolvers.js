import BlogModel from "./blogModel.js";
import RegisteredUsersModel from "./registeredUsersModel.js";
import bcrypt from "bcrypt";

// Handle Database Error
function handleDatabaseErrors(error) {
  const uniqueFieldErrors = {
    username: "",
    phone: "",
    confirmPasswordError: "",
  };
  if (error.code === 11000) {
    uniqueFieldErrors[Object.keys(error.keyValue)] = `This ${Object.keys(
      error.keyValue
    )} is already taken`;
    return uniqueFieldErrors;
  }
  uniqueFieldErrors.confirmPasswordError = error.message;
  return uniqueFieldErrors;
}

const resolvers = {
  Query: {
    allBlogs: async () => {
      try {
        const blogs = await BlogModel.find({});
        return blogs;
      } catch (error) {}
    },

    blog: async (parent, { id }) => {
      try {
        const blog = await BlogModel.findById(id);
        return blog;
      } catch (error) {}
    },
    login: async (parent, args) => {
      const { username, password } = args;

      try {
        const user = await RegisteredUsersModel.findOne({ username: username });

        if (!user) {
          return {
            username: username,
            success: "",
            error: `username ${username} does not exist`,
            role: "",
          };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return {
            username: user.username,
            success: "",
            error: "incorrect password",
            role: "",
          };
        }

        return {
          username: user.username,
          success: "success",
          role: user.role,
        };
      } catch (error) {
        return { error: "login error", role: "" };
      }
    },

    allUsers: async () => {
      try {
        const users = await RegisteredUsersModel.find({});
        return users;
      } catch (error) {}
    },
  },

  Mutation: {
    createBlog: async (parent, { newBlog }) => {
      try {
        const { title, content } = newBlog;
        const blog = await new BlogModel({ title, content });
        blog.save();
        return blog;
      } catch (error) {}
    },

    updateBlog: async (parent, { id, update }) => {
      try {
        const updatedBlog = await BlogModel.findByIdAndUpdate(id, update);
        return updatedBlog;
      } catch (error) {}
    },

    deleteBlog: async (parent, { id }) => {
      try {
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        return deletedBlog;
      } catch (error) {}
    },
    register: async (parent, { registerData }) => {
      let { username, password, confirmPassword, phone, role } = registerData;

      try {
        if (password !== confirmPassword) {
          throw new Error("error: password and confirm password must match!");
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = {
          username,
          phone,
          role: role || "workers",
          password: hashedPassword,
        };

        const newUser = new RegisteredUsersModel(user);
        const data = await RegisteredUsersModel.create(newUser);
        return {
          successResponse: "suceess",
          errorResponse: "",
          id: data._id,
          username: data.username,
          role,
        };
      } catch (error) {
        const errorResponse = handleDatabaseErrors(error);

        if (errorResponse.username) {
          return { errorResponse: errorResponse.username };
        }
        if (errorResponse.phone) {
          return { errorResponse: errorResponse.phone };
        }
        if (errorResponse.confirmPasswordError) {
          return { errorResponse: errorResponse.confirmPasswordError };
        }
      }
    },

    deleteUser: async (parent, { username }) => {
      try {
        const deletedUser = await RegisteredUsersModel.findOneAndDelete({
          username,
        });
        if (!deletedUser) {
          throw new Error(`error:user ${username} not found!`);
        }
        return {
          response: `success: user ${deletedUser.username} deleted successfully!`,
        };
      } catch (error) {
        return { response: error.message };
      }
    },

    updateUser: async (parent, { username, update }) => {
      try {
        const updatedUser = await RegisteredUsersModel.findOneAndUpdate(
          { username: username },
          { ...update }
        );
        if (!updatedUser) {
          throw new Error(`user ${username} not found`);
        }
        return { successResponse: `user ${username} updated` };
      } catch (error) {
        return { errorResponse: error.message };
      }
    },
  },
};

export default resolvers;
