import userModel from "../models/userModel.js";
import cartProductModel from "../models/cartProduct.model.js";

export const addToCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!productId) {
      return res.status(402).json({
        message: "Provide Product Id",
        error: true,
        success: false,
      });
    }

    const checkProductCart = await cartProductModel.findOne({
      userId: userId,
      productId: productId,
    });

    if (checkProductCart) {
      return res.status(400).json({
        message: "Item already in cart",
        success: false,
      });
    }

    const cartItem = new cartProductModel({
      quantity: 1,
      userId: userId,
      productId: productId,
    });

    const save = await cartItem.save();

    const updateCartUser = await userModel.updateOne(
      { _id: userId },
      {
        $push: {
          shopping_cart: productId,
        },
      }
    );
    return res.json({
      message: "Item Added Successfully",
      data: save,
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

export const getCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const cartItem = await cartProductModel
      .find({
        userId: userId,
      })
      .populate("productId");

    return res.json({
      message: "Get Cart Product",
      data: cartItem,
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

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, quantity } = req.body;

    if (!_id || !quantity) {
      return res.status(400).json({
        message: "Provide _id",
      });
    }

    const updateCartItem = await cartProductModel.updateOne(
      {
        _id: _id,
        userId: userId,
      },
      {
        quantity: quantity,
      }
    );
    return res.json({
      message: "Item added",
      data: updateCartItem,
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

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        message: "Provide _id",
        error: true,
        success: false,
      });
    }

    const deleteCartItem = await cartProductModel.deleteOne({ _id: _id, userId : userId });

    return res.json({
      message: "Item Removed",
      data: deleteCartItem,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Item Deleted",
      error: true,
      success: false,
    });
  }
};
