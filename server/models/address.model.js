import mongoose, { mongo } from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name : {
      type : String,
      default : ""
    },
    address_line: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    pincode: {
      type: Number,
    },
    country: {
      type: String,
    },
    mobile: {
      type: Number,
      default: null,
    },
    status:{
        type:Boolean, 
        default:true
    },
    userId: {
      type : mongoose.Schema.ObjectId,
      default : "",
      ref : "user"
    }
  },
  { timestamps: true }
);

const addressModel =
  mongoose.models.address || mongoose.model("address", addressSchema);

export default addressModel;
