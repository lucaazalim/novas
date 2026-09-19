import { ArticleCard } from "@/components/news/article-card";
import type { Article } from "@/lib/news/types";

type ArticleListProps = {
  articles: Article[];
  now: Date;
};

export function ArticleList({ articles, now }: ArticleListProps) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:max-lg:grid-cols-2 lg:gap-0">
      {articles.map((article) => (
        <li
          key={article.url}
          className="lg:border-border lg:border-b lg:py-5 lg:first:pt-0 lg:last:border-b-0"
        >
          <ArticleCard article={article} now={now} />
        </li>
      ))}
    </ul>
  );
}
