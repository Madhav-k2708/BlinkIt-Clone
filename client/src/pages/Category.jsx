import React, { useEffect, useState } from "react";
import UploadCategory from "../components/UploadCategory";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import summaryApi from "../common/summaryApi";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import EditCategory from "../components/EditCategory";
import ConformBox from "../components/ConformBox";
import { useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";


const Category = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });

  const [openConformBoxDelete, setOpenConformBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });

  
  
  // const allCategory = useSelector((state) => state.product.allCategory);


  // useEffect(() => {
  //   setCategoryData(allCategory);
  // }, [allCategory]);


  // get category
  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...summaryApi.getCategory,
      });
      const { data: responseData } = response;
     
      if (responseData.success) {
        setCategoryData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategory()
  }, [])

  

  // delete category
  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...summaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory()
        setOpenConformBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error)

    }
  };

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between ">
        <h2 className="font-semibold ">Category</h2>
        <button
          onClick={() => setOpenUploadCategory(true)}
          className="text-sm font-medium border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded "
        >
          Add Category
        </button>
      </div>
      {!categoryData[0] && !loading && <NoData />}

      <div className="p-4 place-items-center grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lgl:grid-cols-6 gap-2  ">
        {categoryData.map((category, index) => {
          return (
            <div key={index} className="w-32 h-56 group rounded shadow-xl ">
              <img
                src={category.image}
                alt={category.name}
                className="w-full object-scale-down "
              />
              <div className=" items-center h-9 flex gap-2 px-1 ">
                <button
                  onClick={() => {
                    setOpenEdit(true);
                    setEditData(category);
                  }}
                  className="flex-1 bg-green-100 px-1 py-0.5 text-green-800 hover:bg-green-200 rounded font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpenConformBoxDelete(true);
                    setDeleteCategory(category);
                  }}
                  className="flex-1 bg-red-100 px-1 py-0.5 text-red-800 hover:bg-red-200  rounded font-medium "
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {loading && <Loading />}

      {openUploadCategory && (
        <UploadCategory
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConformBoxDelete && (
        <ConformBox
          close={() => setOpenConformBoxDelete(false)}
          confirm={handleDeleteCategory}
          cancel={() => setOpenConformBoxDelete(false)}
        />
      )}
    </section>
  );
};

export default Category;
