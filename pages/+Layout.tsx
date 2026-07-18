import "./Layout.css";
import "./tailwind.css";
import { useQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-col max-w-5xl m-auto"}>
      <Menu />
      <div className="flex flex-row">
        <Sidebar />
        <Content>{children}</Content>
      </div>
    </div>
  );
}

function Sidebar() {
  const { data }: { data: any } = useQuery(gql`
    {
      mariageSections(pagination: { limit: 100 }, sort: ["order:asc"]) {
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
    }
  `);

  let sections = [];

  if (data) {
    sections = data.mariageSections.filter((section) => section.mariage_section == null);
  }

  let activeSection = -1;

  if (typeof window != "undefined") {
    sections.forEach((section, i) => {
      if (window.location.href.match(`/section/${section.slug}`)) {
        activeSection = i;
      }
    });
  }

  return (
    <div id="sidebar" className={"hidden md:block p-5 basis-1/4 shrink-0 border-r-2 border-r-gray-200"}>
      <ul className="steps steps-vertical">
        {sections.map((section, i) => (
          <li
            key={`sidebar-${i}`}
            data-section={i}
            data-active-section={activeSection}
            className={`step ${i <= activeSection && "step-primary"}`}
          >
            <a href={`/section/${section.slug}/`}>{section.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Menu = () => {
  const { data }: { data: any } = useQuery(gql`
    {
      mariageSections(pagination: { limit: 100 }, sort: ["order:asc"]) {
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
      }
    }
  `);

  let rootSections = [];

  if (data) {
    rootSections = data.mariageSections.filter((section: any) => section.mariage_section == null);
  }

  const findSubSections = (slug: string) =>
    data.mariageSections.filter((section: any) => section.mariage_section?.slug == slug);

  return (
    <section id="navbar" className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
            {rootSections.map((section) => (
              <li key={`menu-${section.slug}`}>
                <a href={`/section/${section.slug}/`}>
                  <strong>{section.name}</strong>
                </a>
                <ul className="menu w-full">
                  {findSubSections(section.slug).map((sub) => (
                    <li key={`menu-${section.slug}-${sub.slug}`}>
                      <a href={`/section/${section.slug}_${sub.slug}`}>{sub.name}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <a href={`/section/trie/`}>
                <strong>A trier</strong>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <div
          className="megamenu max-sm:megamenu-vertical p-2 border border-base-300 megamenu-full"
          id="my-megamenu-1"
          popover
        >
          <span className="megamenu-active"></span>

          <a className="btn btn-light" href="/search/">
            Rechercher
          </a>
        </div>
      </div>
      <div className="navbar-end">
        <label className="flex cursor-pointer gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <input type="checkbox" value="dracula" className="toggle theme-controller" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>
      </div>
    </section>
  );
};

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container" className="md:basis-3/4">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
