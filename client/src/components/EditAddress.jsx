import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import { useGlobalContext } from "../provider/GlobalProvider";

const EditAddress = ({ close, data }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
        _id : data._id,
        userId : data.userId,
      name: data.name,
      address_line: data.address_line,
      city: data.city,
      state: data.state,
      country: data.country,
      pincode: data.pincode,
      mobile: data.mobile,
    },
  });

  const { fetchAddress } = useGlobalContext();

  const onsubmit = async (data) => {

    try {
      const response = await Axios({
        ...summaryApi.updateAddress,
        data: {
          ...data,
          name: data.name,
          address_line: data.address_line,
          city: data.city,
          state: data.state,
          country: data.country,
          pincode: data.pincode,
          mobile: data.mobile,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
          reset();
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };
  return (
    <section className="bg-black fixed inset-0 bg-opacity-70 z-50 h-screen  overflow-y-auto ">
      <div className="bg-white p-4 w-full ms:max-w-72 mm:max-w-sm sm:max-w-md lg:max-w-lg mt-8 mx-auto rounded ">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold ">Edit Address</h2>
          <button
            onClick={close}
            className=" bg-red-600 hover:bg-red-800 text-white "
          >
            <IoMdClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onsubmit)} className="grid gap-4 ">
          <div className="grid gap-1 mt-4">
            <label htmlFor="name">Name : </label>
            <input
              type="text"
              id="name"
              className="border bg-blue-50 p-2 rounded "
              {...register("name", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="addressline">Address : </label>
            <input
              type="text"
              id="addressline"
              className="border bg-blue-50 p-2 rounded "
              {...register("address_line", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="city">City : </label>
            <input
              type="text"
              id="city"
              className="border bg-blue-50 p-2 rounded "
              {...register("city", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="state">State : </label>
            <input
              type="text"
              id="state"
              className="border bg-blue-50 p-2 rounded "
              {...register("state", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="pincode">Pincode : </label>
            <input
              type="number"
              id="pincode"
              className="border bg-blue-50 p-2 rounded "
              {...register("pincode", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="country">country : </label>
            <input
              type="text"
              id="country"
              className="border bg-blue-50 p-2 rounded "
              {...register("country", { required: true })}
            />
          </div>
          <div className="grid gap-1 mt-4">
            <label htmlFor="mobile">Mobile No : </label>
            <input
              type="number"
              id="mobile"
              className="border bg-blue-50 p-2 rounded "
              {...register("mobile", { required: true })}
            />
          </div>

          <button
            type="submit"
            className="bg-primary-200 w-full p-2 mt-4 font-semibold   rounded "
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditAddress;
