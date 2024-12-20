import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { Link, useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (data.password !== data.confirmPassword) {
      toast.error("Password Mismatch");
      return;
    }
    try {
      const response = await Axios({
        ...summaryApi.register,
        data: data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
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
        <p className="text-lg text-secondary-200 border-b-2 border-secondary-200 ">
          Welcome to Blinkit.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-2 mt-6 ">
          <div className="grid gap-1  ">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              autoFocus
              className="bg-blue-50 p-2  rounded outline-none border-2 focus:border-primary-200  "
              name="name"
              value={data.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid  gap-1  ">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
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
          </div>
          <div className="grid  gap-1  ">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border-2 rounded flex items-center focus-within:border-primary-200 ">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="w-full outline-none bg-transparent "
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
              />
              <div
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="cursor-pointer"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={!validData}
            className={`${
              validData
                ? "bg-secondary-200 hover:bg-green-700  text-white py-2 rounded-sm font-semibold my-4"
                : "bg-black  text-white py-2 rounded-sm font-semibold my-4 "
            }`}
          >
            Register
          </button>
        </form>
        <p className="flex gap-1">
          Already have an account?
          <Link
            to={"/login"}
            className="font-semibold text-green-700 hover:text-secondary-200"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
