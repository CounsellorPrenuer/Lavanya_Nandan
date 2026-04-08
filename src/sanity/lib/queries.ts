import { groq } from "next-sanity";

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    _id,
    brandName,
    tagline,
    about,
    primaryColor,
    secondaryColor,
    phone,
    email,
    officeLocation,
    instagram,
    linkedin,
    youtube,
    founder{
      fullName,
      designation,
      bio,
      photo,
      logo
    },
    services,
    testimonials,
    successStory,
    gallery,
    audiencePlans,
    customPackages
  }
`;

