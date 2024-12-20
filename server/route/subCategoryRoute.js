import {Router} from 'express'
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from '../controllers/subCategoryController.js'
import auth from '../middleware/auth.js'

const subCategorRouter = Router()

subCategorRouter.post("/add-subcategory", auth, AddSubCategoryController)
subCategorRouter.get("/get-subcategory", getSubCategoryController)
subCategorRouter.put("/update-subcategory",auth, updateSubCategoryController)
subCategorRouter.delete("/delete-subcategory", auth, deleteSubCategoryController)


export default subCategorRouter