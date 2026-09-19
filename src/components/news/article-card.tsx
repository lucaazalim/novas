import { ArticleImage } from "@/components/news/article-image";
import { PublishedTime } from "@/components/news/published-time";
import type { Article } from "@/lib/news/types";

type ArticleCardProps = {
  article: Article;
  now: Date;
};

export function ArticleCard({ article, now }: ArticleCardProps) {
  const hasImage = article.imageUrl !== null;

  return (
    <article
      data-has-image={hasImage}
      className="max-lg:rounded-card max-lg:border-border max-lg:bg-surface grid grid-cols-1 gap-x-5 gap-y-3 max-lg:overflow-hidden max-lg:border lg:grid-cols-8"
    >
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        aria-hidden="true"
        className="lg:rounded-card relative block aspect-video overflow-hidden lg:col-span-3 lg:aspect-[4/3]"
      >
        <ArticleImage
          src={article.imageUrl}
          alt=""
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="h-full w-full"
        />
      </a>

      <div className="flex flex-col gap-2 max-lg:p-4 max-lg:pt-0 lg:col-span-5">
        <p className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className="font-semibold">{article.sourceName}</span>
          <span aria-hidden="true" className="text-muted">
            •
          </span>
          <PublishedTime publishedAt={article.publishedAt} now={now} className="text-muted" />
        </p>
        <h3 className="text-xl leading-snug font-bold">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-strong hover:underline"
          >
            {article.title}
          </a>
        </h3>
        {article.description ? (
          <p className="text-fg/90 line-clamp-3 font-light">{article.description}</p>
        ) : null}
      </div>
    </article>
  );
}
