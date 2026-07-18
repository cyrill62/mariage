import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

const badgeColors = [/*'primary', 'accent', */ "info", "warning", "error", "success", "secondary"];
const badgeVariants = ["soft", "outline", "dash", ""];
const Page = () => {
  const [toast, setToast] = useState();

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

  /**
   * Copies the provided URL/link text to the user's clipboard.
   * Uses the modern Clipboard API with a secure fallback for older browsers/restricted contexts.
   *
   * @param url The link or text to copy
   * @returns Promise<boolean> true on success, false on failure
   */
  async function copyLinkToClipboard(event: any, url: string): Promise<boolean> {
    event.preventDefault();
    event.stopPropagation();

    if (typeof url !== "string" || !url.trim()) {
      console.error("❌ Invalid URL provided to clipboard function");
      return false;
    }

    // 1️⃣ Try modern Clipboard API
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        setToast("Copié");
        setTimeout(() => setToast(null), 2000);
        return true;
      } catch (error) {
        console.warn("⚠️ Clipboard API failed, falling back...", error);
      }
    }

    // 2️⃣ Fallback for older browsers or non-secure contexts
    const tempInput = document.createElement("input");
    tempInput.value = url;
    tempInput.style.position = "fixed";
    tempInput.style.left = "-9999px";
    tempInput.style.top = "-9999px";
    tempInput.style.opacity = "0";
    document.body.appendChild(tempInput);

    try {
      tempInput.select();
      const success = document.execCommand("copy");
      return !!success;
    } catch (error) {
      console.error("❌ Fallback clipboard copy failed:", error);
      return false;
    } finally {
      // Always cleanup the temporary element
      if (tempInput.parentNode === document.body) {
        document.body.removeChild(tempInput);
      }
    }
  }

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
              <a href={item.url} onClick={(event) => copyLinkToClipboard(event, item.url)}>
                📰
              </a>
            </div>
          ))}
        </div>
        {toast && (
          <div className="toast toast-center">
            <div role="alert" className="alert alert-success alert-soft">
              <span>{toast}</span>
            </div>
          </div>
        )}
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
