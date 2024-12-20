import React, { useEffect, useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { IoIosTrash } from "react-icons/io";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldDetails from "../components/AddFieldDetails";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { successAlert } from "../utils/SuccessAlert";
import AxiosToastError from "../utils/AxiosToastError";

const UploadProduct = () => {
  const [data, setData] = useState({
    name: "",
    image: [],
    category: [],
    subCategory: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: {},
  });
  const [imageLoading, setImageLoading] = useState(false);
  const [viewImage, setViewImage] = useState("");
  const allCategory = useSelector((state) => state.product.allCategory);
  const allSubCategory = useSelector((state) => state.product.allSubCategory);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const [openAddField, setOpenAddField] = useState(false);
  const [fieldName, setFieldName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }
    setImageLoading(true);
    const response = await uploadImage(file);
    const { data: imageResponse } = response;
    const imageUrl = imageResponse.data.url;

    setData((prev) => {
      return {
        ...prev,
        image: [...prev.image, imageUrl],
      };
    });
    setImageLoading(false);
  };

  const handleDeleteImage = async (index) => {
    data.image.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleRemoveCategory = async (index) => {
    data.category.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleRemoveSubCategory = async (index) => {
    data.subCategory.splice(index, 1);
    setData((prev) => {
      return {
        ...prev,
      };
    });
  };

  const handleAddField = () => {
    setData((prev) => {
      return {
        ...prev,
        more_details: {
          ...prev.more_details,
          [fieldName]: "",
        },
      };
    });
    setFieldName("");
    setOpenAddField(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...summaryApi.createProduct,
        data: data,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        successAlert(responseData.message);
         setData({
          name: "",
          image: [],
          category: [],
          subCategory: [],
          unit: "",
          stock: "",
          price: "",
          discount: "",
          description: "",
          more_details: {}
         })
      }
    } catch (error) {
      AxiosToastError(error)

    }
  };

  // useEffect(() => {
  //   successAlert("Uploaded Succesfully");
  // }, []);

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between ">
        <h2 className="font-semibold ">Upload Product</h2>
      </div>

      <div className="grid p-4">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium ">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter Product Name"
              value={data.name}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="description" className="font-medium ">
              Description
            </label>
            <textarea
              id="Description"
              type="text"
              name="description"
              placeholder="Enter Product description"
              value={data.description}
              onChange={handleChange}
              required
              rows={2}
              className="bg-blue-50 p-2 outline-none border resize-none focus-within:border-primary-200 rounded"
            />
          </div>
          <div>
            <p>Image</p>
            <div>
              <label
                htmlFor="uploadImage"
                className="font-medium bg-blue-50 h-24 rounded flex items-center justify-center cursor-pointer "
              >
                <div className="text-center flex flex-col items-center ">
                  {imageLoading ? (
                    <Loading />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={40} />
                      <p>Upload Image</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  id="uploadImage"
                  className="hidden"
                  onChange={handleUploadImage}
                />
              </label>

              {/* Display uploaded image */}
              <div className=" flex flex-wrap gap-3">
                {data.image.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="h-28 w-30 mt-2 min-w-20 bg-blue-50 border relative group "
                    >
                      <img
                        src={img}
                        alt={img}
                        className="w-full h-full object-scale-down cursor-pointer"
                        onClick={() => setViewImage(img)}
                      />
                      <div
                        onClick={() => handleDeleteImage(index)}
                        className="absolute bottom-0 right-0 p-1 rounded bg-red-600 text-white hover:bg-red-600 hidden group-hover:block cursor-pointer "
                      >
                        <IoIosTrash />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="category" className="font-medium ">
              Category
            </label>
            <div>
              <select
                className="bg-blue-50 outline-none text-neutral-800 border w-full p-2 rounded"
                value={selectCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const category = allCategory.find((el) => el._id === value);

                  setData((prev) => {
                    return {
                      ...prev,
                      category: [...prev.category, category],
                    };
                  });
                  setSelectCategory("");
                }}
              >
                <option value="">Select Category</option>
                {allCategory.map((c, index) => {
                  return (
                    <option key={index} value={c?._id}>
                      {c.name}{" "}
                    </option>
                  );
                })}
              </select>
              <div className="flex flexwrap gap-2">
                {data.category.map((c, index) => {
                  return (
                    <div
                      className="text-sm flex items-center gap-2 bg-secondary-200 text-white p-1 rounded mt-1 "
                      key={c._id + index}
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-600 cursor-pointer "
                        onClick={() => handleRemoveCategory(index)}
                      >
                        <IoClose />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="subCategory" className="font-medium ">
              Sub Category
            </label>
            <div>
              <select
                className="bg-blue-50 outline-none text-neutral-800 border w-full p-2 rounded"
                value={selectSubCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  const subCategory = allSubCategory.find(
                    (el) => el._id === value
                  );

                  setData((prev) => {
                    return {
                      ...prev,
                      subCategory: [...prev.subCategory, subCategory],
                    };
                  });
                  setSelectSubCategory("");
                }}
              >
                <option value="" className="text-red-800 ">
                  Select SubCategory
                </option>
                {allSubCategory.map((c, index) => {
                  return (
                    <option key={index} value={c?._id}>
                      {c.name}{" "}
                    </option>
                  );
                })}
              </select>
              <div className="flex flexwrap gap-2">
                {data.subCategory.map((c, index) => {
                  return (
                    <div
                      className="text-sm flex items-center gap-2 bg-secondary-200 text-white p-1 rounded mt-1 "
                      key={c._id + index}
                    >
                      <p>{c.name}</p>
                      <div
                        className="hover:text-red-600 cursor-pointer "
                        onClick={() => handleRemoveSubCategory(index)}
                      >
                        <IoClose />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium ">
              Unit
            </label>
            <input
              id="unit"
              type="text"
              name="unit"
              placeholder="Enter Product Unit"
              value={data.unit}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="unit" className="font-medium ">
              No. of. Stocks
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Enter Product Stock"
              value={data.stock}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="price" className="font-medium ">
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="Enter Product Price"
              value={data.price}
              onChange={handleChange}
              required
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="discount" className="font-medium ">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              name="discount"
              placeholder="Enter Product Discount"
              value={data.discount}
              onChange={handleChange}
             
              className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
            />
          </div>

          {/*  add more details */}

          {Object.keys(data.more_details).map((details, index) => {
            return (
              <div className="grid gap-1" key={index}>
                <label htmlFor={details} className="font-medium ">
                  {details}
                </label>
                <input
                  id={details}
                  type="text"
                  value={data.more_details[details]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setData((prev) => {
                      return {
                        ...prev,
                        more_details: {
                          ...prev.more_details,
                          [details]: value,
                        },
                      };
                    });
                  }}
                  required
                  className="bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded"
                />
              </div>
            );
          })}

          <div
            className="inline-block w-52 cursor-pointer text-center font-semibold bg-primary-200 hover:bg-primary-100 border border-primary-200 py-1 px-3 rounded
           "
            onClick={() => setOpenAddField(true)}
          >
            Add Fields
          </div>
          <button
            type="submit"
            className="bg-primary-200 hover:bg-primary-100 py-2 rounded font-semibold "
          >
            Submit
          </button>
        </form>
      </div>

      {viewImage && (
        <ViewImage url={viewImage} close={() => setViewImage("")} />
      )}
      {openAddField && (
        <AddFieldDetails
          close={() => setOpenAddField(false)}
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          submit={handleAddField}
        />
      )}
    </section>
  );
};

export default UploadProduct;
