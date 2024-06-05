import fetchNews, {Article, NewsResponse} from "@/app/utils/news";

export default async function Featured() {

    const response: NewsResponse = await fetchNews();

    const firstFeatured = response.articles[0];
    const secondFeatured = response.articles[1];
    const thirdFeatured = response.articles[2];

    return <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[500px]">
        {firstFeatured && <FeaturedArticle article={firstFeatured} live={true}/>}
        <div className="grid-rows-2 gap-3 hidden md:grid">
            <FeaturedArticle article={secondFeatured}/>
            <FeaturedArticle article={thirdFeatured}/>
        </div>
    </div>

}

type FeaturedArticleProps = {
    article: Article;
    live?: boolean;
};

function FeaturedArticle({article, live = false}: FeaturedArticleProps) {

    const hasImage = article.urlToImage !== null;
    const liveIcon = <div className="absolute right-8 top-5">
        <div className="absolute bg-red-500 w-3 h-3 rounded-full"/>
        <div className="absolute bg-red-500 w-3 h-3 rounded-full animate-ping"/>
    </div>;

    if (hasImage) {

        return <a
            href={article.url}
            className={`relative overflow-hidden rounded-xl group text-white`}>
            <img
                src={article.urlToImage as string}
                className="object-cover absolute w-full h-full group-hover:scale-110 transition-transform ease-out duration-500"
            />
            <div className="absolute inset-0 bg-black opacity-35 rounded-xl"></div>
            <div
                className={`absolute h-full p-4 flex flex-col justify-between`}>
                {live && liveIcon}
                <h2 className="font-semibold">
                    {article.source?.name}
                </h2>
                <h1 className="font-bold text-2xl drop-shadow-intense">
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