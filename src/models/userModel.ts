import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    minLength: 3,
    required: true,
  },
  password: {
    type: String,
    minLength: 8,
    required: true,
  },
  bio: {
    type: String,
    minLength: 8,
    maxLength: 20,
    required: false,
  },
  profilePicUrl: {
    type: String,
    required: false,
  },
});

export const User = mongoose.model("User", userSchema);
