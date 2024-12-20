import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validData = Object.values(data).every((el) => el);



  useEffect(() => {
    if (!location?.state?.data?.success) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email,
        };
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
        toast.error("Password Mismatched")
        return
    }
    try {
      const response = await Axios({
        ...summaryApi.reset_password,
        data: data,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
            email: "",
            newPassword: "",
            confirmPassword: ""
        });
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
        {/* <img
          src={circle}
          className="grid place-self-center size-16 md:size-24"
          alt=""
        /> */}
        <form onSubmit={handleSubmit} className="grid gap-2 mt-6 ">
        <div className="grid gap-1 ">
            <label htmlFor="newPassword">New Password :</label>
            <div className="bg-blue-50 p-2 border-2 rounded flex items-center focus-within:border-primary-200 ">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className= "w-full outline-none bg-transparent "
                name="newPassword"
                value={data.newPassword}
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

          <div className="grid gap-1 ">
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className="bg-blue-50 p-2 border-2 rounded flex items-center focus-within:border-primary-200 ">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className= "w-full outline-none bg-transparent "
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
                : "bg-secondary-200  text-white py-2 rounded-sm font-semibold my-4 "
            }`}
          >
            Change Password
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

export default ResetPassword;
