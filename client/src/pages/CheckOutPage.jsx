import React, { useState } from "react";
import { DisplayRupees } from "../utils/DisplayRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import AddAddress from "../components/AddAddress";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const CheckOutPage = () => {
  const {
    withoutDiscountTotalPrice,
    totalPrice,
    totalQty,
    fetchCartItem,
    fetchOrder,
  } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector((state) => state.addresses.addressList);
  const cart = useSelector((state) => state.cartItem.cart);
  const [selectAddress, setSelectedAddress] = useState(false);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...summaryApi.CashOnDelivery,
        data: {
          list_items: cart,
          addressId: addressList[selectAddress]?._id,
          totalAmt: totalPrice,
          subTotalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
        if (fetchOrder) {
          fetchOrder();
        }
        navigate("/success", {
          state: {
            text: "Order",
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Loading...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);

      const response = await Axios({
        ...summaryApi.stripePayment,
        data: {
          list_items: cart,
          addressId: addressList[selectAddress]?._id,
          totalAmt: totalPrice,
          subTotalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });

      if (fetchCartItem) {
        fetchCartItem();
      }
      
      if (fetchOrder) {
        fetchOrder();
      }
    } catch (error) {
      AxiosToastError(error);
 
    }
  };

  return (
    <section className="bg-blue-50 ">
      <div className="container mx-auto p-4 flex gap-6 flex-col lg:flex-row justify-between ">
        <div className="w-full cursor-pointer ">
          {/* address part */}
          <h3 className="text-lg font-semibold ">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4 ">
            {addressList.map((address, index) => {
              return (
                <label
                  htmlFor={"address" + index}
                  key={address._id + index}
                  className={!address.status ? "hidden" : ""}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        name="address"
                        value={index}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <p>{address.name}</p>
                      <p>{address.address_line}</p>
                      <p>
                        {address.city} - {address.pincode}
                      </p>
                      <p>{address.state}</p>
                      <p>{address.country}</p>

                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed border-primary-200 flex justify-center items-center "
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white px-2 py-4 rounded cursor-pointer ">
          {/* payment and order summary */}
          <h3 className="text-lg font-semibold">Summary</h3>
          <div className="p-4 bg-white">
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
          <div className="w-full max-w-sm flex flex-col gap-4">
            <button
              onClick={handleOnlinePayment}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
            >
              Online Payment
            </button>
            <button
              onClick={handleCashOnDelivery}
              className="py-2 px-4 border-2 border-secondary-200 hover:bg-green-600 hover:text-white text-secondary-200 font-semibold rounded"
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckOutPage;
