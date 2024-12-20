import subCategoryModel from "../models/subCategory.model.js";

const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    if (!name && !image && !category[0]) {
      return res.status(400).json({
        message: "Provide name, image, category",
        error: true,
        success: false,
      });
    }

    const payload = {
      name,
      image,
      category,
    };

    const createSubCategory = new subCategoryModel(payload);
    const save = await createSubCategory.save();

    return res.json({
      message: "Sub Category Created",
      data: save,
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: true });
  }
};

const getSubCategoryController = async (req, res) => {
  try {
    const data = await subCategoryModel
      .find()
      .sort({ createdAt: -1 })
      .populate("category");
    return res.json({
      data: data,
      message: "Sub Category Data",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: true });
  }
};

const updateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, category } = req.body;

    const checkSubCategoryId = await subCategoryModel.findById(_id);

    if (!checkSubCategoryId) {
      return res.status(400).json({
        message: "Check category Id",
        success: false,
        error: true,
      });
    }

    const updateSubCategory = await subCategoryModel.findByIdAndUpdate(_id, {
      name,
      image,
      category,
    });

    return res.json({
      message: "Updated Successfully",
      success: true,
      error: false,
      data: updateSubCategory,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: true });
  }
};

const deleteSubCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const deleteSubCategory = await subCategoryModel.findByIdAndDelete(_id);

    return res.json({
      message: "Deleted Successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: true });
  }
};

export {
  AddSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
};
