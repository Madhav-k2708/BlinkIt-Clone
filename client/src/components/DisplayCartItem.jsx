import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayRupees } from "../utils/DisplayRupees";
import { FaCaretRight } from "react-icons/fa6";
import { priceWithDiscount } from "../utils/DiscountPrice";
import { useSelector } from "react-redux";
import AddToCart from "./AddToCart";
import emptyCartImage from "../assets/empty_cart.webp";
import toast from "react-hot-toast";

const DisplayCartItem = ({ close }) => {
  const { withoutDiscountTotalPrice, totalPrice, totalQty } =
    useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()

  const redirectToCheckOutPage = () => {
    if (user?._id) {
            navigate("/checkout")
            if (close) {
              close()
            }
            return
    }
    toast("Please Login")
  }
  return (
    <section className="bg-neutral-900 fixed inset-0 bg-opacity-70 z-50  ">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto ">
        <div className="flex items-center justify-between p-4 gap-3 shadow-md">
          <h2 className="font-semibold ">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoMdCloseCircle size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block ">
            <IoMdCloseCircle size={25} />
          </button>
        </div>
        <div className="h-full min-h-[80vh] lg:min-h-[83vh] max-h-[calc(100vh-120px)] bg-blue-50 p-2 flex flex-col gap-4">
          {/**** display cart items ****/}
          {cartItem[0] ? (
            <>
              <div className="flex items-center justify-between gap-1 p-2 bg-blue-100 text-blue-500 rounded-full px-4 py-2 ">
                <p>Your total saving</p>
                <p className="">
                  {DisplayRupees(withoutDiscountTotalPrice - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {cartItem[0] &&
                  cartItem.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center w-full gap-4"
                      >
                        <div className="w-16 h-16 min-h-16 min-w-16 bg-red-400 border rounded">
                          <img
                            src={item?.productId?.image[0]}
                            alt="cart item"
                            className="object-scale-down
                                    "
                          />
                        </div>
                        <div className="w-full max-w-sm text-xs ">
                          <p className="text-xs text-ellispsis line-clamp-2 ">
                            {item?.productId?.name}
                          </p>
                          <p className="text-neutral-500">
                            {item?.productId?.unit}
                          </p>
                          <p className=" font-semibold">
                            {DisplayRupees(
                              priceWithDiscount(
                                item?.productId?.price,
                                item?.productId?.discount
                              )
                            )}
                          </p>
                        </div>
                        <div className="">
                          <AddToCart data={item?.productId} />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="p-4 bg-white">
                {/* Bill details */}
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Total Price</p>
                  <p className="flex items-center gap-2 lg:gap-5">
                    <span className="line-through font-light text-neutral-500">
                      ( {DisplayRupees(withoutDiscountTotalPrice)})
                    </span>
                    <span className="">{DisplayRupees(totalPrice)}</span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Total Quantity</p>
                  <p className="">{totalQty} Items</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Delivery Charge </p>
                  <p className="">Free </p>
                </div>
                <div className="flex gap-4 justify-between ml-1 font-semibold">
                  <p>Grand Total </p>
                  <p className="text-slate-800 font-medium">
                    {DisplayRupees(totalPrice)}{" "}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col items-center justify-center gap-3">
              <img
                src={emptyCartImage}
                alt=""
                className="w-full h-full object-scale-down"
              />
              <p className="text-center font-medium text-xl ">Cart is Empty</p>
              <Link
                onClick={close}
                to={"/"}
                className="border border-secondary-200 px-4 py-2 rounded bg-green-600 hover:border-green-400 font-semibold text-white "
              >
                Shop Now
              </Link>
            </div>
          )}
        </div>

        {cartItem[0] && (
          <div className="p-1">
            <div className="bg-green-700 text-neutral-100 px-2 py-4 font-bold text-base sticky bottom-3 rounded flex items-center gap-4 justify-between ">
              <div>{DisplayRupees(totalPrice)}</div>

              <button onClick={redirectToCheckOutPage} className="flex items-center gap-2">
                Proceed
                <span>
                  <FaCaretRight />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DisplayCartItem;
