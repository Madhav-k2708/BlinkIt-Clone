import {Router} from 'express'
import { addToCartItem, deleteCartItem, getCartItem, updateCartItem } from '../controllers/cartController.js'
import auth from '../middleware/auth.js'

const cartRouter = Router()

cartRouter.post("/add",auth, addToCartItem)
cartRouter.get("/get",auth, getCartItem)
cartRouter.put("/update-quantity",auth, updateCartItem)
cartRouter.delete("/delete",auth, deleteCartItem)
export default cartRouter