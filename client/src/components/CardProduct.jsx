import React, { useState } from "react";
import { DisplayRupees } from "../utils/DisplayRupees";
import { Link } from "react-router-dom";
import { validURLConverted } from "../utils/validURLConverted";
import { priceWithDiscount } from "../utils/DiscountPrice";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddToCart from "./AddToCart";

const CardProduct = ({ data }) => {

  const [loading, setLoading] = useState(false);

  const url = `/product/${validURLConverted(data.name)}-${data._id}`;

  return (
    <Link
      to={url}
      className={`border py-2 lg:p-4 grid gap-1 lg:gap-3 w-full min-w-[137px] lg:min-w-52 rounded cursor-pointer bg-white `}
    >
      <div className="min-h-20 mt-1 w-full max-h-24 lg:max-h-36 rounded overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-scale-down lg:scale-125 "
        />
      </div>
      <div className="ml-2 rounded w-fit mt-1 p-[1px] px-2 text-xs text-green-700 bg-green-100">
        10 min
      </div>
      <div className="px-2 lg:px-0 lg:h-12 font-medium text-ellipsis text-sm lg:text-base line-clamp-2">
        {data.name}
      </div>
      <div className="w-fit px-2 lg:px-0 text-sm lg:text-base ">
        {data.unit}
      </div>

      <div className="py-1 px-2 lg:py-0 lg:px-0 flex items-center justify-between gap-2 lg:gap-3 text-sm lg:text-base">
        {data.stock == 0 ? (
          <div className=" border border-red-400 opacity-70 px-2 py-1 rounded font-semibold ">
            {DisplayRupees(priceWithDiscount(data.price, data.discount))}
          </div>
        ) : (
          <div className=" font-semibold ">
            {DisplayRupees(priceWithDiscount(data.price, data.discount))}
          </div>
        )}
        <div className="">
          {data.stock == 0 ? (
            <p className="text-red-600 text-center font-medium text-wrap px-2 lg:px-4 py-1 rounded ">
              Temporarily out of stock
            </p>
          ) : (
            <AddToCart data={data} />
          )}
        </div>
      </div>
      <div className=" px-2 lg:px-0 flex flex-col justify-end">
        {data.discount && (
          <p className="text-sm font-normal">
            M.R.P:
            <span className="line-through pl-0.5">
              {DisplayRupees(data.price)}
            </span>
          </p>
        )}
        {data.discount > 0 && (
          <p className="text-sm text-secondary-200 w-fit ">
            ({data.discount}% off)
          </p>
        )}
      </div>
    </Link>
  );
};

export default CardProduct;
