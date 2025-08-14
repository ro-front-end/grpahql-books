import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="p-4 bg-[#f6f6f6] min-h-[94vh] flex items-center justify-center">
      <Link
        className="bg-amber-300 p-4 font-semibold mt-12 rounded-xl"
        to="/books-list"
      >
        Explore Books
      </Link>
    </div>
  );
}

export default Hero;
