import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createProductController,
  getProductByCategory,
  getProductByCategoryAndSubCategory,
  getProductController,
  getProductDetails,
  searchProduct,
  updateProductDetails,
} from "../controllers/productController.js";
import { admin } from "../middleware/Admin.js";

const productRouter = Router();

productRouter.post("/add", auth, admin, createProductController);
productRouter.post("/get", getProductController);
productRouter.post("/get-product-by-category", getProductByCategory);
productRouter.post(
  "/get-product-by-category-and-subcategory",
  getProductByCategoryAndSubCategory
);
productRouter.post("/get-product-details", getProductDetails);
productRouter.put("/update-product-details", auth, admin, updateProductDetails);
productRouter.delete("/delete-product", auth, admin, updateProductDetails);

// search product api
productRouter.post("/search-product", searchProduct);

export default productRouter;