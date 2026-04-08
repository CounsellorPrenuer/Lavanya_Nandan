"use client";

import { useEffect, useState } from "react";
import { SitePage, type HomePageData } from "@/components/site-page";
import { client } from "@/sanity/lib/client";
import { homePageQuery } from "@/sanity/lib/queries";

const fallbackData: HomePageData = {
  brandName: "Lavanyam Marga Darshini",
  tagline: "Nurturing Dreams, Shaping Careers",
  about: [],
};

export default function Home() {
  const [data, setData] = useState<HomePageData>(fallbackData);

  useEffect(() => {
    let mounted = true;
    client
      .fetch<HomePageData | null>(homePageQuery)
      .then((res) => {
        if (mounted && res) setData(res);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return <SitePage data={data} />;
}

