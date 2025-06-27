import React, { useState, useEffect } from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";

interface Quote {
  content: string; // quote text
  author: string; // author
}

const fallbackQuotes: Quote[] = [
  { content: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { content: "The pessimist sees difficulty in every opportunity. The optimist sees the opportunity in every difficulty.", author: "Winston Churchill" },
  { content: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
  { content: "You learn more from failure than from success. Don’t let it stop you. Failure builds character.", author: "Unknown" },
  { content: "It’s not whether you get knocked down, it’s whether you get up.", author: "Vince Lombardi" },
];

const QuoteBanner: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      if (import.meta.env.DEV) {
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        setQuote(random);
        return;
      }
      const res = await fetch("https://api.quotable.io/random");
      const data: Quote = await res.json();
      setQuote(data);
    } catch (error) {
      // fetch error suppressed, using fallback quote
      // fallback to a local quote
      const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="mt-16 w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow-lg text-center">
      {loading && (
  <div className="flex justify-center py-4">
    <HiOutlineArrowPath className="animate-spin h-8 w-8 text-gray-500" />
  </div>
)}
      {quote && (
        <>
          <p className="text-lg italic text-gray-800 dark:text-gray-200">
            &ldquo;{quote.content}&rdquo;
          </p>
          <p className="mt-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
            — {quote.author}
          </p>
        </>
      )}
      <button
        onClick={fetchQuote}
        className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Refresh Quote
      </button>
    </div>
  );
};

export default QuoteBanner;
