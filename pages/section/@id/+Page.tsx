import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const Page = () => {
  const { data }: { data: any } = useQuery(gql`
    {
      mariageSections {
        name
        slug
        mariage_section {
          slug
        }
        contentMD
        mariage_sections {
          name
          slug
        }
      }
      mariageItems(sort: ["date:asc"]) {
        url
        tags
        date
        desc
        section {
          slug
        }
      }
    }
  `);

  let sections = [];
  let slug;

  if (typeof window != "undefined") {
    slug = location.pathname.split("/").pop()?.split("_").pop();
  }

  console.log(slug);

  if (data) {
    sections = data.mariageSections.filter((section) => section.slug == slug);
  }

  return (
    <>
      <h1>{sections[0]?.name}</h1>
      <div>{sections[0]?.contentMD}</div>
    </>
  );
};

export default Page;
