import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  {
    id: 1,
    name: "Books",
    href: "/books-list",
  },
];

function BurgerMenu() {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="relative">
      <button onClick={handleToggleMenu} className="flex flex-col ">
        <span
          className={`w-6 h-[.3rem] bg-cyan-500 mb-1 transition-all duration-300 ease-in-out ${
            showMenu ? "translate-y-[.7rem] rotate-45 bg-red-800" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-[.3rem] bg-cyan-500 mb-1 transition-all duration-300 ease-in-out ${
            showMenu ? "opacity-0 bg-red-800" : ""
          }`}
        ></span>
        <span
          className={`w-6 h-[.3rem] bg-cyan-500 transition-all duration-300 ease-in-out ${
            showMenu ? "-translate-y-[.4rem] -rotate-45 bg-red-800" : ""
          }`}
        ></span>
      </button>

      {showMenu ? (
        <ul className="absolute top-10 right-0 bg-cyan-600 text-cyan-500">
          {links.map((link) => (
            <li
              className="underline-offset-4 underline hover:text-amber-400 transition duration-300 ease-in-out font-semibold"
              key={link.id}
            >
              <Link to={link.href}>{link.name}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default BurgerMenu;
