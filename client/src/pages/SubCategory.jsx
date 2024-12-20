import React, { useEffect, useState } from "react";
import UploadSubCategory from "../components/UploadSubCategory";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import Table from "../components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { IoTrashSharp } from "react-icons/io5";
import EditSubCategory from "../components/EditSubCategory";
import ConformBox from "../components/ConformBox";
import AxiosToastError from "../utils/AxiosToastError";

const SubCategory = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();
  const [imageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    _id: "",
  });

  const [deleteSubCategory, setDeleteSubCategory] = useState({
    _id : ""
  })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getSubCategory,
      });
      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
 AxiosToastError(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {

        return (
          <div className="flex items-center justify-center ">
            <img
              onClick={() => setImageURL(row.original.image)}
              src={row.original.image}
              alt={row.original.name}
              className="w-10 h-10 cursor-pointer "
            />
          </div>
        );
      },
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <>
            {row.original.category.map((category, index) => {
              return (
                <p key={index} className="shadow-md px-1 inline-block ">
                  {category.name}
                </p>
              );
            })}
          </>
        );
      },
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-self-center gap-3">
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-1  bg-secondary-200 rounded hover:text-secondary-100 "
            >
              <HiOutlinePencilSquare size={20} />
            </button>
            <button onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }} className="p-1   bg-primary-200 rounded text-red-600 hover:text-red-800 ">
              <IoTrashSharp size={20} />
            </button>
          </div>
        );
      },
    }),
  ];

  const handleDeleteSubCategory =async() => {
    try {
      const response = await Axios({
        ...summaryApi.deleteSubCategory,
        data : deleteSubCategory
      })      

      const {data : responseData} = response
      if (responseData.success) {
        toast.success(responseData.message)  
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({_id : ""})

      }
    } catch (error) {
      AxiosToastError(error)

      
    }
  }


  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between ">
        <h2 className="font-semibold ">Sub Category</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="text-sm font-medium border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded "
        >
          Add Sub Category
        </button>
      </div>

      <div className="overflow-auto w-full max-w-[95vw] ">
        <Table data={data} column={column} />
      </div>

      {openAddSubCategory && (
        <UploadSubCategory close={() => setOpenAddSubCategory(false)} fetchData = {fetchSubCategory} />
      )}

      {imageURL && <ViewImage url={imageURL} close={() => setImageURL("")} />}

      {openEdit && (
        <EditSubCategory data={editData} close={() => setOpenEdit(false)} fetchData={fetchSubCategory} />
      )}

      {
        openDeleteConfirmBox && (
          <ConformBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm ={handleDeleteSubCategory}
          />
        )
      }
    </section>
  );
};

export default SubCategory;
