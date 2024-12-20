import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CardLoading from "../components/CardLoading";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import CardProduct from "../components/CardProduct";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import noDataImage from "../assets/nothing here yet.webp";
import AxiosToastError from "../utils/AxiosToastError";

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadingArrayCard = new Array(10).fill(null);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const params = useLocation();
  const searchText = params?.search?.slice(3);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData((prev) => {
            return [...prev, ...responseData.data];
          });
        }
        setTotalPage(responseData.totalPage);
        
      }
    } catch (error) {
      AxiosToastError(error)

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, searchText]);



  const handleFetchMore = () => {
    if (totalPage > page) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto p-4">
        <p className="font-semibol ">Search Results: {data.length} </p>

        <InfiniteScroll
          dataLength={data.length}
          hasMore={true}
          next={handleFetchMore}
        >
          <div className=" grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
            {data.map((products, index) => {
              return <CardProduct data={products} key={products._id + index} />;
            })}

            {/* loading data */}
            {loading &&
              loadingArrayCard.map((_, index) => {
                return <CardLoading key={index} />;
              })}
          </div>
        </InfiniteScroll>
        {
          // no data
          !data[0] && !loading && (
            <div className="w-full h-full rounded-lg  flex flex-col justify-around items-center">
              <img
                src={noDataImage}
                alt="No Data Imag"
                className="w-full h-full max-w-xs max-h-xs block "
              />
              <p className="text-lg my-10  font-serif font-semibold ">
                <span>Oops! </span>
                No Data found
              </p>
            </div>
          )
        }
      </div>
    </section>
  );
};

export default SearchPage;
