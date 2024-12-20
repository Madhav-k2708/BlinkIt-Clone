import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatarUpload from "../components/UserProfileAvatarUpload";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import toast from "react-hot-toast";
import { setUserDetails } from "../store/userSlice";
import fetchUserDetails from "../utils/fetchUserDetails";
import AxiosToastError from "../utils/AxiosToastError";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [openAvatarEdit, setOpenAvatarEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  });

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  
  useEffect(() => {
    setUserData({ name: user.name, email: user.email, mobile: user.mobile });
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await Axios({
        ...summaryApi.updateUserDetails,
        data : userData

      })

      const {data : responseData} = response
      if (responseData.success) {
        toast.success(responseData.message) 
        const userData = await fetchUserDetails()
        dispatch(setUserDetails(userData.data))         
      }
  
      
      
    } catch (error) {
     AxiosToastError(error)
      
    }finally{
      setLoading(false)
    }

  }


  return (
    <div className="p-4 ">
      {/* display profile image  */}
      <div className=" w-20 h-20 bg-red-500 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm ">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-full h-full  " />
        ) : (
          <FaRegUserCircle size={65} />
        )}
      </div>
      <button
        onClick={() => setOpenAvatarEdit(true)}
        className="text-xs font-medium min-w-20 border border-primary-100 hover:border-primary-200 hover:bg-primary-200 px-3 py-1 rounded-full mt-3  "
      >
        Edit
      </button>
      {openAvatarEdit && (
        <UserProfileAvatarUpload close={() => setOpenAvatarEdit(false)} />
      )}

      {/* eidt name, mobile, email, change password */}
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 ">
        <div className=" grid   ">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="p-2 bg-blue-50 outline-primary-200  border focus-within:border-primary-200 px-3 py-1 rounded mt-3 "
            placeholder="Enter your name"
            value={userData.name}
            name="name"
            required
            onChange={handleOnChange}
          />
        </div>
        <div className=" grid   ">
          <label htmlFor="email">email</label>
          <input
            type="email"
            id="email"
            className="p-2 bg-blue-50 outline-primary-200  border focus-within:border-primary-200 px-3 py-1 rounded mt-3 "
            placeholder="Enter your email"
            value={userData.email}
            name="email"
            required
            onChange={handleOnChange}
          />
        </div>
        <div className=" grid   ">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="number"
            id="mobile"
            className="p-2 bg-blue-50 outline-primary-200  border focus-within:border-primary-200 px-3 py-1 rounded mt-3 "
            placeholder="Enter your mobile"
            value={userData.mobile}
            name="mobile"
            required
            onChange={handleOnChange}
          />
        </div>
       
        <button
          type="submit"
          className=" px-4 py-2 font-semibold text-secondary-200 hover:bg-secondary-200 hover:text-white border border-secondary-200 rounded-lg  "
        >
           {
          loading ? "Loading..." : "Submit"
        }
          
        </button>
      </form>
    </div>
  );
};

export default Profile;
