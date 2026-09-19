import type { Article } from "@/lib/news/types";

type NewsJsonLdProps = {
  name: string;
  articles: Article[];
};

/** schema.org ItemList of NewsArticle entries so crawlers understand the page is a headline list. */
export function NewsJsonLd({ name, articles }: NewsJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: articles.slice(0, 20).map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "NewsArticle",
        headline: article.title,
        url: article.url,
        datePublished: article.publishedAt,
        ...(article.description ? { description: article.description } : {}),
        ...(article.imageUrl ? { image: [article.imageUrl] } : {}),
        ...(article.author ? { author: { "@type": "Person", name: article.author } } : {}),
        publisher: { "@type": "Organization", name: article.sourceName },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
    />
  );
}
