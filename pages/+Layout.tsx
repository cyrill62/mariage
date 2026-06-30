import "./Layout.css";
import "./tailwind.css";
import { Link } from "../components/Link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex max-w-5xl m-auto"}>
      <Menu />
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div id="sidebar" className={"p-5 flex flex-col shrink-0 border-r-2 border-r-gray-200"}>
      {children}
    </div>
  );
}

const Menu = () => {
  return (
    <div>
      <button className="btn sm:hidden" popoverTarget="my-megamenu-1">Menu</button>

      <div className="megamenu max-sm:megamenu-vertical p-2 border border-base-300" id="my-megamenu-1" popover>
        <span className="megamenu-active"></span>

        <button popoverTarget="a1">Mairie</button>
        <div id="a1" popover>
          <ul className="menu">
            <li><a>Scéance photos</a></li>
            <li><a>Arrivée des invités</a></li>
            <li><a>Cérémonie</a></li>
            <li><a>Sortie</a></li>
          </ul>
        </div>

        <button popoverTarget="a2">Vin d'honneur</button>
        <div id="a2" popover>
          <ul className="menu">
            <li><a>Entrée des mariés</a></li>
            <li><a>Buffet</a></li>
          </ul>
        </div>

        <button popoverTarget="a3">Repas</button>
        <div id="a3" popover>
          <ul className="menu">
            <li><a>Les plats</a></li>
            <li><a>Danse des mariés</a></li>
            <li><a>Gâteaux</a></li>
            <li><a>Le lendemain</a></li>
          </ul>
        </div>
        <button href="#">Rechercher</button>
      </div>
    </div>
  ) 
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div id="page-content" className={"p-5 pb-12 min-h-screen"}>
        {children}
      </div>
    </div>
  );
}
