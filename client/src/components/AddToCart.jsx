import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { FaPlus, FaMinus } from "react-icons/fa6";

const AddToCart = ({ data }) => {
  const { fetchCartItem, updateQuantity, deleteCartItem } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const [isAvailableCart, setIsAvailableCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [cartItemDetails, setCartItemDetails] = useState();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.addToCart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (responseData.success) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  // checking this item in cart or not
  useEffect(() => {
    const checkingCartItem = cartItem.some(
      (item) => item.productId._id === data._id
    );
    setIsAvailableCart(checkingCartItem);

    const productQuantity = cartItem.find(
      (item) => item.productId._id === data._id
    );
    setQuantity(productQuantity?.quantity);
    setCartItemDetails(productQuantity);
  }, [data, cartItem]);

  const increaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(cartItemDetails?._id, quantity + 1);
  };

  const decreaseQty = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity === 1) {
      deleteCartItem(cartItemDetails?._id);
    } else {
      updateQuantity(cartItemDetails?._id, quantity - 1);
    }
  };

  return (
    <div className="w-full max-w-[150px]  ">
      {isAvailableCart ? (
        <div className="flex w-full h-full ">
          <button
            onClick={decreaseQty}
            className="bg-green-600 place-items-center hover:bg-green-700 text-white rounded flex-1 w-full p-1"
          >
            <FaMinus />
          </button>
          <p className="text-center font-semibold flex-1 w-full px-1 ">
            {quantity}
          </p>
          <button
            onClick={increaseQty}
            className="bg-green-600 place-items-center hover:bg-green-700 text-white rounded flex-1 w-full p-1"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className=" bg-green-600 hover:bg-green-700 text-white px-2 lg:px-4 py-1 rounded "
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-primary-200 "></div>
          ) : (
            "Add"
          )}
        </button>
      )}
    </div>
  );
};

export default AddToCart;
