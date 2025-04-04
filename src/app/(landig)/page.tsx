import { LandingPage } from "@/components/landing-page";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <LandingPage />
      <a
        className="fixed bottom-0 right-0 mb-4 mr-4"
        href="https://www.producthunt.com/posts/clash-of-apps?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-clash&#0045;of&#0045;apps"
        target="_blank"
      >
        <img
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=949501&theme=light&t=1743769160840"
          alt="Clash&#0032;of&#0032;Apps - Track&#0032;&#0038;&#0032;Analyze&#0032;Your&#0032;App&#0032;Competitors | Product Hunt"
          width={250}
          height={54}
        />
      </a>
    </HydrateClient>
  );
}
