import {Router} from 'express'
import { CashOnDelivery, getOrderDetails, paymentController, webhookStripe } from '../controllers/orderController.js'
import auth from '../middleware/auth.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery", auth, CashOnDelivery)
orderRouter.post("/checkout", auth, paymentController)
orderRouter.post("/webhook", webhookStripe)
orderRouter.get("/order-list",auth, getOrderDetails)

export default orderRouter