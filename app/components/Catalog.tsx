import fetchNews, {Article, NewsResponse} from "@/app/utils/news";
import {timeAgo} from "@/app/utils/datetime";

export default async function Catalog() {

    const response: NewsResponse = await fetchNews();

    return <div className="flex flex-col gap-10">
        {response.articles.slice(3).map((article, index) =>
            <CatalogArticle key={index} article={article}/>
        )}
    </div>;

}

type CatalogArticleProps = {
    article: Article;
}

function CatalogArticle({article}: CatalogArticleProps) {

    return <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        <a href={article.url} className="md:col-span-2">
            {article.urlToImage
                ? <img
                    src={article.urlToImage}
                    className="object-cover w-full max-h-48 min-w-full min-h-96 md:min-h-48 rounded-xl"
                />
                : <></>
            }
        </a>
        <div className="md:col-span-4 flex flex-col justify-between">
            <div>
                {article.source?.name && <h3 className="font-semibold">{article.source.name}</h3>}
                <a href={article.url}>
                    <h1 className="text-primary hover:text-secondary font-bold text-2xl">
                        {article.title}
                    </h1>
                </a>
                <h2 className="font-light">{article.description}</h2>
            </div>
            <h3 className="opacity-50">{timeAgo(article.publishedAt)}</h3>
        </div>
    </div>;

}