import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";

const OtpVerification = () => {
  const [data, setData] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const inputRef = useRef([]);
  const location = useLocation()

  useEffect(() => {
    if (!location?.state?.email) {
       navigate("/forgot-password")         
    }
  }, [])
  
  
  const validData = data.every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...summaryApi.forgot_password_otp_verification,
        data:{
            otp:data.join(""),
            email : location?.state?.email
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData(["", "", "", "", "", ""]);
        navigate("/reset-password",{
          state: {
            data : response.data,
            email :  location?.state?.email
          }
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
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-6 ">
        <form onSubmit={handleSubmit} className="grid gap-4 mt-4 ">
          <div className="grid  gap-1  ">
            <label htmlFor="otp">OTP : </label>
            <div className="flex items-center gap-2 justify-between">
              {data.map((element, index) => {
                return (
                  <input
                    key={"otp" + index}
                    type="text"
                    id="otp"
                    ref={(ref) => {
                        inputRef.current[index] = ref
                        return ref
                    }}
                    value={data[index]}
                    onChange={(e) => {
                      const value = e.target.value;
                
                      const newData = [...data];
                      newData[index] = value;
                      setData(newData);

                      if (value && index < 5 ) {
                        inputRef.current[index+1].focus()                        
                      }
                    }}
                    maxLength={1}
                    className="bg-blue-50 w-full max-w-12 p-1 h-full min-h-10 text-center font-semibold border-2 rounded outline-none focus:border-primary-200 "
                  />
                );
              })}
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
            Verify otp
          </button>
        </form>
        <div className="flex items-center justify-between mt-5">
          <p className="w-2/5 border border-gray-500"></p>
          <h1 className="text-gray-500">OR</h1>
          <p className="w-2/5 border border-gray-500 "></p>
        </div>
        <p className="text-center mt-5">
          <Link
            to={"/login"}
            className="  font-semibold text-green-700 hover:text-secondary-200"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default OtpVerification;
