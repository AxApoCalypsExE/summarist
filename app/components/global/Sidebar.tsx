"use client";

import Image from "next/image";
import React from "react";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { FiLogOut, FiLogIn } from "react-icons/fi";
import { RiBallPenLine } from "react-icons/ri";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { SlSettings } from "react-icons/sl";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { openModal } from "@/app/redux/features/modalSlice";
import { logout } from "@/app/redux/features/authSlice";
import { getAuth } from "firebase/auth";
import { resetPremiumState } from "@/app/redux/features/premiumSlice";

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const auth = getAuth();
  const router = useRouter()

  const user = auth.currentUser;

  const isActive = (path: string) => pathname === path;

  const handleAuthAction = () => {
    if (user) {
      resetPremiumState();
      auth.signOut()
      dispatch(logout());
      router.push("/for-you")
      router.refresh()
    } else {
      dispatch(openModal("login"));
    }
  };

  return (
    <div className="h-screen w-[200px] bg-slate-50 fixed top-0 left-0">
      <div className="p-4">
        <Image src="/logo.png" width={600} height={600} alt="Summarist" />
      </div>
      <div className="h-[78%] flex flex-col items-center justify-between mt-8 gap-2">
        <div className="gap-2 flex flex-col items-start justify-center w-full">
          <Link href="/for-you" className="w-full">
            <div
              className={`relative hover:bg-slate-200 flex items-center justify-start py-4 w-full pl-5 cursor-pointer ${
                isActive("/for-you") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/for-you") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <AiOutlineHome className="mr-2 text-2xl" />
              <h1 className="2rem">For you</h1>
            </div>
          </Link>

          <Link href="/my-library" className="w-full">
            <div
              className={`relative hover:bg-slate-200 flex items-center justify-start py-4 w-full pl-5 cursor-pointer ${
                isActive("/my-library") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/my-library") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <BsBookmark className="mr-2 text-2xl" />
              <h1 className="2rem">My Library</h1>
            </div>
          </Link>

          <div className="w-full">
            <div
              className={`relative flex items-center justify-start py-4 w-full pl-5 cursor-not-allowed ${
                isActive("/highlights") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/highlights") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <RiBallPenLine className="mr-2 text-2xl" />
              <h1 className="2rem">Highlights</h1>
            </div>
          </div>

          <div className="w-full">
            <div
              className={`relative flex items-center justify-start py-4 w-full pl-5 cursor-not-allowed ${
                isActive("/search") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/search") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <AiOutlineSearch className="mr-2 text-2xl" />
              <h1 className="2rem">Search</h1>
            </div>
          </div>
        </div>

        <div className="gap-2 w-full flex flex-col items-start justify-center">
          <Link href="/settings" className="w-full">
            <div
              className={`relative hover:bg-slate-200 flex items-center justify-start py-4 w-full pl-5 cursor-pointer ${
                isActive("/settings") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/settings") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <SlSettings className="mr-2 text-2xl" />
              <h1 className="2rem">Settings</h1>
            </div>
          </Link>

          <div className="w-full">
            <div
              className={`relative flex items-center justify-start py-4 w-full pl-5 cursor-not-allowed ${
                isActive("/help") ? "bg-slate-200" : ""
              }`}
            >
              <div
                className={`${
                  isActive("/help") ? "bg-green-400" : "bg-transparent"
                } h-full w-[6px] absolute top-0 left-0`}
              />
              <RxQuestionMarkCircled className="mr-2 text-2xl" />
              <h1 className="2rem">Help & Support</h1>
            </div>
          </div>

          <div
            className="relative hover:bg-slate-200 flex items-center justify-start py-4 w-full pl-5 cursor-pointer"
            onClick={handleAuthAction}
          >
            <div className="bg-transparent h-full w-[6px] absolute top-0 left-0" />
            {user ? (
              <>
                <FiLogOut className="mr-2 text-2xl" />
                <h1 className="2rem">Logout</h1>
              </>
            ) : (
              <>
                <FiLogIn className="mr-2 text-2xl" />
                <h1 className="2rem">Login</h1>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
