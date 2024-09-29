"use client";

import React, { useState } from "react";
import { BsEye, BsEyeSlash, BsX } from "react-icons/bs";
import { FaGoogle, FaUser } from "react-icons/fa";
import { closeModal } from "../redux/features/modalSlice";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  signupSuccess,
} from "../redux/features/authSlice";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const isModalOpen = useSelector((state: RootState) => state.modal.isOpen);
  const [hasAccount, setHasAccount] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleGuestLogin = async () => {
    dispatch(loginStart());
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
        })
      );
      dispatch(closeModal());
      router.push("/for-you");
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(loginFailure(error.message));
      } else {
        dispatch(loginFailure("An error has occured."));
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
        })
      );
      dispatch(closeModal());
      router.push("/for-you");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        dispatch(loginFailure(error.message));
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    dispatch(loginStart());
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch(
        loginSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
        })
      );
      dispatch(closeModal());
      router.push("/for-you");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
        dispatch(loginFailure(error.message));
      } else {
        console.error("An unexpected error occurred.");
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      dispatch(
        signupSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAnonymous: user.isAnonymous,
        })
      );
      dispatch(closeModal());
      router.push("/for-you");
    } catch (error: unknown) {
      if (error instanceof Error) {
        dispatch(loginFailure(error.message));
      } else {
        dispatch(loginFailure("An unexpected error occurred."));
      }
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="w-screen h-screen fixed bg-black/75 flex items-center justify-center z-50">
      {hasAccount ? (
        <div className="relative flex flex-col max-w-md mx-auto px-10 py-12 bg-white shadow-md rounded-lg">
          <div className="absolute top-0 right-0 m-2">
            <BsX
              className="text-5xl cursor-pointer"
              onClick={() => dispatch(closeModal())}
            />
          </div>
          <h2 className="text-xl font-semibold text-center mb-6 w-[600px] self-center">
            Login to Summarist
          </h2>

          <button className="grid grid-cols-5 w-full bg-[#3a579d] text-white py-2 rounded-md hover:bg-[#2a4074] transition">
            <div className="h-full flex col-span-1 ml-2 items-center text-2xl">
              <FaUser />
            </div>
            <div
              onClick={handleGuestLogin}
              className="col-span-3 flex justify-center items-center"
            >
              Login as a Guest
            </div>
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button className="grid grid-cols-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            <div className="h-full flex col-span-1 ml-2 items-center text-2xl">
              <FaGoogle />
            </div>
            <div
              className="col-span-3 flex justify-center items-center"
              onClick={() => handleGoogleLogin()}
            >
              Login with Google
            </div>
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <BsEyeSlash
                  title="Hide password"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <BsEye
                  title="Show password"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <button
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          <div className="mt-2 text-center">
            <div
              onClick={() => setHasAccount(false)}
              className="text-sm text-blue-500 hover:underline cursor-pointer"
            >
              Don&apos;t have an account?
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col max-w-md mx-auto px-10 py-12 bg-white shadow-md rounded-lg">
          <div className="absolute top-0 right-0 m-2">
            <BsX
              className="text-5xl cursor-pointer"
              onClick={() => dispatch(closeModal())}
            />
          </div>
          <h2 className="text-xl font-semibold text-center mb-6 w-[600px] self-center">
            Signup to Summarist
          </h2>

          <button className="grid grid-cols-5 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
            <div className="h-full flex col-span-1 ml-2 items-center text-2xl">
              <FaGoogle />
            </div>
            <div className="col-span-3 flex justify-center items-center">
              Signup with Google
            </div>
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 border-2 border-gray-300 rounded-md focus:border-green-500 focus:outline-none pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {showPassword ? (
                <BsEyeSlash
                  title="Hide password"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <BsEye
                  title="Show password"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <button
              onClick={handleSignup}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
            >
              Register
            </button>
          </div>

          <div className="mt-10 text-center">
            <div
              onClick={() => setHasAccount(true)}
              className="text-sm text-blue-500 hover:underline cursor-pointer"
            >
              Already have an account?
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;
