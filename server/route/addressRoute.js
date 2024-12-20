import { Router } from "express";
import { addAddressController, deleteAddres, getAddress, updateAddress } from "../controllers/addressController.js";
import auth from "../middleware/auth.js";

const addressRouter = Router();

addressRouter.post("/create", auth, addAddressController);
addressRouter.get("/get", auth, getAddress);
addressRouter.put("/update", auth, updateAddress);
addressRouter.delete("/delete", auth, deleteAddres);


export default addressRouter