import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa6";
import { PiClock } from "react-icons/pi";

interface SuggestedProps {
  img: string;
  subTitle: string;
  title: string;
  author: string;
  averageRating: number;
  id: string;
  subscriptionRequired: boolean;
  audio: string;
}

const Suggested = ({
  img,
  subTitle,
  title,
  author,
  averageRating,
  id,
  subscriptionRequired,
  audio,
}: SuggestedProps) => {
  const [audioDuration, setAudioDuration] = useState<string>("");

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
      className="max-w-[200px] w-full p-3 pt-8 flex-shrink-0 snap-start cursor-pointer hover:bg-[#f1f6f4] relative"
    >
      {subscriptionRequired && (
        <div className="text-[10px] bg-primary absolute top-0 right-0 text-white rounded-full px-2 h-[1.5rem] flex items-center">
          Premium
        </div>
      )}
      <Image src={img} alt="book cover" width={600} height={600} />
      <div className="flex gap-1 flex-col">
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-gray-400">{author}</p>
        <p className="text-sm">{subTitle}</p>
        <div className="flex text-sm gap-2 text-gray-400">
          <div className="flex gap-1 items-center">
            <PiClock className="h-full" />
            {audioDuration ? (
              audioDuration
            ) : (
              <div className="w-8 h-4 animate-pulse bg-gray-400" />
            )}
          </div>
          <div className="flex gap-1 items-center">
            <FaRegStar className="h-full" />
            {averageRating}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Suggested;
