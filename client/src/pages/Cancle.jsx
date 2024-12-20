import React from "react";
import { Link } from "react-router-dom";

const Cancle = () => {
  return (
    <div className="m-2 w-full max-w-xs lg:max-w-md bg-red-200 p-4 py-5 rounded mx-auto flex flex-col items-center justify-center gap-5">
      <p className="text-red-900 text-lg font-bold text-center">
        Order Cancelled
      </p>
      <Link
        to={"/"}
        className="border border-red-900 hover:bg-red-900 hover:text-white  text-red-900 px-4 py-1 text-center transition-all duration-300 "
      >
        Go To Home
      </Link>
    </div>
  );
};

export default Cancle;
