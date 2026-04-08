import { useEffect, useState } from "react";
import type { Quote } from "../types/Quote";
import RepeatIcon from "../assets/icons/repeat.svg";

const quotesFilePath = "/data/quotes.json";

const Quotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [randQuote, setRandQuote] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);

      const response = await fetch(quotesFilePath);

      if (!response.ok) {
        console.error(
          "Quotes could not be loaded... Maybe the file does not exist?",
        );
      }

      const data = await response.json();
      const importedQuotes: Quote[] = data.quote_compilation;

      if (!importedQuotes) {
        console.error(
          "Quotes could not be read! Maybe they are in the wrong format.",
        );
      }

      setQuotes(importedQuotes);

      const randomQuote =
        importedQuotes[Math.floor(Math.random() * importedQuotes.length)];
      setRandQuote(randomQuote);

      setLoading(false);
    };

    fetchQuotes();
  }, []);

  const onNewQuoteClick = () => {
    let newRandomQuote: Quote = randQuote!;

    do {
      newRandomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newRandomQuote.id === randQuote?.id);

    setRandQuote(newRandomQuote);
  };

  return (
    <div>
      <div className="p-4 bg-gray-900/40 rounded-xl border border-gray-700 text-center shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
        <div className="flex flex-row justify-between">
          <p className="text-gray-200 text-lg p-1">Zitat des Tages: </p>
          <button
            onClick={onNewQuoteClick}
            className="p-2 rounded-lg bg-gray-700 hover:bg-cyan-600 transition-colors cursor-pointer"
          >
            <img src={RepeatIcon} alt="Edit" className="w-5 h-5 invert" />
          </button>
        </div>
        <div className="border-b border-gray-600 w-full pt-2"></div>
        {loading && randQuote?.quote !== "" ? (
          <p>Lade das beste Zitat...</p>
        ) : (
          <div>
            <p className="text-gray-400 text-s italic leading-relaxed border-b border-gray-600 p-1">
              "{randQuote?.quote}"
            </p>
            <span className="text-gray-500 text-[14px] italic leading-relaxed">
              ({randQuote?.author})
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
