"use client";

import {Article, NewsResponse} from "@/app/integrations/news/news";
import Loading from "@/app/components/Loading";

type FeaturedProps = {
    news?: NewsResponse;
}

export default function Featured({news}: FeaturedProps) {

    const articles = news?.articles;
    const firstFeatured = articles?.[0];
    const secondFeatured = articles?.[1];
    const thirdFeatured = articles?.[2];

    return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[500px]">
        <FeaturedArticle article={firstFeatured} live={true}/>
        <div className="grid-rows-2 gap-3 hidden md:grid">
            <FeaturedArticle article={secondFeatured}/>
            <FeaturedArticle article={thirdFeatured}/>
        </div>
    </div>

}

type FeaturedArticleProps = {
    article?: Article;
    live?: boolean;
};

function FeaturedArticle({article, live = false}: FeaturedArticleProps) {

    if (!article) {
        return <Loading/>
    }

    const hasImage = article.urlToImage !== null;
    const liveIcon = <div className="absolute right-8 top-5">
        <div className="absolute bg-red-500 w-3 h-3 rounded-full"/>
        <div className="absolute bg-red-500 w-3 h-3 rounded-full animate-ping"/>
    </div>;

    if (hasImage) {

        return <a
            href={article.url}
            className={`group relative overflow-hidden rounded-xl text-white`}>

            <img
                src={article.urlToImage as string}
                className="object-cover absolute w-full h-full group-hover:scale-110 transition-transform ease-out duration-500"
            />

            <div
                className="absolute inset-0
                bg-gradient-to-t from-black to-transparent
                opacity-75 group-hover:opacity-50 transition-opacity duration-700"/>

            <div
                className={`absolute h-full p-4 flex flex-col justify-between`}>
                {live && liveIcon}
                <h2 className="font-semibold">
                    {article.source?.name}
                </h2>
                <h1 className="font-bold text-2xl">
                    {article.title}
                </h1>
            </div>

        </a>

    } else {

        return <a
            href={article.url}
            className={`relative overflow-hidden rounded-xl group border-2 bg-white`}>

            <div
                className={`absolute h-full p-4 flex flex-col justify-between`}>
                <h2 className="font-semibold">
                    {article.source?.name}
                </h2>
                <h1 className="font-bold text-2xl text-primary hover:text-secondary">{article.title}</h1>
                <h3 className="font-light">
                    {article.description}
                </h3>
            </div>
        </a>;

    }

}