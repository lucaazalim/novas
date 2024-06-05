export type Source = {
    id: string | null;
    name: string;
};

export type Article = {
    source: Source;
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
};

export type NewsResponse = {
    status: string;
    totalResults: number;
    articles: Article[];
};

export default async function fetchNews(): Promise<NewsResponse> {

    const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
    );

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

function removeAfterLastDash(input: string): string {
    const lastDashIndex = input.lastIndexOf('-');
    if (lastDashIndex === -1) {
        return input;
    }
    return input.substring(0, lastDashIndex);
}