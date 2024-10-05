"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiX } from "react-icons/bi";
import { PiClock } from "react-icons/pi";

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

const Searchbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [searchResults, setSearchResults] = useState<BookProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [audioDurations, setAudioDurations] = useState<{
    [id: string]: string;
  }>({});

  const getAudioDurationInSeconds = (audioLink: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioLink);

      audio.addEventListener("loadedmetadata", () => {
        const duration = audio.duration;
        if (!isNaN(duration)) {
          resolve(duration);
        } else {
          reject(new Error("Unable to retrieve audio duration"));
        }
      });

      audio.addEventListener("error", () => {
        reject(new Error("Error loading audio file"));
      });
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchInput("");
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(searchInput);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedInput.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${debouncedInput}`
        );
        const data = await response.json();
        setSearchResults(data);
        setIsSearchOpen(true);

        data.forEach(async (book: BookProps) => {
          try {
            const durationInSeconds = await getAudioDurationInSeconds(
              book.audioLink
            );
            setAudioDurations((prev) => ({
              ...prev,
              [book.id]: formatTime(durationInSeconds),
            }));
          } catch (error) {
            console.error(
              `Error fetching audio duration for ${book.title}:`,
              error
            );
          }
        });
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedInput]);

  return (
    <div className="w-full h-20 border-b border-gray-300 flex items-center justify-center">
      <div className="max-w-5xl w-full flex justify-end relative">
        <div className="relative mr-3">
          <input
            type="text"
            placeholder="Search for books"
            className="border-2 focus:outline-none focus:border-slate-200 border-slate-200 bg-slate-50 py-2 text-sm w-[340px] rounded-lg pl-4 pr-10"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {isSearchOpen ? (
            <BiX
              className="absolute top-1/2 right-2 -translate-y-1/2 text-2xl border-l-2 h-full w-9 pl-2 cursor-pointer"
              onClick={handleSearchClose}
            />
          ) : (
            <AiOutlineSearch className="absolute top-1/2 right-2 -translate-y-1/2 text-2xl border-l-2 h-full w-9 pl-2 cursor-pointer" />
          )}
        </div>

        {isSearchOpen && searchInput && (
          <div className="flex flex-col max-w-[440px] w-full max-h-[640px] ml-auto overflow-y-auto p-4 absolute top-20 right-3 bg-white border border-gray-200 shadow-black shadow-sm z-20">
            {isLoading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-[120px] mb-2 bg-gray-300"
                  />
                ))
            ) : searchResults.length > 0 ? (
              searchResults.map((result, idx) => (
                <Link
                  href={`/book/${result.id}`}
                  key={idx}
                  className="hover:bg-[#f1f6f4] flex items-center p-4 gap-6 h-[120px] border-b border-b-gray-200 cursor-pointer"
                >
                  <Image
                    className="h-20 w-20 min-w-20"
                    alt="book cover"
                    width={300}
                    height={300}
                    src={result.imageLink}
                  />
                  <div>
                    <div className="text-sm font-semibold mb-2">
                      {result.title} {result.subscriptionRequired && "(Premium)"}
                    </div>
                    <div className="text-sm font-light text-gray-800 mb-2">
                      {result.author}
                    </div>
                    <div className="flex gap-1 items-center">
                      <PiClock className="flex w-4 h-4" />
                      <div className="text-sm font-light text-gray-800">
                        {audioDurations[result.id] || "Loading..."}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No book found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
