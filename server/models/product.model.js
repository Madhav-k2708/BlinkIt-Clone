import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      default: [],
    },
    category: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "category",
      },
    ],
    subCategory: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
      index: true,
    },
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//  create a text index
productSchema.index({
  name: "text",
  description: "text",
}, {
  name : 10,
  description : 5
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
