import React, { useEffect, useState } from "react";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearch } from "react-icons/io5";
import EditProductAdmin from "../components/EditProductAdmin";
import AxiosToastError from "../utils/AxiosToastError";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProduct,
        data: {
          page: page,
          limit: 15,
          search: search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage);
        setProductData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error)
  
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [page]);

  const handleNextPage = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleProductSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    setPage(1);
  };

  useEffect(() => {

    let flag = true;

    const interval = setTimeout(() => {
      if (flag) {
        fetchProductData();
        flag = false;
      }
    }, 300);

    return () => {
      clearTimeout(interval);
    };
  }, [search]);

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4 ">
        <h2 className="text-lg font-semibold ">Product</h2>
        <div className="h-full bg-blue-50  px-4 flex items-center gap-2 py-2 border border-primary-200  rounded focus-within:border-primary-200  ">
          <IoSearch size={25} />
          <input
            type="text"
            value={search}
            onChange={handleProductSearch}
            className="h-full w-full bg-transparent placeholder-slate-500 text-slate-700  outline-none "
            placeholder="Search Product..."
          />
        </div>
      </div>
      {loading && <Loading />}

      <div className="p-4 bg-blue-50  ">
        <div className="min-h-[60vh] ">
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
            {productData.map((product, index) => {
              return <ProductCardAdmin  key={index} data={product} fetchProductData={fetchProductData}  />;
            })}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button
            onClick={handlePreviousPage}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200 "
          >
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/ {totalPageCount}
          </button>
          <button
            onClick={handleNextPage}
            className="border border-primary-200 px-4 py-1 hover:bg-primary-200 "
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
