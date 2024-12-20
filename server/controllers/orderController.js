import Stripe from "../config/stripe.js";
import cartProductModel from "../models/cartProduct.model.js";
import orderModel from "../models/order.model.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const CashOnDelivery = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generateOrder = await orderModel.insertMany(payload);

    // remove from the cart
    const removeCartItems = await cartProductModel.deleteMany({
      userId: userId,
    });
    const updateUserCart = await userModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return res.json({
      message: "Order Successfull",
      data: generateOrder,
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

export const priceWithDiscount = (price, discount = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  const actualPrice = Number(price) - Number(discountAmount);
  return actualPrice;
};

export const paymentController = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { list_items, totalAmt, subTotalAmt, addressId } = req.body;

    const user = await userModel.findById(userId);

    const line_items = list_items.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            priceWithDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    const session = await Stripe.checkout.sessions.create(params);

    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const payload = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(payload);
    }
  }

  return productList;
};

// //http:/localhost:8080/api/order/webhook
export const webhookStripe = async (request, response) => {
  const event = request.body;

  const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );
      // console.log("event", event)
      // console.log("linitems", lineItems)

      const userId = session.metadata.userId;

      const orderProduct = await getOrderProductItems({
        lineItems: lineItems,
        userId: userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      // console.log("orderproduct", orderProduct);
      

      const order = await orderModel.insertMany(orderProduct);

      if (Boolean(order[0])) {
        const removeCartItems = await userModel.findByIdAndUpdate(userId, {
          shopping_cart: [],
        });

        const removeCartProductDB = await cartProductModel.deleteMany({
          userId: userId,
        });
      }

      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};

export const getOrderDetails = async (req, res) => {
  try {
    const userId = req.userId; // order id
    const orderList = await orderModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");
    return res.json({
      message: "Order List",
      data: orderList,
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
