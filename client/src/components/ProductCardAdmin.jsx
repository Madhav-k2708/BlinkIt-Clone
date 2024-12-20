import React, { useState } from "react";
import EditProductAdmin from "./EditProductAdmin";
import ConformBox from "./ConformBox";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import AxiosToastError from "../utils/AxiosToastError";

const ProductCardAdmin = ({ data, fetchProductData }) => {
  const [editOpen, setEditOpen] = useState(false);
  const [openDelete0, setOpenDelete] = useState(false);

  const handleDeleteCancel = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      const resposne = await Axios({
        ...summaryApi.deleteProduct,
        data: {
          _id: data._id,
        },
      });

      const { data: responseData } = resposne;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchProductData) {
          fetchProductData();
        }
        setOpenDelete(false)
      }
    } catch (error) {
      AxiosToastError(error)

    }
  };

  return (
    <div className="w-32 p-2 bg-white rounded ">
      <div>
        <img
          src={data?.image[0]}
          alt={data.name}
          className="w-full  h-full object-scale-down"
        />
      </div>
      <p className="text-ellipsis line-clamp-2 font-medium h-12 ">
        {data?.name}{" "}
      </p>
      <p className="text-slate-400 ">{data?.unit}</p>
      <div className="grid grid-cols-2 gap-2 py-2 ">
        <button
          onClick={() => setEditOpen(true)}
          className="border py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-700 "
        >
          Edit
        </button>
        <button
          onClick={() => setOpenDelete(true)}
          className="border py-1 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-700 "
        >
          Delete
        </button>
      </div>
      {editOpen && (
        <EditProductAdmin
          data={data}
          fetchProductData={fetchProductData}
          close={() => setEditOpen(false)}
        />
      )}
      {openDelete0 && (
        <section className="fixed inset-0 flex items-center justify-center bg-neutral-600 bg-opacity-60 z-50  ">
          <div className="bg-white p-4 w-full max-w-md rounded ">
            <div className="flex items-center justify-between gap-4 ">
              <h3 className="font-semibold ">Permanent Delete</h3>
              <button onClick={() => setOpenDelete(false)}>
                <IoClose size={25} />
              </button>
            </div>
            <p className="my-2">Are your sure want to delete permenently ?</p>
            <div className="flex items-center gap-4 justify-end py-2  ">
              <button
                onClick={handleDeleteCancel}
                className="text-lg border bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="text-lg bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductCardAdmin;
