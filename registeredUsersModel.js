import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, require: true, unique: true, lowercase: true },
  password: { type: String, require: true },
  phone: { type: String, require: true, unique: true },
  role: { type: String, default: "workers" },
  status: { type: String, default: "online" },
});

const RegisteredUsersModel = mongoose.model("registered_users", userSchema);

export default RegisteredUsersModel;
