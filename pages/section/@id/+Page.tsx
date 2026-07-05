import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import ReactMarkdown from "react-markdown";
const badgeColors = [/*'primary', 'accent', */ "info", "warning", "error", "success", "secondary"];
const badgeVariants = ["soft", "outline", "dash", ""];
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
        <div className="carousel w-full">
          {section.items.map((item, i) => (
            <div id={`item-${i}`}  className="carousel-item relative w-full">
              <iframe src={item.url} alt={item.url} width="300" height="300" className="w-full" />
              <div className="caption">
                <ReactMarkdown>{item.desc}</ReactMarkdown>
              </div>
              <div>
                {item.tags.map((tag, i) => (
                  <div
                    className={`badge badge-${badgeVariants[i % badgeVariants.length]} badge-${badgeColors[i % badgeColors.length]} me-2`}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href={`#item-${i - 1}`} className="btn btn-circle">
                  ❮
                </a>
                <a href={`#item-${i + 1}`} className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>
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
