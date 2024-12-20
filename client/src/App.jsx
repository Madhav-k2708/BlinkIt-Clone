import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import toast, { Toaster } from "react-hot-toast";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useDispatch } from "react-redux";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import Axios from "./utils/Axios";
import summaryApi from "./common/summaryApi";
import AxiosToastError from "./utils/AxiosToastError";
import { handleAddItemCart } from "./store/cartProduct";
import GlobalProvider from "./provider/GlobalProvider";
import CartMobile from "./components/CartMobile";

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    dispatch(setUserDetails(userData.data));
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...summaryApi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data));
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <Header />
      <main className="min-h-[82vh] ">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      {location.pathname !== "/checkout" && <CartMobile />}
    </GlobalProvider>
  );
};

export default App;
