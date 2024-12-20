import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import uploadImage from "../utils/UploadImage";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const EditSubCategory = ({ close, data, fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id : data._id,
    name: data.name,
    image: data.image,
    category: data.category || []
  });

  const allCategory = useSelector((state) => state.product.allCategory);
  
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setSubCategoryData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubCategoryimage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const response = await uploadImage(file);
    const { data: ImageResponse } = response;

    setSubCategoryData((prev) => {
      return {
        ...prev,
        image: ImageResponse.data.url,
      };
    });
  };

  const handleRemoveSelectedCategory = (categoryId) => {
    const index = subCategoryData.category.findIndex(
      (el) => el._id === categoryId
    );

    subCategoryData.category.splice(index, 1);
    setSubCategoryData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...summaryApi.updateSubCategory,
        data: subCategoryData,
      });

      const { data: responseData } = response;


      if (responseData.success) {
        toast.success(responseData.message);
        if (close) {
          close();
        }
        if (fetchData) {
          fetchData()         
        }
      }
    } catch (error) {
      AxiosToastError(error)

    }
  };



  return (
    <section className="fixed inset-0  bg-neutral-800 bg-opacity-70 p-4 z-50  flex items-center justify-center ">
      <div className="w-full max-w-5xl bg-white p-4 rounded ">
        <div className="flex items-center justify-between ">
          <h1 className="font-semibold">Edit Sub Category</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>

        <form onSubmit={handleUpdateSubCategory} className="my-3 grid gap-3 ">
          <div className="grid gap-1">
            <label htmlFor="subCategory">Name</label>
            <input
              id="subCategory"
              name="name"
              value={subCategoryData.name}
              onChange={handleChange}
              className="p-3 bg-blue-50 border outline-none rounded focus-within:border-primary-200"
              type="text"
            />
          </div>
          <div className="grid gap-1">
            <p>Image</p>
            <div className="flex flex-col lg:flex-row items-center gap-3">
              <div className="border h-36 lg:w-36 w-full bg-blue-50 flex items-center justify-center ">
                {!subCategoryData.image ? (
                  <p className="text-sm text-neutral-400">No Image</p>
                ) : (
                  <img
                    src={subCategoryData.image}
                    alt="subcategory"
                    className="w-full h-full object-scale-down"
                  />
                )}
              </div>
              <label htmlFor="uploadImage">
                <div className="px-4 py-1 border rounded border-primary-100 cursor-pointer text-primary-200 hover:text-neutral-900 hover:bg-primary-200 ">
                  Upload Image
                </div>
                <input
                  type="file"
                  id="uploadImage"
                  className="hidden"
                  onChange={handleSubCategoryimage}
                />
              </label>
            </div>
          </div>

          <div className="grid gap-1">
            <label htmlFor="">Select Category</label>
            <div className="border focus-within:border-primary-200 bg-transparent rounded">
              {/* display value */}
              <div className="flex flex-wrap gap-2 ">
                {subCategoryData.category.map((category, index) => {
                  return (
                    <p
                      key={index}
                      className="bg-secondary-200 text-white rounded shadow-md px-1 m-1 flex items-center gap-2 "
                    >
                      {category.name}{" "}
                      <div
                        className="cursor-pointer hover:text-gray-100 "
                        onClick={() =>
                          handleRemoveSelectedCategory(category._id)
                        }
                      >
                        <IoClose />
                      </div>
                    </p>
                  );
                })}
              </div>

              {/* select category */}
              <select
                name=""
                id=""
                className="w-full p-2 outline-none border"
                onChange={(e) => {
                  const value = e.target.value;
                  const categoryDetails = allCategory.find(
                    (el) => el._id == value
                  );
                  setSubCategoryData((prev) => {
                    return {
                      ...prev,
                      category: [...prev.category, categoryDetails],
                    };
                  });
                }}
              >
                <option value="">Select Category</option>
                {allCategory.map((category, index) => {
                  return (
                    <option key={index} value={category?._id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className={` px-4 py-1 border ${
              subCategoryData?.name &&
              subCategoryData?.image &&
              subCategoryData?.category[0]
                ? "bg-primary-200 hover:bg-primary-100"
                : "bg-gray-200"
            }`}
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditSubCategory;
