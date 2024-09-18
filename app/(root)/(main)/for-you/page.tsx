"use client";

import React, { useEffect, useState } from "react";
import Searchbar from "@/app/components/global/Searchbar";
import Selected from "@/app/components/for-you/Selected";

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: string[];
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

const ForYou = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-[100rem]">
      <Searchbar />
      <div className="max-w-5xl px-6">
        <div className="pt-10">
          {books.map((book) => (
            <Selected
              key={book.id}
              img={book.imageLink}
              subTitle={book.subTitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForYou;
