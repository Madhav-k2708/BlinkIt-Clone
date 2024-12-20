import React from "react";

const CardLoading = () => {
  return (
    <div className="border p-4 grid gap-3 lg:max-w-full rounded animate-pulse">
      <div className=" min-h-14 lg:min-h-20  bg-slate-200 rounded"></div>
      <div className="p-2 w-20 lg:p-3 bg-slate-200 rounded"></div>
      <div className="p-2 lg:p-3 bg-slate-200 rounded"></div>
      <div className="p-2 w-14 lg:p-3 bg-slate-200 rounded "></div>

      <div className="flex items-center justify-between gap-2">
        <div className="p-2 lg:p-3 bg-slate-200 rounded"></div>
        <div className="p-2 lg:p-3 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
};

export default CardLoading;
