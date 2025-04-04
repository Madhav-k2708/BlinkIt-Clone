import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { validURLConverted } from "../utils/validURLConverted";
import AxiosToastError from "../utils/AxiosToastError";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const params = useParams();
  const subCategoryStore = useSelector((state) => state.product.allSubCategory);
  const [displaySubCategory, setDisplaySubCategory] = useState([]);

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  const fetchProductdata = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 10,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  useEffect(() => {
    const sub = subCategoryStore.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id == categoryId;
      });

      return filterData ? filterData : null;
    });
    setDisplaySubCategory(sub);
  }, [params, subCategoryStore]);

  return (
    <section className="sticky top-24 lg:top-20">
      <div className="container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
        {/**sub category **/}
        <div className=" min-h-[88vh] max-h-[88vh] overflow-y-scroll  flex flex-col gap-1 shadow-md customscrollbar bg-white py-2">
          {displaySubCategory.map((s, index) => {
            const link = `/${validURLConverted(s?.category[0]?.name)}-${
              s?.category[0]?._id
            }/${validURLConverted(s.name)}-${s._id}`;

            return (
              <Link
                key={index}
                to={link}
                className={`w-full p-2 lg:flex flex-col items-center lg:w-full lg:h-fit box-border lg:gap-4 border-b 
                hover:bg-green-100 cursor-pointer 
                ${subCategoryId === s._id ? "bg-green-300" : ""}
              `}
              >
                <div
                  className={`flex flex-col items-center text-center gap-8 w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border hover:bg-green-100
                    ${subCategoryId === s._id ? "bg-green-300" : ""}
                    `}
                >
                  <img
                    src={s.image}
                    alt="subCategory"
                    className=" w-10 lg:w-14 lg:h-14 h-full object-scale-down"
                  />
                  <p className="-mt-6 text-center lg:mt-0 text-xs lg:text-base">
                    {s.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/**Product **/}
        <div className="sticky top-20 Productscrollbar">
          <div className="bg-white shadow-md p-4 z-10">
            <h3 className="font-semibold">{subCategoryName}</h3>
          </div>
          <div>
            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto scrollbarhide relative">
              <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4  p-4 gap-4 ">
                {data.map((product, index) => {
                  return (
                    <CardProduct
                      data={product}
                      key={product._id + "productSubCategory" + index}
                    />
                  );
                })}
              </div>
            </div>

            {loading && <Loading />}
          </div>
        </div>
      </div>
    </section>
    // <section className="sticky top-24 lg:top-20  ">
    //   <div className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr] ">
    //     {/* sub category */}
    //     <div className="  min-h-[79vh] max-h-[79vh]  grid gap-1 shadow-md overflow-y-scroll customscrollbar ">
    //       {displaySubCategory.map((s, index) => {
    //         return (
    //           <div key={index} className="w-full p-2 bg-white  ">
    //             <div className="w-fit mx-auto  ">
    //               <img src={s.image} alt="subCategory" className="w-14 h-full object-scale-down" />
    //             </div>
    //             <p className="-mt-6 text-xs lg:text-lg text-center ">{s.name}</p>
    //           </div>
    //         );
    //       })}
    //     </div>

    //     {/* individual product */}

    //     <div>
    //       <div className="bg-white shadow-md p-4 ">
    //         <h2 className="font-semibold  ">{subCategoryName}</h2>
    //       </div>
    //       <div>
    //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols- xl:grid-cols-4 2xl:grid-cols-5 p-4 gap-3 ">
    //           {data.map((product, index) => {
    //             return(
    //               <CardProduct key={index} data={product}  />
    //             )
    //           })}
    //         </div>
    //       </div>

    //       <div className="">{loading && <Loading />}</div>
    //     </div>
    //   </div>
    // </section>
  );
};

export default ProductListPage;
