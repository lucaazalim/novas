import {FaBriefcase, FaFlask, FaFootball, FaGlobe, FaMasksTheater, FaMicrochip, FaStarOfLife} from "react-icons/fa6";
import {IconType} from "react-icons";

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

export type NewsConfig = {
    country: Country;
    category?: Category;
};

export type Category = {
    key: string;
    name: string;
    icon: IconType;
};

export const Categories: Category[] = [
    {key: 'general', name: 'General', icon: FaGlobe},
    {key: 'business', name: 'Business', icon: FaBriefcase},
    {key: 'entertainment', name: 'Entertainment', icon: FaMasksTheater},
    {key: 'health', name: 'Health', icon: FaStarOfLife},
    {key: 'science', name: 'Science', icon: FaFlask},
    {key: 'sports', name: 'Sports', icon: FaFootball},
    {key: 'technology', name: 'Technology', icon: FaMicrochip}
];

export type Country = {
    code: string;
    name: string;
}

export const UnitedStates = {code: 'US', name: 'United States'};

export const Countries: Country[] = [
    {code: 'ZA', name: 'South Africa'},
    {code: 'DE', name: 'Germany'},
    {code: 'SA', name: 'Saudi Arabia'},
    {code: 'AR', name: 'Argentina'},
    {code: 'AU', name: 'Australia'},
    {code: 'AT', name: 'Austria'},
    {code: 'BE', name: 'Belgium'},
    {code: 'BG', name: 'Bulgaria'},
    {code: 'BR', name: 'Brazil'},
    {code: 'CA', name: 'Canada'},
    {code: 'CH', name: 'Switzerland'},
    {code: 'CN', name: 'China'},
    {code: 'CO', name: 'Colombia'},
    {code: 'CU', name: 'Cuba'},
    {code: 'CZ', name: 'Czech Republic'},
    {code: 'EG', name: 'Egypt'},
    {code: 'SI', name: 'Slovenia'},
    {code: 'SK', name: 'Slovakia'},
    {code: 'ES', name: 'Spain'},
    UnitedStates,
    {code: 'PH', name: 'Philippines'},
    {code: 'FR', name: 'France'},
    {code: 'GR', name: 'Greece'},
    {code: 'HK', name: 'Hong Kong'},
    {code: 'HU', name: 'Hungary'},
    {code: 'IN', name: 'India'},
    {code: 'ID', name: 'Indonesia'},
    {code: 'IE', name: 'Ireland'},
    {code: 'IL', name: 'Israel'},
    {code: 'IT', name: 'Italy'},
    {code: 'JP', name: 'Japan'},
    {code: 'LV', name: 'Latvia'},
    {code: 'LT', name: 'Lithuania'},
    {code: 'MY', name: 'Malaysia'},
    {code: 'MA', name: 'Morocco'},
    {code: 'MX', name: 'Mexico'},
    {code: 'NG', name: 'Nigeria'},
    {code: 'NO', name: 'Norway'},
    {code: 'NZ', name: 'New Zealand'},
    {code: 'NL', name: 'Netherlands'},
    {code: 'PL', name: 'Poland'},
    {code: 'PT', name: 'Portugal'},
    {code: 'GB', name: 'United Kingdom'},
    {code: 'RO', name: 'Romania'},
    {code: 'RU', name: 'Russia'},
    {code: 'SG', name: 'Singapore'},
    {code: 'SE', name: 'Sweden'},
    {code: 'KR', name: 'South Korea'},
    {code: 'TH', name: 'Thailand'},
    {code: 'TW', name: 'Taiwan'},
    {code: 'TR', name: 'Turkey'},
    {code: 'UA', name: 'Ukraine'},
    {code: 'VE', name: 'Venezuela'}
];

export default async function fetchNews({country, category}: NewsConfig): Promise<NewsResponse> {

    let url = `https://newsapi.org/v2/top-headlines?country=${country.code}&apiKey=${process.env.NEWS_API_KEY}`;

    if (category) {
        url += `&category=${category.key}`;
    }

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

function removeAfterLastDash(input: string): string {
    const lastDashIndex = input.lastIndexOf('-');
    if (lastDashIndex === -1) {
        return input;
    }
    return input.substring(0, lastDashIndex);
}