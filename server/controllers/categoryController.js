import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";
import subCategoryModel from "../models/subCategory.model.js";

const AddCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "Fill required fileds",
        error: true,
        success: false,
      });
    }

    const addCategory = await new categoryModel({
      name,
      image,
    });

    const saveCategory = await addCategory.save();

    if (!saveCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: false,
        success: true,
      });
    }

    return res.json({
      message: " Add Category",
      error: false,
      success: true,
      data: saveCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: true, message: error.message || error });
  }
};

const getCategory = async (req, res) => {
  try {
    const data = await categoryModel.find().sort({createdAt : -1});
    return res.json({
      success: true,
      error: false,
      message: "All Category",
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: true });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const update = await categoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      }
    );
    return res.json({
      success: true,
      error: false,
      message: "Category Updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { _id } = req.body;
    const checkSubCategory = await subCategoryModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    const checkProduct = await productModel
      .find({
        category: {
          $in: [_id],
        },
      })
      .countDocuments();

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res
        .status(400)
        .json({ message: "Category is already in use. we can't delete" });
    }

    const deleteCategory = await categoryModel.deleteOne({ _id: _id });

    return res.json({
      message: "Category Deleted",
      success: true,
      error: false,
      data: deleteCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};

export { AddCategory, getCategory, updateCategory, deleteCategory };
