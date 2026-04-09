import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import {
  fetchQuotesAsync,
  setRandomQuote,
} from "../features/quotes/QuotesSlice";
import RepeatIcon from "../assets/icons/repeat.svg";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

const Quotes = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { randQuote, loading, error } = useSelector(
    (state: RootState) => state.quotes,
  );

  useEffect(() => {
    dispatch(fetchQuotesAsync());
  }, [dispatch]);

  const onNewQuoteClick = () => {
    dispatch(setRandomQuote());
  };

  return (
    <div>
      <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700 text-center shadow-[0px_0px_18px_rgba(0,0,0,0.4)]">
        <div className="flex flex-row justify-between items-center mb-2">
          <p className="text-gray-100 text-[18px] p-1 font-bold uppercase tracking-widest titles-pulse">
            Zitat des Tages:
          </p>
          <button
            onClick={onNewQuoteClick}
            disabled={loading} // disabling button when still loading
            className="p-2 rounded-lg bg-gray-700 hover:bg-cyan-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <img
              src={RepeatIcon}
              alt="Neues Zitat"
              className="w-5 h-5 invert"
            />
          </button>
        </div>

        <div className="border-b border-gray-600 w-full"></div>

        {/* Error */}
        {!loading && error && (
          <p className="text-red-400 p-2 text-sm">Fehler: {error}</p>
        )}

        {/* Show loading or the quote */}
        {loading ? (
          <div className="flex justify-center py-8">
            <ArrowPathIcon className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-gray-300 text-s italic leading-relaxed p-2">
              "{randQuote?.quote || "Kein Zitat gefunden"}"
            </p>
            <p className="text-gray-500 text-[14px] italic mt-1">
              — {randQuote?.author || "Unbekannt"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quotes;
