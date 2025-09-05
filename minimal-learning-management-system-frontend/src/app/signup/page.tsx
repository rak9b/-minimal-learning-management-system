/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import CustomInput from "@/components/textInput/CustomInput";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/Slices/userSlice";
import { storeUserInfo } from "@/utils/auth";
import { useRouter } from "next/navigation";

interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Simulate API call
      const result = await registerUser(data).unwrap();
      console.log("Signup data:", result);
      if (result?.token) {
        dispatch(
          setUser({
            userId: result?.user?._id,
            email: result?.user?.email,
            role: result?.user?.role,
          })
        );
        router.push("/");
      }

      storeUserInfo({ accessToken: result?.token });
      // Handle successful signup
    } catch (error: any) {
      setErrorMessage(error?.data);
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 pb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Sign up to start your learning journey
          </p>
        </div>

        <div className="p-6 pt-2">
          {errorMessage && (
            <div className="bg-red-500 h-12 rounded mt-2 flex  items-center px-4">
              <p className="text-white">{errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <CustomInput
              name="name"
              type="text"
              placeholder="Enter your full name"
              level="Full Name"
              register={register}
              errors={errors}
              errorMessage="Name is required"
            />

            <CustomInput
              name="email"
              type="email"
              placeholder="Enter your email"
              level="Email Address"
              register={register}
              errors={errors}
              errorMessage="Email is required"
            />

            <CustomInput
              name="password"
              type="password"
              placeholder="Enter your password"
              level="Password"
              register={register}
              errors={errors}
              errorMessage="password is required"
            />

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-orange-600 hover:text-orange-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
