import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="h-[70vh] flex items-center justify-center flex-col gap-2">
      <Link
        className="px-3 py-2 bg-[#003893] rounded-md shadow-xl cursor-pointer hover:bg-[#0245b0] transition-colors duration-300 ease-in text-xl text-white"
        to={"/register"}
      >
        Register Company
      </Link>

      <Link
        className="px-3 py-2 bg-[#B22222] rounded-md shadow-xl cursor-pointer hover:bg-[#861a1a] transition-colors duration-300 ease-in text-xl text-white"
        to={"/companies"}
      >
        View Companies
      </Link>
    </section>
  );
};

export default Home;
