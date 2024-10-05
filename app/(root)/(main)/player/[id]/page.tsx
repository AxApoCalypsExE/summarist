"use client";

import Searchbar from "@/app/components/global/Searchbar";
import SidebarPlayer from "@/app/components/global/SidebarPlayer";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosPlayCircle } from "react-icons/io";
import { MdPauseCircle } from "react-icons/md";
import { RiForward10Line, RiReplay10Line } from "react-icons/ri";

import "./progress-bar.css";
import { auth } from "@/app/firebase";
import { getPremiumStatus } from "@/app/components/choose-plan/getPremiumStatus";
import { getApp } from "firebase/app";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";

interface PlayerProps {
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

const Player = () => {
  const { id } = useParams();
  const app = getApp();

  const [playerData, setPlayerData] = useState<PlayerProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState("text-sm");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const user = auth.currentUser
  const router = useRouter();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const isPremium = useSelector((state: RootState) => state.premium.isPremium);

  useEffect(() => {
    if (!user) {
      router.push("/for-you")
    } else if (!isPremium && playerData?.subscriptionRequired) {
      router.push("/choose-plan")
    } else {
      return
    }
  }, [isPremium, router, user, playerData?.subscriptionRequired])

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!data.ok) throw new Error("Failed to fetch player");
        const playerData = await data.json();
        setPlayerData(playerData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const updateTime = () => {
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateTime);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateTime);
      }
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;

    const setAudioDuration = () => {
      if (audioElement) {
        setDuration(audioElement.duration);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", setAudioDuration);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("loadedmetadata", setAudioDuration);
      }
    };
  }, []);

  useEffect(() => {
    const progressBar = document.querySelector(
      'input[type="range"]'
    ) as HTMLInputElement;
    if (progressBar) {
      const progressPercentage = (currentTime / duration) * 100;
      progressBar.style.setProperty(
        "--range-progress",
        `${progressPercentage}%`
      );
    }
  }, [currentTime, duration]);

  return (
    <>
      <SidebarPlayer setFontSize={setFontSize} />
      <Searchbar />
      <div className="mx-auto p-6 max-w-[800px] whitespace-pre-line">
        <div className="text-2xl font-bold mb-8 pb-4 border-b border-gray-200">
          {playerData?.title}
        </div>
        <div className={`${fontSize} mb-20`}>{playerData?.summary}</div>
      </div>
      <div className="w-full px-10 text-white fixed h-20 bg-slate-900 bottom-0 left-0 flex items-center justify-between">
        <audio
          preload="metadata"
          ref={audioRef}
          src={playerData?.audioLink}
        ></audio>
        <div className="w-1/3 gap-3 flex">
          {playerData?.imageLink && (
            <Image
              src={playerData.imageLink}
              width={600}
              height={600}
              alt="Book cover"
              className="w-12 max-w-12 h-12"
            />
          )}
          <div className="flex flex-col text-sm justify-center">
            <p>{playerData?.title}</p>
            <p className="text-slate-300">{playerData?.author}</p>
          </div>
        </div>
        <div className="w-1/3 flex gap-4 items-center justify-center">
          <button onClick={() => handleSkip(-10)} className="text-3xl">
            <RiReplay10Line />
          </button>
          <button onClick={handlePlayPause} className="text-5xl">
            {isPlaying ? <MdPauseCircle /> : <IoIosPlayCircle />}
          </button>
          <button onClick={() => handleSkip(10)} className="text-3xl">
            <RiForward10Line />
          </button>
        </div>
        <div className="flex gap-4 items-center w-1/3 text-sm">
          <div>{formatTime(currentTime)}</div>
          <input
            type="range"
            min="0"
            max={duration.toString()}
            value={currentTime.toString()}
            onChange={(e) => {
              const newTime = Number(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime;
              }
            }}
            className="w-full h-1 max-w-[300px] outline-none appearance-none bg-gray-300 rounded-lg cursor-pointer"
          />
          <div>{formatTime(duration)}</div>
        </div>
      </div>
    </>
  );
};

export default Player;
