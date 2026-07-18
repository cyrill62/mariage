import typesense, { SearchResult } from "typesense";
import { useState } from "react";
const badgeColors = ["primary", "accent", "info", "warning", "error", "success", "secondary"];
const badgeVariants = ["soft", "outline", "dash", ""];

const tags = [
  "enfants",
  "mariés",
  "khodadeen",
  "lepagnot",
  "bernier",
  "Alice",
  "Ambre",
  "Elisabeth Canick",
  "Eric",
  "Elena",
  "Gabriel",
  "Henri",
  "Jade",
  "Jennifer",
  "Aféz",
  "Ajam",
  "Claudine",
  "Iqbal",
  "Noorani",
  "Shamine",
  "Sylvianne",
  "Betty",
  "Blandine",
  "Sarah",
  "Kévin",
  "Louis",
  "Philippe",
  "Christine",
  "Alisson",
  "Audrey",
  "Victor",
  "David",
  "Elisabeth Heddebaut",
  "Elise",
  "Félicien",
  "Stella",
  "Corinne",
  "Francoise",
  "Géraldine",
  "Jean Paul",
  "Martial",
  "Mickael",
  "Thevy",
  "Sovana",
  "Soraya",
  "César",
  "Cyril",
  "Fred",
  "Isabelle",
  "Joanna",
  "Morad",
  "Pamela",
  "Romain",
  "Sophie",
];

// Define the shape of your stored documents for type safety
interface MariageItemSchema {
  id: string;
  url?: string;
  tags?: string[];
}

interface SearchConfig {
  url: string;
  apiKey: string;
  collectionName?: string;
  queryBy?: (keyof MariageItemSchema)[]; // Fields to search in
  limit?: number; // Max results to return per page
}
const randomSelect = (arr: readonly string[]): string | undefined => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export default function Page() {
  const [items, setItems] = useState([]);
  /**
   * Searches for a word/phrase in your self-hosted Typesense service.
   * Returns the full Typesense SearchResult object containing matched documents.
   */
  async function searchMariageItems(tag: string, config: SearchConfig): Promise<SearchResult<MariageItemSchema>> {
    const url = new URL(config.url);

    const client = new typesense.Client({
      nodes: [
        {
          host: url.hostname,
          port: url.port,
          protocol: url.protocol.replace(/:$/, ""),
        },
      ],
      apiKey: config.apiKey,
      connectionTimeoutSeconds: 2,
    });

    const collectionName = config.collectionName;

    // Typesense expects query_by as a comma-separated string
    const searchParams = {
      q: "*",
      query_by: "url",
      limit: config.limit || 100,
      filter_by: `tags:=[${tag}]`,
      // Optional: add `sort_by`, `filter_by`, `page`, etc.
    };

    try {
      const results = await client.collections(collectionName).documents().search<MariageItemSchema>(searchParams);
      return results;
    } catch (error) {
      console.error("❌ Typesense search failed:", error);
      throw new Error("Failed to retrieve mariage items from Typesense.");
    }
  }

  // Example usage in your app/server
  async function runSearch(tag: string) {
    const config: SearchConfig = {
      url: import.meta.env.PUBLIC_ENV__TYPESENSE_API_URL,
      apiKey: import.meta.env.PUBLIC_ENV__TYPESENSE_API_KEY, // 🔒 Never hardcode! Use process.env.TYPESENSE_API_KEY
      collectionName: "mariage_items",
      queryBy: ["url"], // Fields to search in
      limit: 50,
    };

    try {
      const result = await searchMariageItems(tag, config);

      console.log(`🔍 Found ${result.found} matches.`);

      // Extract the actual documents from the response
      const matchedItems = result.hits.map((hit) => hit.document);
      console.table(matchedItems);
      setItems(matchedItems);
    } catch (err) {
      console.error("Search failed:", err.message);
    }
  }
  return (
    <>
      <h1>Recherchez les images ou vidéos où sont présentent :</h1>
      <div>
        {tags.sort().map((tag) => (
          <a
            className={`badge badge-${randomSelect(badgeVariants)} badge-${randomSelect(badgeColors)} me-2`}
            href={`#${tag}`}
            onClick={() => runSearch(tag)}
          >
            #{tag}
          </a>
        ))}
      </div>
      <div className="hidden">
        <div className="badge badge-primary">primary</div>
        <div className="badge badge-soft badge-primary">primary</div>
        <div className="badge badge-dash badge-primary">primary</div>

                <div className="badge badge-accent">accent</div>
        <div className="badge badge-soft badge-accent">accent</div>
        <div className="badge badge-dash badge-accent">accent</div>

                <div className="badge badge-success">success</div>
        <div className="badge badge-soft badge-success">success</div>
        <div className="badge badge-dash badge-success">success</div>

                <div className="badge badge-info">info</div>
        <div className="badge badge-soft badge-info">info</div>
        <div className="badge badge-dash badge-info">info</div>
      </div>

      <div className="divider" />
      {items.length == 0 && (
        <div role="alert" className="alert alert-warning alert-dash">
          <span>Aucun résultat trouvé</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={`card-${i}`} className="rounded-box shadow-md text-center">
            <iframe src={item.url} height="200" className="rounded-t-box w-full" />
          </div>
        ))}
      </div>
    </>
  );
}
