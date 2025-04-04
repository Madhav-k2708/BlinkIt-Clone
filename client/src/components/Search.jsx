import React, { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { IoMdArrowRoundBack } from "react-icons/io";
import useMobile from "../HOOKS/useMobile";

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [isMobile] = useMobile();
  const params = useLocation()
  const searchText = params.search.slice(3) 

  useEffect(() => {
    const isSearch = location.pathname === "/search";
    setIsSearchPage(isSearch);
  }, [location]);

  const redirectToSearchPage = () => {
    navigate("/search");
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    const url = `/search?q=${value}`;
    navigate(url);
  };

  return (
    <div className="w-full lg:min-w-[420px] h-10 lg:h-12 rounded-lg border overflow-hidden flex items-center text-neutral-500 bg-slate-50 group focus-within:border-primary-200 ">
      <div>
        {isMobile && isSearchPage ? (
          <Link
            to={"/"}
            className="flex justify-center items-center h-full p-1  m-2 group-focus-within:text-primary-200 bg-white rounded-full shadow-md"
          >
            <IoMdArrowRoundBack size={22} />
          </Link>
        ) : (
          <button className="flex justify-center items-center h-full p-3 group-focus-within:text-primary-200">
            <RiSearchLine size={22} />
          </button>
        )}
      </div>
      <div className="w-full h-full">
        {!isSearchPage ? (
          <div
            onClick={redirectToSearchPage}
            className="h-full flex items-center"
          >
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Search "milk"',
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                'Search "bread"',
                1000,
                'Search "sugar"',
                1000,
                'Search "panner"',
                1000,
                'Search "chocolate"',
                1000,
                'Search "curd"',
                1000,
                'Search "egg"',
                1000,
                'Search "chips"',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: "16px", display: "inline-block" }}
              repeat={Infinity}
            />
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="text"
              className="bg-transparent outline-none w-full h-full px-3"
              autoFocus
              defaultValue={searchText}
              placeholder="Search for atta dal and more."
              onChange={handleSearch}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
