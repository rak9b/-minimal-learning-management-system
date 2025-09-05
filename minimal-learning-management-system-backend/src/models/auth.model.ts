import { model, Schema } from "mongoose";
import { AuthModel, IAuthUser } from "../interface/auth.interface";

const AuthSchema = new Schema<IAuthUser, AuthModel>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Auth = model<IAuthUser, AuthModel>("Auth", AuthSchema);
