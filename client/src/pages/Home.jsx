import React from "react";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { useSelector } from "react-redux";
import { validURLConverted } from "../utils/validURLConverted";
import { Link, useNavigate } from "react-router-dom";
import CategoryWiseProduct from "../components/CategoryWiseProduct";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListPage = (id, category) => {
    const subCategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id == id;
      });

      return filterData ? true : null;
    });

    const url = `/${validURLConverted(category)}-${id}/${validURLConverted(
      subCategory.name
    )}-${validURLConverted(subCategory?._id)}`;

    navigate(url);
  };

  return (
    <section className="bg-white ">
      <div className=" container mx-auto ">
        <div
          className={`w-full h-full min-h-48 bg-blue-50 rounded ${
            !banner && "animate-ping my-2"
          } `}
        >
          <img
            src={banner}
            alt="banner"
            className="w-full h-full hidden lg:block "
          />
          <img
            src={bannerMobile}
            alt="banner"
            className="w-full h-full lg:hidden "
          />
        </div>
      </div>

      <div className="container mx-auto px-4 my-2 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-2 ">
        {loadingCategory
          ? new Array(12).fill(null).map((category, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse "
                >
                  <div className="bg-blue-100 min-h-24 rounded "></div>
                  <div className="bg-blue-100 h-8 rounded"></div>
                </div>
              );
            })
          : categoryData.map((category, index) => {
              return (
                <div
                  className="w-full h-full "
                  key={index}
                  onClick={() =>
                    handleRedirectProductListPage(category._id, category.name)
                  }
                >
                  <div>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-scale-down"
                    />
                  </div>
                </div>
              );
            })}
      </div>

      {/*  Display category product */}
      {categoryData.map((category, index) => {
        return (
          <CategoryWiseProduct
            key={index}
            id={category?._id}
            name={category?.name}
          />
        );
      })}
    </section>
  );
};

export default Home;
