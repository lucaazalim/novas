import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";

import { siteConfig } from "@/lib/site";

const dataSources = [
  { name: "News API", href: "https://newsapi.org/" },
  { name: "NewsData.io", href: "https://newsdata.io/" },
  { name: "GNews", href: "https://gnews.io/" },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand text-brand-fg">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FooterBlock className="flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt={siteConfig.name}
              width={128}
              height={29}
              className="h-auto w-32"
            />
          </FooterBlock>

          <FooterBlock>
            <h2 className="mb-3 text-xl font-bold">About</h2>
            <p className="font-light">
              {siteConfig.name} is your go-to source for the latest updates around the world.
              Stories are sourced from reputable third parties, giving you a diverse view of current
              events.
            </p>
            <p className="mt-3 text-sm font-light text-white/80">
              Data by{" "}
              {dataSources.map((source, index) => (
                <span key={source.href}>
                  <a
                    href={source.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="underline"
                  >
                    {source.name}
                  </a>
                  {index < dataSources.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </FooterBlock>

          <FooterBlock className="flex flex-col justify-between gap-4">
            <div>
              <h2 className="mb-3 text-xl font-bold">Open source</h2>
              <p className="font-light">
                {siteConfig.name} was built as a side project and is completely open source.
                Contributions are welcome.
              </p>
            </div>
            <a
              href={siteConfig.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 font-bold transition-colors hover:bg-gray-100"
            >
              GitHub repository
              <ExternalLinkIcon className="size-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </FooterBlock>
        </div>
      </div>
    </footer>
  );
}

function FooterBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`from-brand-strong to-brand rounded-xl bg-linear-to-tr p-5 ${className ?? ""}`}>
      {children}
    </div>
  );
}
