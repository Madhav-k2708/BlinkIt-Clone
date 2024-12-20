import React, { useState } from "react";
import toast from "react-hot-toast";;
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { Link, useNavigate } from "react-router-dom";
import circle from "../assets/circle.png";
import AxiosToastError from "../utils/AxiosToastError";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();

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
        ...summaryApi.forgot_password,
        data: data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/otp-verification", {
            state : data
        })
        setData({
          email: "",
        });
        ;
      } else {
        toast.error(response.data.message);
      }

   
    } catch (error) {
      AxiosToastError(error)

    }
  };

  return (
    <section className="w-full container mx-auto mt-10 px-2 ">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-10 ">
        <img src={circle} className="grid place-self-center size-16 md:size-24" alt="" />
        <form onSubmit={handleSubmit} className="grid gap-2 mt-6 ">
          <div className="grid  gap-1  ">
            <label htmlFor="email">Email : </label>
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
          <button
            type="submit"
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 hover:bg-green-700  text-white py-2 rounded-sm font-semibold my-4"
                : "bg-secondary-200  text-white py-2 rounded-sm font-semibold my-4 "
            }`}
          >
            Send login link
          </button>
        </form>
        <div className="flex items-center justify-between mt-5">
          <p className="w-2/5 border border-gray-500"></p>
          <h1 className="text-gray-500">OR</h1>
          <p className="w-2/5 border border-gray-500 "></p>
        </div>
        <p className="text-center mt-5">
          <Link
            to={"/register"}
            className="  font-semibold text-green-700 hover:text-secondary-200"
          >
            Create new account
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
