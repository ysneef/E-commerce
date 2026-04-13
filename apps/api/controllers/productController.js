import { productModel } from "../models/productModel.js";
import FlashSale from "../models/flashSaleModel.js";
import BaseController from "./BaseController.js";

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product does not exist" });
    }

    // Check all active flash sales
    const now = new Date();
    const activeSales = await FlashSale.find({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: true,
      "products.productId": product._id.toString(),
    });

    let productData = product.toObject ? product.toObject() : product;

    if (activeSales && activeSales.length > 0) {
      // Find the first campaign that has this product
      const activeSale = activeSales[0];
      const saleProduct = activeSale.products.find(
        (p) => p.productId === product._id.toString()
      );
      if (saleProduct) {
        const calculatedFlashPrice = productData.price - (productData.price * saleProduct.flashSalePercent / 100);
        productData.flashSaleInfo = {
          price: calculatedFlashPrice,
          endTime: activeSale.endTime,
          saleName: activeSale.name,
        };
      }
    }

    res.status(200).json({ success: true, data: productData });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while retrieving product",
      error: error.message,
    });
  }
};

const capitalize = (str) => {
  if (!str) return str;
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export const createProduct = async (req, res) => {
  try {
    let { price, discountPercent, category, brand, ...productData } = req.body;

    price = price ? parseFloat(price) : 0;
    discountPercent = discountPercent ? parseFloat(discountPercent) : 0;
    
    // Normalize casing for enums
    category = capitalize(category);
    brand = capitalize(brand);

    const discountPrice = price - (price * discountPercent) / 100;

    const newProduct = await productModel.create({
      price,
      discountPercent,
      discountPrice,
      category,
      brand,
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
    let { price, discountPercent, category, brand, ...updateData } = req.body;

    price = price !== undefined ? parseFloat(price) : undefined;
    discountPercent = discountPercent !== undefined ? parseFloat(discountPercent) : undefined;
    
    if (category) category = capitalize(category);
    if (brand) brand = capitalize(brand);

    // If either price or discountPercent is updated, recalculate discountPrice
    // Otherwise we need the original values, but for simplicity let's check if they exist in body
    if (price !== undefined || discountPercent !== undefined) {
      // Note: This logic assumes if one is sent, the other either is too or we use defaults
      // In a real app we might fetch the product first if one is missing
      const p = price !== undefined ? price : 0;
      const d = discountPercent !== undefined ? discountPercent : 0;
      updateData.discountPrice = p - (p * d) / 100;
    }

    const updatedProduct = await productModel.updateById(req.params.id, {
      price,
      discountPercent,
      category,
      brand,
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

      // Handle excludeFlashSale logic
      if (filters.excludeFlashSale === "true" || filters.excludeFlashSale === true) {
        const now = new Date();
        const activeSales = await FlashSale.find({
          startTime: { $lte: now },
          endTime: { $gte: now },
          status: true,
        });

        if (activeSales && activeSales.length > 0) {
          const saleProductIds = activeSales.reduce((acc, sale) => {
            return acc.concat(sale.products.map(p => p.productId));
          }, []);
          query._id = { $nin: saleProductIds };
        }
      }

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
    extraProcessing: async (results) => {
      const now = new Date();
      const activeSales = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: true,
      });

      if (!activeSales || activeSales.length === 0) return { data: results };

      const newData = results.map(product => {
        let productData = product.toObject ? product.toObject() : { ...product };
        
        // Check if this product belongs to any active sale
        for (const sale of activeSales) {
          const saleProduct = sale.products.find(
            (p) => p.productId === productData._id.toString()
          );

          if (saleProduct) {
            const calculatedFlashPrice = productData.price - (productData.price * saleProduct.flashSalePercent / 100);
            productData.flashSaleInfo = {
              price: calculatedFlashPrice,
              endTime: sale.endTime,
              flashSaleName: sale.name,
            };
            break; // Stop at first found flash sale
          }
        }
        return productData;
      });

      return { data: newData };
    }
  }
);
