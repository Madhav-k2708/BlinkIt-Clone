import React from "react";
import { BiSolidCartAdd } from "react-icons/bi";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayRupees } from "../utils/DisplayRupees";
import { Link } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const CartMobile = () => {
  const { totalPrice, totalQty } = useGlobalContext();
  const cartItem = useSelector((state) => state.cartItem.cart);

  return (
    <>
      {cartItem[0] && (
        <div className="lg:hidden sticky bottom-4 p-2  ">
          <div className=" bg-green-600 px-2 py-1 flex items-center justify-between gap-3 rounded text-sm text-neutral-100 ">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-500 rounded w-fit ">
                <BiSolidCartAdd />
              </div>
              <div className="text-sm  font-medium ">
                <p>{totalQty} items</p>
                <p>{DisplayRupees(totalPrice)}</p>
              </div>
            </div>

            <Link to={"/cart"} className="flex items-center gap-1 font-medium ">
              <span className="text-sm ">View Cart</span>
              <FaAngleRight size={15} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobile;
