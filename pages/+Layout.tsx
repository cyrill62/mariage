import "./Layout.css";
import "./tailwind.css";
import { Link } from "../components/Link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex max-w-5xl m-auto"}>
      <Menu />
      <Sidebar />
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar() {
  return (
    <div id="sidebar" className={"p-5 flex flex-col shrink-0 border-r-2 border-r-gray-200"}>
      <ul className="steps steps-vertical">
        <li className="step step-primary">Mairie</li>
        <li className="step step-primary">Vin d'honneur</li>
        <li className="step">Repas</li>
      </ul>
    </div>
  );
}

const Menu = () => {
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
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
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Homepage</a>
              </li>
              <li>
                <a>Portfolio</a>
              </li>
              <li>
                <a>About</a>
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

            <button popoverTarget="a1">Mairie</button>
            <div id="a1" popover>
              <div className="flex max-sm:flex-col items-start">
                <ul className="menu w-full">
                  <li>
                    <a>Scéance photos</a>
                  </li>
                  <li>
                    <a>Arrivée des invités</a>
                  </li>
                  <li>
                    <a>Cérémonie</a>
                  </li>
                  <li>
                    <a>Sortie</a>
                  </li>
                </ul>
              </div>
            </div>

            <button popoverTarget="a2">Vin d'honneur</button>
            <div id="a2" popover>
              <div className="flex max-sm:flex-col items-start">
                <ul className="menu">
                  <li>
                    <a>Entrée des mariés</a>
                  </li>
                  <li>
                    <a>Buffet</a>
                  </li>
                </ul>
              </div>
            </div>

            <button popoverTarget="a3">Repas</button>
            <div id="a3" popover>
              <div className="flex max-sm:flex-col items-start">
                <ul className="menu">
                  <li>
                    <a>Les plats</a>
                  </li>
                  <li>
                    <a>Danse des mariés</a>
                  </li>
                  <li>
                    <a>Gâteaux</a>
                  </li>
                  <li>
                    <a>Le lendemain</a>
                  </li>
                </ul>
              </div>
            </div>
            <a className="btn btn-light" href="#">
              Rechercher
            </a>
          </div>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
