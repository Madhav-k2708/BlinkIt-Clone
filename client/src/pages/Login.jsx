import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import { useGlobalContext } from "../provider/GlobalProvider";

const Login = () => {
  const {fetchCartItem} = useGlobalContext()
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validData = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...summaryApi.login,
        data: data,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        if (fetchCartItem) {
          fetchCartItem()          
        }

        const userDetails = await fetchUserDetails()

        dispatch(setUserDetails(userDetails.data));
        setData({
          email: "",
          password: "",
        });
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
     
      toast.error(error.message);
    }
  };

  return (
    <section className="w-full container mx-auto mt-10 px-2 ">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-10 ">
        <p className="text-sm sm:text-xl text-center text-secondary-200 border-b-2 border-secondary-200 ms:text-sm ">
          Blinkit for all your shopping.
        </p>

        <form onSubmit={handleSubmit} className="sm:flex sm:flex-col mt-6 ">
          <div className="flex flex-col gap-2 w-full ">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              autoFocus
              className="bg-blue-50 p-2 border-2 rounded outline-none focus:border-primary-200 "
              name="email"
              value={data.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1 ">
            <label htmlFor="password">password :</label>
            <div className="bg-blue-50 p-2 border-2 rounded flex items-center focus-within:border-primary-200 ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none bg-transparent "
                name="password"
                value={data.password}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="text-xs sm:text-lg block ml-auto hover:text-secondary-200  "
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 w-full hover:bg-green-700  text-white py-2 rounded-sm font-semibold my-4"
                : "bg-black w-full text-white py-2 rounded-md font-semibold my-4 "
            }`}
          >
            Login
          </button>
        </form>

       <div className="flex justify-between">
       <Link to={"/register"} className="text-xs sm:text-lg flex gap-1">
          Don't have an account?{" "}
          
        </Link>
        <Link
            to={"/register"}
            className="text-xs sm:text-lg font-semibold text-green-700 hover:text-secondary-200"
          >
            Sign Up
          </Link>
       </div>
      </div>
    </section>
  );
};

export default Login;
