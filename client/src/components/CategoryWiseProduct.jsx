import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useSelector } from "react-redux";
import { validURLConverted } from "../utils/validURLConverted";
import AxiosToastError from "../utils/AxiosToastError";

const CategoryWiseProduct = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const handleScrollRight = () => {
    containerRef.current.scrollLeft += 200;
  };
  const handleScrollLeft = () => {
    containerRef.current.scrollLeft -= 200;
  };

  const handleRedirectProductListPage = () => {
    const subCategory = subCategoryData?.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c?._id == id;
      });

      return filterData ? true : null;
    });

    const url = `/${validURLConverted(name)}-${id}/${validURLConverted(
      subCategory?.name
    )}-${validURLConverted(subCategory?._id)}`;

    return url;
  };

  const redirectURL = handleRedirectProductListPage();

  const loadingCard = new Array(6).fill(null);

  return (
    <div className=" ">
      <div className="container mx-auto p-4 flex items-center justify-between gap-4">
        <h3 className="font-semibold ms:text-base sm:text-lg md:text-xl  ">
          {name}
        </h3>
        <Link
          to={redirectURL}
          className="text-green-700 hover:text-secondary-200 "
        >
          See All
        </Link>
      </div>

      <div className="relative flex items-center ">
        <div
          ref={containerRef}
          className="container mx-auto px-4 flex  gap-4 md:gap-6 lg:gap-8 scroll-smooth overflow-x-scroll scrollbarhide"
        >
          {loading &&
            loadingCard.map((_, index) => {
              return <CardLoading key={index} />;
            })}

          {data.map((product, index) => {
            return <CardProduct key={product._id + index} data={product} />;
          })}
        </div>
        <div className="w-full left-0 right-0 container mx-auto  shadow-black  px-2 absolute hidden lg:flex justify-between  ">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative text-lg bg-white hover:bg-gray-200 shadow-lg shadow-slate-300  p-2 rounded-full "
          >
            <MdArrowBackIosNew />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative text-lg bg-white hover:bg-gray-200 shadow-lg shadow-slate-300 p-2 rounded-full  "
          >
            <MdArrowForwardIos />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProduct;
