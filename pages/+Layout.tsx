import "./Layout.css";
import "./tailwind.css";
import { Link } from "../components/Link";

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
  return (
    <div id="sidebar" className={"p-5 basis-1/4 shrink-0 border-r-2 border-r-gray-200"}>
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
            <li>
              <a>Mairie</a>
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
            </li>

            <li>
              <a>Vin d'honneur</a>
              <ul className="menu">
                <li>
                  <a>Entrée des mariés</a>
                </li>
                <li>
                  <a>Buffet</a>
                </li>
              </ul>
            </li>

            <li>
              <a>Repas</a>
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

          <a className="btn btn-light" href="#">
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
          <input type="checkbox" value="synthwave" className="toggle theme-controller" />
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
    <div id="page-container" className="basis-3/4">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
