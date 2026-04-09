import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Quote } from "../../types/Quote.ts";

interface QuotesState {
  quotes: Quote[];
  randQuote: Quote;
  loading: boolean;
  error: string | null;
}

const initialState: QuotesState = {
  quotes: [],
  randQuote: { id: 0, author: "", quote: "" },
  loading: false,
  error: null,
};

const quotesFilePath = "/data/quotes.json";

export const fetchQuotesAsync = createAsyncThunk(
  "quotes/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(quotesFilePath);

      if (!response.ok) {
        throw Error(
          "Quotes could not be loaded... Maybe the file does not exist?",
        );
      }

      const data = await response.json();
      const importedQuotes: Quote[] = data.quote_compilation;

      if (!importedQuotes) {
        throw Error(
          "Quotes could not be read! Maybe they are in the wrong format.",
        );
      }
      return importedQuotes;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || "Failed to fetch quotes");
      }
    }
  },
);

const quotesSlice = createSlice({
  name: "quotes",
  initialState,
  reducers: {
    setRandomQuote: (state) => {
      if (state.quotes.length > 0) {
        let newQuote;
        do {
          newQuote =
            state.quotes[Math.floor(Math.random() * state.quotes.length)];
        } while (state.quotes.length > 1 && newQuote.id === state.randQuote.id);

        state.randQuote = newQuote;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Quotes Lifecycle
    builder
      .addCase(fetchQuotesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuotesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.quotes = action.payload as Quote[];

        if (action.payload !== undefined && action.payload.length > 0) {
          state.randQuote =
            action.payload[Math.floor(Math.random() * action.payload.length)];
        }
      })
      .addCase(fetchQuotesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setRandomQuote, clearError } = quotesSlice.actions;
export default quotesSlice.reducer;
