import addressModel from "../models/address.model.js";
import userModel from "../models/userModel.js";

export const addAddressController = async (req, res) => {
  try {
    const userId = req.userId; // middleware auth.js
    const { name, address_line, city, state, country, pincode, mobile } =
      req.body;
    const createAddress = new addressModel({
      name,
      address_line,
      city,
      state,
      country,
      pincode,
      mobile,
      userId: userId,
    });

    const saveAddress = await createAddress.save();

    const addUserAddressId = await userModel.findByIdAndUpdate(userId, {
      $push: {
        address: saveAddress._id,
      },
    });

    return res.json({
      message: "Address Created Successfully",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const userId = req.userId; // middleware
    const data = await addressModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });
    return res.json({
      data: data,
      message: "List of address",
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

export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, name, address_line, city, state, country, mobile, pincode } =
      req.body;

    const updateAddress = await addressModel.updateOne(
      { _id: _id, userId: userId },
      {
        name,
        address_line,
        city,
        state,
        country,
        mobile,
        pincode,
      }
    );
    return res.json({
      messgae: "Address Updated Successfully",
      data: updateAddress,
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

export const deleteAddres = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { _id } = req.body;

    const disableAddress = await addressModel.updateOne(
      { _id: _id, userId },
      {
        status: false,
      }
    );

    return res.json({
      data : disableAddress,
      message: "Address remove ",
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
