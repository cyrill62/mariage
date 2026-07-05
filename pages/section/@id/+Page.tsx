import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import ReactMarkdown from "react-markdown";

const Page = () => {
  const { data }: { data: any } = useQuery(gql`
    {
      mariageSections(pagination: { limit: 100 }) {
        name
        slug
        mariage_section {
          slug
        }
        contentMD
        mariage_sections(pagination: { limit: 100 }, sort: ["order:asc"]) {
          name
          slug
        }
        items(sort: ["date:asc"]) {
          url
          tags
          date
          desc
        }
      }
    }
  `);

  let sections = [];
  let slug;

  if (typeof window != "undefined") {
    slug = location.pathname.replace(/\/$/, "").split("/").pop()?.split("_").pop();
  }

  if (data) {
    sections = data.mariageSections.filter((section) => section.slug == slug);
  }

  const section = sections[0];

  if (section) {
    console.log(section);
    return (
      <>
        <h1>{section.name}</h1>
        <div>
          <ReactMarkdown>{section.contentMD}</ReactMarkdown>
        </div>
        <ul>
          {section.mariage_sections.map((sub) => (
            <li>
              <a href={`/section/${section.slug}_${sub.slug}`}>{sub.name}</a>
            </li>
          ))}
        </ul>
        <ul>
          {section.items.map((item) => (
            <li>
              <iframe src={item.url} alt={item.url} width="300" height="300" />
              <div>
                <ReactMarkdown>{item.desc}</ReactMarkdown>
              </div>
              <div>
                {"#"}
                {item.tags.join("; #")}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  } else {
    return (
      <>
        <div className="loading" />
      </>
    );
  }
};

export default Page;
