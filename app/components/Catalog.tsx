import {Article, NewsResponse} from "@/app/utils/news";
import {timeAgo} from "@/app/utils/datetime";
import {FaFaceSadTear} from "react-icons/fa6";

type CatalogProps = {
    news?: NewsResponse;
}

export default function Catalog({news}: CatalogProps) {

    if (!news) {
        return;
    }

    const {articles} = news;

    return <div className="grid grid-cols-1 sm:max-lg:grid-cols-2 lg:divide-y-2 max-lg:gap-5">
        {articles.slice(3).map((article, index) =>
            <div key={index}>
                <CatalogArticle article={article}/>
            </div>
        )}
    </div>;

}

type CatalogArticleProps = {
    article: Article;
}

function CatalogArticle({article}: CatalogArticleProps) {

    const imgClasses = "rounded-t-xl lg:rounded-xl min-w-full min-h-64 max-h-64 sm:max-lg:min-h-48 sm:max-lg:max-h-48 md:min-h-48";

    return <div
        className="grid grid-cols-1 lg:grid-cols-8 lg:my-5 max-lg:bg-white max-lg:rounded-xl lg:gap-x-5">
        <a href={article.url} className="lg:col-span-3">
            {article.urlToImage
                ? <img
                    src={article.urlToImage}
                    className={`object-cover ${imgClasses}`}
                />
                : <div
                    className={`flex justify-center items-center text-4xl text-gray-400 bg-gray-300 ${imgClasses}`}>
                    <FaFaceSadTear/>
                </div>
            }
        </a>
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 max-lg:p-3">
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