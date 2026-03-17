import { productModel } from "../models/productModel.js";
import BaseController from "./BaseController.js";

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product does not exist" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while retrieving product",
      error: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { price, discountPercent, ...productData } = req.body;

    price = price ? parseFloat(price) : undefined;
    discountPercent = discountPercent ? parseFloat(discountPercent) : 0;

    if (price !== undefined && discountPercent !== undefined) {
      productData.discountPrice = price - (price * discountPercent) / 100;
    }

    const newProduct = await productModel.create({
      price,
      discountPercent,
      ...productData,
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while creating product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let { price, discountPercent, ...updateData } = req.body;

    price = price ? parseFloat(price) : undefined;
    discountPercent = discountPercent ? parseFloat(discountPercent) : undefined;

    if (price !== undefined && discountPercent !== undefined) {
      updateData.discountPrice = price - (price * discountPercent) / 100;
    }

    const updatedProduct = await productModel.updateById(req.params.id, {
      price,
      discountPercent,
      ...updateData,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product does not exist" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productModel.deleteById(req.params.id);

    if (!deletedProduct) {
      return res.status(200).json({
        success: false,
        message: "Product does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Error while deleting product",
      error: error.message,
    });
  }
};

export const getProductsByPayload = BaseController.getDataByPayload(
  productModel,
  {
    searchFields: ["name", "description"],
    filters: async (query, filters) => {
      const filterMap = {
        status: (value) => ({ status: value === "true" }),

        priceMin: (value, q) => {
          q.price = q.price || {};
          q.price.$gte = parseFloat(value);
        },

        priceMax: (value, q) => {
          q.price = q.price || {};
          q.price.$lte = parseFloat(value);
        },

        brand: (value) => {
          if (Array.isArray(value)) {
            return { brand: { $in: value } };
          }
          return { brand: { $regex: value, $options: "i" } };
        },

        category: (value) => ({ category: value }),

        sizes: (value) => {
          let sizesArray = value;

          if (typeof value === "string") {
            try {
              sizesArray = JSON.parse(value);
            } catch (e) {
              sizesArray = [value];
            }
          }

          if (!Array.isArray(sizesArray)) {
            sizesArray = [sizesArray];
          }

          return {
            sizes: {
              $elemMatch: {
                size: { $in: sizesArray },
                quantity: { $gt: 0 }
              }
            }
          };
        },

      };

      Object.entries(filters).forEach(([key, value]) => {
        if (
          filterMap[key] &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          const result = filterMap[key](value, query);

          console.log(
            "🚀 ~ Object.entries ~ Object.assign(query, result):",
            Object.assign(query, result)
          );

          if (result) Object.assign(query, result);
        }
      });
    },
  }
);

export const getProductsByPayloadClient = BaseController.getDataByPayload(
  productModel,
  {
    searchFields: ["name", "description"],
    filters: async (query, filters) => {
      const filterMap = {
        priceMin: (value, q) => {
          q.price = q.price || {};
          q.price.$gte = parseFloat(value);
          delete query.priceMin;
        },

        priceMax: (value, q) => {
          q.price = q.price || {};
          q.price.$lte = parseFloat(value);
          delete query.priceMax;
        },

        brand: (value) => ({
          brand: { $regex: value, $options: "i" },
        }),

        category: (value) => ({ category: value }),

        sizes: (value) => {
          let sizesArray = value;

          if (typeof value === "string") {
            try {
              sizesArray = JSON.parse(value);
            } catch (e) {
              sizesArray = [value];
            }
          }

          if (!Array.isArray(sizesArray)) {
            sizesArray = [sizesArray];
          }

          return {
            sizes: {
              $elemMatch: {
                size: { $in: sizesArray },
                quantity: { $gt: 0 }
              }
            }
          };
        },


      };

      query.status = true;

      Object.entries(filters).forEach(([key, value]) => {
        if (
          filterMap[key] &&
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          const result = filterMap[key](value, query);
          if (result) Object.assign(query, result);
        }
      });
    },
  }
);
