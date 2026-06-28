import "./Layout.css";
import "./tailwind.css";
import logoUrl from "../assets/logo.svg";
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
    <>
      <button className="btn sm:hidden" popoverTarget="my-megamenu-1">Menu</button>

      <div className="megamenu max-sm:megamenu-vertical p-2 border border-base-300" id="my-megamenu-1" popover>
        <span className="megamenu-active"></span>

        <button popoverTarget="a1">Services</button>
        <div id="a1" popover>
          <ul className="menu">
            <li><a>Enterprise</a></li>
            <li><a>CRM software</a></li>
            <li><a>Security</a></li>
            <li><a>Consulting</a></li>
          </ul>
        </div>

        <button popoverTarget="a2">AI</button>
        <div id="a2" popover>
          <ul className="menu">
            <li><a>AI infrastructure</a></li>
            <li><a>Image generation</a></li>
            <li><a>MCP servers</a></li>
          </ul>
        </div>

        <button popoverTarget="a3">Cloud Solutions</button>
        <div id="a3" popover>
          <ul className="menu">
            <li><a>Cloud computing</a></li>
            <li><a>Storage solutions</a></li>
            <li><a>Database services</a></li>
            <li><a>CDN performance</a></li>
          </ul>
        </div>
      </div>
    </>
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
