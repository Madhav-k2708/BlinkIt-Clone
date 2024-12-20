import React from "react";
import { Link, useLocation } from "react-router-dom";

const Success = () => {
  const location = useLocation();

  return (
    <div className="m-2 w-full max-w-xs lg:max-w-md bg-green-200 p-4 py-5 rounded mx-auto flex flex-col items-center justify-center gap-5">
      <p className="text-green-800 font-bold text-lg text-center ">
        {Boolean(location?.state?.text) ? location?.state?.text : "Payment"}{" "}
        Successfully
      </p>
      <Link to={"/"} className="border border-green-900 hover:bg-green-900 hover:text-white  text-green-900 px-4 py-1 text-center transition-all duration-300 ">Go To Home</Link>
    </div>
  );
};

export default Success;