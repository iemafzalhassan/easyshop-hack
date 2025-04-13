"use client"; // Must be the very first line

import { useEffect, useState } from "react";
import fetchData from "@/lib/fetchDataFromApi";
import Link from "next/link";
import BooksSlider from "./sliders/BooksSlider";

const BooksCategory = () => {
  const [books, setBooks] = useState<BooksProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await fetchData.get("/products/books");
        setBooks(res.data.products || []);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("Error loading books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="books-category pt-20">
      <div className="container">
        <div className="flex justify-between items-center gap-4 flex-wrap mb-6">
          <h1 className="text-2xl md:text-4xl font-semibold">
            Best Sellers in Books
          </h1>
          <Link
            href={"/shops/books"}
            className="hover:underline text-primary"
          >
            View Shop
          </Link>
        </div>

        <BooksSlider books={books} />
      </div>
    </section>
  );
};

export default BooksCategory;
