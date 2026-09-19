import { ArticleImage } from "@/components/news/article-image";
import type { Article } from "@/lib/news/types";

type FeaturedGridProps = {
  articles: Article[];
};

/** Hero layout: one large story and two stacked stories, all linked to the publisher. */
export function FeaturedGrid({ articles }: FeaturedGridProps) {
  const [first, second, third] = articles;
  if (!first) return null;

  return (
    <section
      aria-labelledby="featured-heading"
      className="grid h-[520px] grid-cols-1 gap-3 md:grid-cols-2"
    >
      <h2 id="featured-heading" className="sr-only">
        Featured stories
      </h2>
      <FeaturedArticle article={first} live priority sizes="(min-width: 768px) 50vw, 100vw" />
      {second || third ? (
        <div className="hidden grid-rows-2 gap-3 md:grid">
          {second ? (
            <FeaturedArticle article={second} sizes="(min-width: 768px) 50vw, 100vw" />
          ) : null}
          {third ? (
            <FeaturedArticle article={third} sizes="(min-width: 768px) 50vw, 100vw" />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

type FeaturedArticleProps = {
  article: Article;
  sizes: string;
  live?: boolean;
  priority?: boolean;
};

function FeaturedArticle({ article, sizes, live = false, priority = false }: FeaturedArticleProps) {
  const hasImage = article.imageUrl !== null;

  return (
    <article
      data-has-image={hasImage}
      className="group rounded-card relative min-h-0 overflow-hidden"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-card absolute inset-0 flex flex-col justify-between text-white focus-visible:outline-offset-[-4px]"
      >
        {hasImage ? (
          <>
            <ArticleImage
              src={article.imageUrl}
              alt=""
              sizes={sizes}
              priority={priority}
              className="transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 group-hover:opacity-80"
            />
          </>
        ) : (
          <div
            aria-hidden="true"
            className="from-brand-strong to-brand absolute inset-0 bg-linear-to-br"
          />
        )}

        <div className="relative flex h-full flex-col justify-between p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="font-semibold drop-shadow">{article.sourceName}</p>
            {live ? <LiveBadge /> : null}
          </div>
          <div>
            <h3 className="text-2xl leading-tight font-bold drop-shadow-md md:text-[1.6rem]">
              {article.title}
            </h3>
            {!hasImage && article.description ? (
              <p className="mt-2 line-clamp-3 text-white/85">{article.description}</p>
            ) : null}
          </div>
        </div>
      </a>
    </article>
  );
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
      <span className="relative flex size-3" aria-hidden="true">
        <span className="bg-live absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:hidden" />
        <span className="bg-live relative inline-flex size-3 rounded-full" />
      </span>
      Latest
    </span>
  );
}
