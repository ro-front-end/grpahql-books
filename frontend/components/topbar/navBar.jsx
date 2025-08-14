import BurgerMenu from "./burgerMenu";

function NavBar() {
  return (
    <nav className="flex justify-between items-center border-b-[.14rem] pb-4 border-amber-200/60">
      <h2>Books</h2>
      <BurgerMenu />
    </nav>
  );
}

export default NavBar;
