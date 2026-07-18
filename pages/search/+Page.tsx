import typesense, { SearchResult } from "typesense";

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
export interface MariageItemSchema {
  id: string;
  name?: string;
  email?: string;
  // Add other fields exactly as they appear in your Typesense collection schema
  [key: string]: unknown;
}

interface SearchConfig {
  host: string;
  port: number | string;
  protocol: "http" | "https";
  apiKey: string;
  collectionName?: string;
  queryBy?: (keyof MariageItemSchema)[]; // Fields to search in
  limit?: number; // Max results to return per page
}

export default function Page() {
  /**
   * Searches for a word/phrase in your self-hosted Typesense service.
   * Returns the full Typesense SearchResult object containing matched documents.
   */
  export async function searchMariageItems(
    queryWord: string,
    config: SearchConfig,
  ): Promise<SearchResult<MariageItemSchema>> {
    // ⚠️ In production, instantiate the client once and reuse it to avoid overhead
    const client = new typesense.Client({
      nodes: [
        {
          host: String(config.host),
          port: config.port,
          protocol: config.protocol,
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
      host: "search.lepagnot.fr",
      port: "443",
      protocol: "https",
      apiKey: "your-strong-master-key", // 🔒 Never hardcode! Use process.env.TYPESENSE_API_KEY
      collectionName: "mariageItems",
      queryBy: ["url"], // Fields to search in
      limit: 50,
    };

    try {
      const result = await searchMariageItems(tag, config);

      console.log(`🔍 Found ${result.found} matches.`);

      // Extract the actual documents from the response
      const matchedItems = result.hits.map((hit) => hit.document);

      console.table(matchedItems);
    } catch (err) {
      console.error("Search failed:", err.message);
    }
  }
  return (
    <>
      <h1>Recherchez les images ou vidéos où sont présentent :</h1>
      <div>
        {tags.map((tag) => (
          <a className={`badge me-2`} href={`#${tag}`} onClick={() => runSearch(tag)}>
            #{tag}
          </a>
        ))}
      </div>
    </>
  );
}
