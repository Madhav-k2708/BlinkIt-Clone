import ProductModel from "../models/product.model.js";

const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        message: "Fill all the fields",
        error: true,
        success: false,
      });
    }

    const product = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });

    const saveProduct = await product.save();

    return res.json({
      message: "Product Created Successfully",
      data: saveProduct,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product Data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Provide category ID",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({
      category: { $in: id },
    }).limit(5);

    return res.json({
      message: "Category Product List",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId, page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Product categoryId and subcategoryId",
        error: true,
        success: false,
      });
    }

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Product Get from categoryId and subcategoryId",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await ProductModel.findOne({ _id: productId });

    return res.json({
      message: "Product Details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const updateProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "Provide Product _id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...req.body,
      }
    );

    return res.json({
      message: "Updated Successfully",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return res.json({
      message: "Product Deleted",
      data: deleteProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.json({
      message: "Filterd Products",
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount/limit),
      page: page,
      limit: limit,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export {
  createProductController,
  getProductController,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductDetails,
  updateProductDetails,
  deleteProduct,
  searchProduct,
};
