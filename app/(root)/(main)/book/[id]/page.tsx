"use client";

import Searchbar from "@/app/components/global/Searchbar";
import Sidebar from "@/app/components/global/Sidebar";
import { auth } from "@/app/firebase";
import { fetchAuthUser } from "@/app/redux/features/authSlice";
import { openModal } from "@/app/redux/features/modalSlice";
import { fetchPremiumStatus } from "@/app/redux/features/premiumSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import { getApp } from "firebase/app";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsBookmark } from "react-icons/bs";
import { FaRegClock, FaRegStar } from "react-icons/fa6";
import { FiMic } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { PiBookOpenTextBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";

interface BookProps {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

const Book = () => {
  const { id } = useParams();
  const router = useRouter();
  const user = auth.currentUser;
  const app = getApp()

  const [book, setBook] = useState<BookProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [audioDuration, setAudioDuration] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const isPremium = useSelector((state: RootState) => state.premium.isPremium);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    dispatch(fetchAuthUser(app));
    dispatch(fetchPremiumStatus());
  }, [dispatch, app]);

  useEffect(() => {
    if (book?.audioLink) {
      const audioElement = new Audio(book.audioLink);

      const handleLoadedMetadata = () => {
        const duration = audioElement.duration;
        setAudioDuration(formatTime(duration));
      };

      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      };
    }
  }, [book?.audioLink]);

  const handleAction = () => {
    if (!user) {
      dispatch(openModal("login"));
    } else if (!isPremium && book?.subscriptionRequired) {
      router.push(`/choose-plan`);
    } else {
      router.push(`/player/${id}`);
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!data.ok) throw new Error("Failed to fetch book");
        const bookData = await data.json();
        setBook(bookData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <>
      <Sidebar />
      <Searchbar />
      <div className="flex max-w-[1070px] mx-auto py-10 justify-between px-6 gap-4">
        <div className="w-[60%]">
          <div className="gap-4 flex flex-col mb-4">
            {loading ? (
              <>
                <div className="bg-gray-300 animate-pulse rounded-md w-full h-16"></div>
                <div className="bg-gray-300 animate-pulse rounded-md w-[50%] h-4"></div>
                <div className="bg-gray-300 animate-pulse rounded-md w-full h-8"></div>
              </>
            ) : (
              <>
                <h1 className="font-bold text-3xl">
                  {book?.title} {book?.subscriptionRequired && "(Premium)"}
                </h1>
                <h3 className="text-base font-bold">{book?.author}</h3>
                <h2 className="text-xl font-light">{book?.subTitle}</h2>
              </>
            )}
          </div>
          <div className="border-t border-b py-4 mb-6">
            <div className="text-sm flex gap-y-3 flex-wrap max-w-[400px] font-semibold">
              {loading ? (
                <>
                  <div className="bg-gray-300 animate-pulse rounded-md w-[50%] h-7"></div>
                  <div className="bg-gray-300 animate-pulse rounded-md w-[50%] h-7"></div>
                  <div className="bg-gray-300 animate-pulse rounded-md w-[50%] h-7"></div>
                  <div className="bg-gray-300 animate-pulse rounded-md w-[50%] h-7"></div>
                </>
              ) : (
                <>
                  <div className="flex gap-1 items-center w-[50%]">
                    <FaRegStar className="text-2xl" />
                    {book?.averageRating} ({book?.totalRating} ratings)
                  </div>
                  <div className="flex gap-1 items-center w-[50%]">
                    <FaRegClock className="text-2xl " />
                    {audioDuration ? (
                      audioDuration
                    ) : (
                      <div className="w-20 h-4 animate-pulse bg-gray-400" />
                    )}
                  </div>
                  <div className="flex gap-1 items-center w-[50%]">
                    <FiMic className="text-2xl " />
                    <p>Audio & Text</p>
                  </div>
                  <div className="flex gap-1 items-center w-[50%]">
                    <HiOutlineLightBulb className="text-2xl" />
                    <p>{book?.keyIdeas} Key ideas</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="gap-4 mb-6 flex items-center">
            {loading ? (
              <>
                <div className="bg-gray-300 animate-pulse rounded-md w-[145px] h-12"></div>
                <div className="bg-gray-300 animate-pulse rounded-md w-[145px] h-12"></div>
              </>
            ) : (
              <>
                <button
                  className="flex justify-center items-center rounded bg-[#032b41] text-white w-36 h-12 gap-3"
                  onClick={() => handleAction()}
                >
                  <PiBookOpenTextBold className="text-xl" />
                  Read
                </button>
                <button
                  className="flex justify-center items-center rounded bg-[#032b41] text-white w-36 h-12 gap-3"
                  onClick={() => handleAction()}
                >
                  <FiMic className="text-xl" />
                  Listen
                </button>
              </>
            )}
          </div>
          {loading ? (
            <div className="animate-pulse h-8 w-[250px] bg-gray-300"> </div>
          ) : (
            <div className="text-blue-600 flex items-center gap-2 text-lg font-semibold">
              <BsBookmark />
              Add title to My Library
            </div>
          )}
          <div className="mt-6">
            <div className="mb-4">
              <h2 className="font-bold text-lg mb-4">What&apos;s it about?</h2>
              {loading ? (
                <div className="animate-pulse h-96 w-[500px] bg-gray-300">
                  {" "}
                </div>
              ) : (
                <>
                  <div className="items-center flex gap-4 flex-wrap mb-4">
                    {book?.tags.map((tag, idx) => (
                      <div
                        className="bg-slate-100 py-2 px-4 rounded-md cursor-not-allowed font-semibold"
                        key={idx}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                  <p>{book?.bookDescription}</p>
                </>
              )}
            </div>
            <div>
              <h2 className="font-bold text-lg mb-4">About the author</h2>
              {loading ? (
                <div className="animate-pulse h-96 w-[500px] bg-gray-300">
                  {" "}
                </div>
              ) : (
                <p>{book?.authorDescription}</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-[300px] max-x-[300px]">
          {book?.imageLink ? (
            <Image
              src={book.imageLink}
              alt="Book image"
              width={600}
              height={600}
              className="h-auto rounded-md w-full"
            />
          ) : (
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-[250px] h-[300px] bg-gray-300 rounded-md"></div>{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Book;
