import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { DisplayRupees } from "../utils/DisplayRupees";
import Divider from "../components/Divider";
import Minute_Delivery from "../assets/minute_delivery.png";
import Best_Prices_Offers from "../assets/Best_Prices_Offers.png";
import Wide_Assortment from "../assets/Wide_Assortment.png";
import { priceWithDiscount } from "../utils/DiscountPrice";
import AxiosToastError from "../utils/AxiosToastError";
import AddToCart from "../components/AddToCart";

const ProductDisplayPage = () => {
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1);
  const [data, setData] = useState({
    name: "",
    image: [],
  });
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: {
          productId: productId,
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
    fetchProductDetails();
  }, [params]);

  const handldImageScrollRight = () => {
    imageContainer.current.scrollleft += 100;
  };
  const handldImageScrollLeft = () => {
    imageContainer.current.scrollRight -= 100;
  };

  return (
    <section className="container mx-auto w-full p-4 flex flex-col lg:grid lg:grid-cols-2  bg-blue-50">
      {/*----Left side---------- */}
      <div className=" ">
        <div className=" p-4 flex items-center ">
          <img
            src={data.image[image]}
            alt="product image"
            className="w-full h-full object-scale-down"
          />
        </div>
        <div className="flex items-center justify-center gap-3 my-5 ">
          {data.image.map((img, index) => {
            return (
              <div
                key={index}
                className={`bg-slate-200 w-3 h-2 md:w-5 md:h-3 lg:w-5 lg:h-5 rounded-full transition-all duration-500 ${
                  index === image && "bg-slate-500"
                } `}
              ></div>
            );
          })}
        </div>

        <div className="grid relative ">
          <div
            ref={imageContainer}
            className="w-full relative z-10 overflow-x-auto scrollbarhide flex gap-4   "
          >
            {data.image.map((img, index) => {
              return (
                <Link
                  className="w-20 h-20 min-w-20 min-h-20  shadow cursor-pointer focus-within:border-4 p-1  rounded-md border-green-500"
                  key={index}
                >
                  <img
                    src={img}
                    onClick={() => setImage(index)}
                    alt="More Images"
                    className="w-full h-full object-scale-down   "
                  />
                </Link>
              );
            })}
          </div>
          <div
            className="w-full absolute -ml-2
           h-full hidden md:flex items-center justify-between "
          >
            <button
              onClick={handldImageScrollRight}
              className="relative z-10 bg-white p-1 rounded-full shadow-lg"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={handldImageScrollLeft}
              className="relative z-10 bg-white p-1 rounded-full shadow-lg"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
        <div></div>
      </div>

      {/* Right side */}
      <div className="p-4 lg:pl-8 text-base lg:text-lg">
        <p className="bg-green-300 rounded-full w-fit px-2  ">10 Min</p>
        <h2 className="text-lg font-semibold lg:text-2xl ">{data.name}</h2>
        <p className="text-lg">{data.unit}</p>
        <Divider />
        <div>
          <p className="">Price</p>
          <div className="flex items-center gap-2">
            <div
              className={`border border-green-600 px-4 py-2 rounded bg-green-50 w-fit ${
                data.stock === 0 ? "opacity-50 border-red-500" : ""
              }`}
            >
              <p className={`font-semibold text-lg lg:text-xl  `}>
                {DisplayRupees(priceWithDiscount(data.price, data.discount))}
              </p>
            </div>
            {data.discount > 0 && (
              <p className="md:text-lg text-base line-through  ">
                {DisplayRupees(data.price)}{" "}
              </p>
            )}
            {data.discount > 0 && (
              <p className="lg:text-[15px] text-base font-bold text-green-600 ">
                ({data.discount}%{" "}
                <span className="text-base font-normal text-slate-800 ">
                  off
                </span>
                )
              </p>
            )}
          </div>
        </div>
        {data.stock === 0 ? (
          <p className="my-4 px-4 text-center py-1 w-full bg-red-500 rounded-full text-white ">
            Out of Stock
          </p>
        ) : (
          // <button className="my-4 px-4 py-1 w-full bg-green-600 hover:bg-green-700 rounded-full text-white ">
          //   Add to Cart
          // </button>
          <div className="my-5 ">
            <AddToCart data={data} />
          </div>
        )}

        <h2 className="font-semibold ">Why shop from binkeyit?</h2>
        <div>
          <div
            className="flex flex-col sm:flex-row flex-1 items-center sm:items-start gap-3 my-4
           "
          >
            <img
              src={Minute_Delivery}
              alt="superfast delivery"
              className="w-20 h-20  "
            />
            <div className="text-sm ">
              <div className="font-semibold ">Superfast Delivery</div>
              <p>
                Get your order delivery to your doorstep at the earliest from
                dark stores near you.{" "}
              </p>
            </div>
          </div>

          <div>
            <div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 my-4
           "
            >
              <img
                src={Best_Prices_Offers}
                alt="Best Price Offers"
                className="w-20 h-20 "
              />
              <div className="text-sm ">
                <div className="font-semibold ">Best Prices & Offers</div>
                <p>
                  Best price destination with offers directly from the
                  manufactures.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 my-4"
            >
              <img
                src={Wide_Assortment}
                alt="Wide Assortment"
                className="w-20 h-20 "
              />
              <div className="text-sm flex flex-col gap-1 ">
                <div className="font-semibold ">Wide Assortment</div>
                <p>
                  Choose from 5000+ products across foor personal cate.
                  household & other categories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* left side */}
      <div className="my-4 flex flex-col gap-4 md:w-full min-w-32 lg:w-full lg:max-w-full">
        <div className=" flex flex-col gap-1 overflow-x-hidden text-wrap break-words  ">
          <p className="font-semibold">Description</p>
          <p className="text-base  overflow-x-hidden text-wrap break-words ">{data.description}</p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold">Unit</p>
          <p className="text-base">{data.unit}</p>
        </div>

        {data?.more_details &&
          Object.keys(data?.more_details).map((el, index) => {
            return (
              <div key={index} className="flex flex-col gap-1 overflow-auto text-wrap break-words ">
                <p className="font-semibold">{el}</p>
                <p className="text-base ">{data?.more_details[el]}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default ProductDisplayPage;
