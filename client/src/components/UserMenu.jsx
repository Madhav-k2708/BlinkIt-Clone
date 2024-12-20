import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Divider from "./Divider";
import summaryApi from "../common/summaryApi";
import Axios from "../utils/Axios";
import toast from "react-hot-toast";
import { logout } from "../store/userSlice";
import { FaExternalLinkAlt } from "react-icons/fa";
import isAdmin from "../utils/isAdmin";
import AxiosToastError from "../utils/AxiosToastError";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...summaryApi.logout,
      });

      if (response.data.success) {
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error)

    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div>
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis ">
          {user.name || user.mobile}{" "}
          <span className="font-medium text-red-500 ">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={handleClose}
          to={"/dashboard/profile"}
          className="hover:text-primary-200 "
        >
          <FaExternalLinkAlt size={14} />
        </Link>
      </div>

      <Divider />
      <div className="text-sm grid gap-2 ">
        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/category"}
            className="px-2 py-1  hover:bg-secondary-200 hover:text-white hover:rounded "
          >
            Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/subCategory"}
            className="px-2 py-1  hover:bg-secondary-200 hover:text-white hover:rounded "
          >
            Sub Category
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/upload-product"}
            className="px-2 py-1  hover:bg-secondary-200 hover:text-white hover:rounded "
          >
            Upload Product
          </Link>
        )}

        {isAdmin(user.role) && (
          <Link
            onClick={handleClose}
            to={"/dashboard/product"}
            className="px-2 py-1  hover:bg-secondary-200 hover:text-white hover:rounded "
          >
            Product
          </Link>
        )}

        <Link
          onClick={handleClose}
          to={"/dashboard/myorders"}
          className="px-2 py-1  hover:bg-secondary-200 hover:text-white hover:rounded "
        >
          My Orders
        </Link>
        <Link
          onClick={handleClose}
          to={"/dashboard/address"}
          className="px-2 py-1 hover:bg-secondary-200 hover:text-white hover:rounded "
        >
          Save Address
        </Link>
        <button
          onClick={handleLogout}
          className="text-left px-2 py-1 hover:bg-secondary-200 hover:text-white hover:rounded   "
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
