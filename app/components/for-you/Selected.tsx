"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";

interface SelectedProps {
  id: string;
  img: string;
  subTitle: string;
  title: string;
  author: string;
  audio: string;
}

const Selected = ({ id, img, subTitle, title, author, audio }: SelectedProps) => {
  const [audioDuration, setAudioDuration] = useState<string>("");

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes} mins ${seconds} secs`;
  };

  useEffect(() => {
    const audioElement = new Audio(audio);

    const handleLoadedMetadata = () => {
      const duration = audioElement.duration;
      setAudioDuration(formatTime(duration));
    };

    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [audio]);

  return (
    <Link
      href={`/book/${id}`}
      className="bg-[#fbefd6] rounded flex p-6 justify-between cursor-pointer w-[675px]"
    >
      <h3 className="w-[35%]">{subTitle}</h3>
      <div className="w-[1px] border-x border-gray-300" />
      <div className="flex">
        <Image
          className="w-36 h-auto"
          src={img}
          alt="book cover"
          height={600}
          width={600}
        />
        <div className="ml-2">
          <h2 className="font-bold">{title}</h2>
          <h4 className="text-[14px]">{author}</h4>
          <div className="flex gap-2 p-4 mt-6 items-center justify-between">
            <FaCirclePlay className="bg-white rounded-full text-4xl" />
            <h2 className="font-bold">
              {audioDuration ? `${audioDuration}` : (
                <div className="w-28 h-6 animate-pulse bg-gray-400" />
              )}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Selected;
