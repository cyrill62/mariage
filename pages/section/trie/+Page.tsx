import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";
import ReactMarkdown from "react-markdown";
const badgeColors = [/*'primary', 'accent', */ "info", "warning", "error", "success", "secondary"];
const badgeVariants = ["soft", "outline", "dash", ""];
const Page = () => {
  const { data, loading, error }: { data: any; loading: boolean; error: any } = useQuery(gql`
    {
      mariageItems(filters: { section: null }, sort: ["date:asc"], pagination: { limit: 10 }) {
        url
        tags
        date
        desc
      }
    }
  `);

  let uncategorized = [];

  if (!loading && data) {
    uncategorized = data.mariageItems;

    return (
      <>
        <h1>A trier</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {uncategorized.map((item, i) => (
            <div key={`card-${i}`} className="rounded-box shadow-md text-center">
              <iframe src={item.url} height="200" className="rounded-t-box w-full" />
              <a href={item.url}>📰</a>
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
