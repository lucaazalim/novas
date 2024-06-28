"use server";

import {Article, NewsResponse, removeAfterLastDash} from "@/app/integrations/news/news";

export default async function fetchNews(countryCode: string, categoryKey: string): Promise<NewsResponse> {

    let url = `https://newsapi.org/v2/top-headlines?country=${countryCode}&category=${categoryKey}&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    const json = await response.json();

    json.articles = json.articles
        .filter((article: Article) =>
            article.title !== "[Removed]"
        )
        .sort((a: Article, b: Article) => {
            if (a.urlToImage && !b.urlToImage) return -1;
            if (!a.urlToImage && b.urlToImage) return 1;
            return 0;
        });

    json.articles.forEach((article: Article) => {
        article.title = removeAfterLastDash(article.title);
    });

    return json as NewsResponse;

}