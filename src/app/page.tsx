import { SitePage, type HomePageData } from "@/components/site-page";
import { client } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";

const fallbackData: HomePageData = {
  brandName: "Lavanyam Marga Darshini",
  tagline: "Nurturing Dreams, Shaping Careers",
  about: [],
};

export default async function Home() {
  const data = await client.fetch<HomePageData | null>(homePageQuery, {}, {
    next: { revalidate: 30 },
  });

  return <SitePage data={data || fallbackData} />;
}
