import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddAddress from "../components/AddAddress";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddress from "../components/EditAddress";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { useGlobalContext } from "../provider/GlobalProvider";

const Address = () => {
  const addressList = useSelector((state) => state.addresses.addressList);
  const [openAddress, setOpenAddress] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const { fetchAddress } = useGlobalContext();

  const handleDisableAddress = async (id) => {
    try {
      const response = await Axios({
        ...summaryApi.deleteAddress,
        data: {
          _id: id,
        },
      });
      if (response.data.success) {
        toast.success("Address Removed");
        if (fetchAddress) {
          fetchAddress();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-lg px-2 py-2 flex items-center justify-between gap-4  ">
        <h2 className="font-semibold text-ellipsis line-clamp-1 ">
          Saved Address
        </h2>
        <button
          onClick={() => setOpenAddress(true)}
          className=" border-2 border-primary-200  hover:bg-primary-200 px-3 py-1 rounded"
        >
          Add Address
        </button>
      </div>

      <div className="bg-blue-100 p-2 grid gap-4 mt-5 ">
        {addressList.map((address, index) => {
          return (
            <div
              key={address._id + index}
              className={`border rounded p-3 flex gap-5 bg-white ${
                !address.status && "hidden"
              } `}
            >
              <div className="w-full">
                <p>{address.name}</p>
                <p>{address.address_line}</p>
                <p>
                  {address.city} - {address.pincode}
                </p>
                <p>{address.state}</p>
                <p>{address.country}</p>

                <p>{address.mobile}</p>
              </div>
              <div className="grid gap-10 px-2 py-1">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(address);
                  }}
                  className="p-1 bg-green-200 text-green-600 hover:bg-green-400 hover:text-green-600 rounded "
                >
                  <MdEdit size={25} />
                </button>{" "}
                <button
                  onClick={() => {
                    handleDisableAddress(address._id)
                  }}
                  className="p-1 bg-red-200 text-red-600 hover:bg-red-400 hover:text-red-600 rounded "
                >
                  <MdDelete size={25} />
                </button>{" "}
              </div>
            </div>
          );
        })}
        <div
          onClick={() => setOpenAddress(true)}
          className="h-16 bg-blue-50 border-2 border-dashed border-primary-200 flex justify-center items-center "
        >
          Add address
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}

      {openEdit && (
        <EditAddress data={editData} close={() => setOpenEdit(false)} />
      )}
    </div>
  );
};

export default Address;
