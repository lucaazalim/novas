import { gnewsProvider } from "@/lib/news/providers/gnews";
import { newsApiProvider } from "@/lib/news/providers/newsapi";
import { newsDataProvider } from "@/lib/news/providers/newsdata";
import type { NewsProvider } from "@/lib/news/providers/types";

/** Every supported upstream API. Only the ones with a configured key are queried. */
export const NEWS_PROVIDERS: readonly NewsProvider[] = [
  newsApiProvider,
  newsDataProvider,
  gnewsProvider,
];
