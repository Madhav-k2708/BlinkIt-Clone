import { createContext, useContext, useEffect, useState } from "react";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import { handleAddItemCart } from "../store/cartProduct";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/DiscountPrice";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [withoutDiscountTotalPrice, setWithoutDiscountTotalPrice] = useState(0);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  const fetchCartItem = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getCart,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const updateQuantity = async (id, qty) => {
    try {
      const response = await Axios({
        ...summaryApi.updateCartItem,
        data: {
          _id: id,
          quantity: qty,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        // toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...summaryApi.deleteCartItem,
        data: {
          _id: cartId,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getAddress,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const fetchOrder = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getOrderItems,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  //  total items and total price of cart
  useEffect(() => {
    const totalQty = cartItem.reduce((prev, current) => {
      return prev + current.quantity;
    }, 0);
    setTotalQty(totalQty);

    const totalPrice = cartItem.reduce((prev, current) => {
      const priceAfterDiscount = priceWithDiscount(
        current?.productId?.price,
        current?.productId?.discount
      );
      return prev + priceAfterDiscount * current.quantity;
    }, 0);
    setTotalPrice(totalPrice);

    const WithoutDiscountPrice = cartItem.reduce((prev, current) => {
      return prev + current?.productId?.price * current.quantity;
    }, 0);
    setWithoutDiscountTotalPrice(WithoutDiscountPrice);
  }, [cartItem]);

  const handleLogout = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  useEffect(() => {
    fetchCartItem();
    handleLogout();
    fetchAddress();
    fetchOrder()
  }, [user]);

  const value = {
    fetchCartItem,
    updateQuantity,
    deleteCartItem,
    fetchAddress,
    fetchOrder,
    totalPrice,
    totalQty,
    withoutDiscountTotalPrice,
    setWithoutDiscountTotalPrice,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
