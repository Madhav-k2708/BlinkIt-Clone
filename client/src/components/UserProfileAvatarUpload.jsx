import React, { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import {toast} from 'react-hot-toast'
import { updateAvatar } from "../store/userSlice";
import { IoClose } from "react-icons/io5";
import AxiosToastError from "../utils/AxiosToastError";


const UserProfileAvatarUpload = ({close}) => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return       
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setLoading(true);

      const response = await Axios({
        ...summaryApi.uploadAvatar,
        data: formData,
      });
      const {data : responseData} = response
      dispatch(updateAvatar(responseData.data.avatar))
     
    } catch (error) {
      AxiosToastError(error)
 
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <section className="fixed inset-0 bg-neutral-900 bg-opacity-60 p-4 flex items-center justify-center  ">
      <div className="bg-white max-w-sm w-full p-4 rounded flex flex-col items-center justify-center ">
        <button onClick={close} className="text-neutral-800 hover:bg-red-500 hover:text-white w-fit block ml-auto  "> <IoClose size={20} />
        </button>
        <div className=" w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm ">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full  "
            />
          ) : (
            <FaRegUserCircle size={65} />
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="uploadProfile">
            {" "}
            <div className="border cursor-pointer border-primary-200 hover:bg-primary-200 px-4 py-1 rounded-lg text-sm my-3 ">
              {loading ? "Uploading..." : "Upload"}
              <input
                onChange={handleUploadAvatar}
                type="file"
                name="uploadProfile"
                id="uploadProfile"
                className="hidden"
              />
            </div>
          </label>
        </form>
      </div>
    </section>
  );
};

export default UserProfileAvatarUpload;
