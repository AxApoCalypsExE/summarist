"use client";

import React, { useEffect, useState } from "react";
import Searchbar from "@/app/components/global/Searchbar";
import Selected from "@/app/components/for-you/Selected";
import Recommended from "@/app/components/for-you/Recommended";
import Suggested from "@/app/components/for-you/Suggested";
import Sidebar from "@/app/components/global/Sidebar";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: string;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

const ForYou = () => {
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const [selectedResponse, recommendedResponse, suggestedResponse] =
          await Promise.all([
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
            ),
            fetch(
              "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
            ),
          ]);

        if (
          !selectedResponse.ok ||
          !recommendedResponse.ok ||
          !suggestedResponse.ok
        ) {
          throw new Error("Failed to fetch books");
        }

        const selectedData = await selectedResponse.json();
        const recommendedData = await recommendedResponse.json();
        const suggestedData = await suggestedResponse.json();

        setSelectedBooks(selectedData);
        setRecommendedBooks(recommendedData);
        setSuggestedBooks(suggestedData);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Sidebar />
      <div className="flex justify-center flex-col">
        <Searchbar />
        <div className="w-[1070px] px-6 mx-auto">
          <div className="py-10">
            <section className="flex flex-col justify-center mb-6">
              <h1 className="text-[22px] font-bold mb-4 w-full">
                Selected just for you
              </h1>
              {loading ? (
                <div className="animate-pulse flex flex-col">
                  <div className="w-[650px] h-[200px] bg-gray-300 rounded-md"></div>{" "}
                </div>
              ) : (
                selectedBooks.map((selectBook) => (
                  <Selected
                    key={selectBook.id}
                    id={selectBook.id}
                    img={selectBook.imageLink}
                    subTitle={selectBook.subTitle}
                    title={selectBook.title}
                    author={selectBook.author}
                    audio={selectBook.audioLink}
                  />
                ))
              )}
            </section>
            <h1 className="text-[22px] font-bold mb-4 w-full">
              Recommended For You
            </h1>
            <p className="text-gray-500 mb-4">
              We think you&apos;ll like these
            </p>
            <div className="flex overflow-x-scroll gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar mb-8">
              {loading ? (
                <div className="animate-pulse flex flex-col">
                  <div className="w-[1050px] h-[200px] bg-gray-300 rounded-md"></div>{" "}
                </div>
              ) : (
                recommendedBooks.map((recommendedBook) => (
                  <Recommended
                    key={recommendedBook.id}
                    img={recommendedBook.imageLink}
                    subTitle={recommendedBook.subTitle}
                    title={recommendedBook.title}
                    author={recommendedBook.author}
                    averageRating={recommendedBook.averageRating}
                    id={recommendedBook.id}
                    subscriptionRequired={recommendedBook.subscriptionRequired}
                    audio={recommendedBook.audioLink}
                  />
                ))
              )}
            </div>
            <h1 className="text-[22px] font-bold mb-4 w-full">
              Suggested Books
            </h1>
            <p className="text-gray-500 mb-4">Browse those books</p>
            <div className="flex overflow-x-scroll gap-4 snap-x snap-mandatory scroll-smooth hide-scrollbar mb-8">
              {loading ? (
                <div className="animate-pulse flex flex-col">
                  <div className="w-[1050px] h-[200px] bg-gray-300 rounded-md"></div>{" "}
                </div>
              ) : (
                suggestedBooks.map((suggestedBooks) => (
                  <Suggested
                    key={suggestedBooks.id}
                    img={suggestedBooks.imageLink}
                    subTitle={suggestedBooks.subTitle}
                    title={suggestedBooks.title}
                    author={suggestedBooks.author}
                    averageRating={suggestedBooks.averageRating}
                    id={suggestedBooks.id}
                    subscriptionRequired={suggestedBooks.subscriptionRequired}
                    audio={suggestedBooks.audioLink}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForYou;
