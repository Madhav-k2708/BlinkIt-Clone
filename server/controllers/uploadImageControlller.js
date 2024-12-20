import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImageController = async (req, res) => {
  try {
    const file = req.file;

    const uploadImage = await uploadImageCloudinary(file);

    return res.json({ 
         success: true,
         error: false,
          message: "Image Uploaded",
          data : uploadImage
         });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

export default uploadImageController;
