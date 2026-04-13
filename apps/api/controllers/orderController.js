import orderModel from "../models/orderModel.js";
import { productModel } from "../models/productModel.js";
import userModel from "../models/userModel.js";
import BaseController from "./BaseController.js";

import FlashSale from "../models/flashSaleModel.js";
import { sendOrderEmail } from "../utils/SendOrderEmail.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Product list cannot be empty!",
      });
    }

    const userInfo = await userModel.findById(userId);
    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist!" });
    }

    const now = new Date();
    const activeSale = await FlashSale.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      status: true,
    });

    let totalPrice = 0;
    let totalDiscount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await productModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} does not exist!`,
        });
      }

      const sizeExist = product.sizes.find(s => s.size === item.size);

      if (!sizeExist) {
        return res.status(400).json({
          success: false,
          message: `Size ${item.size} is not valid for product ${product.name}!`,
        });
      }

      if (sizeExist.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for size ${item.size}`
        });
      }

      sizeExist.quantity -= item.quantity;
      await product.save();

      let discountAmount = (product.price * product.discountPercent) / 100;
      let discountedPrice = product.price - discountAmount;
      let activeDiscountPercent = product.discountPercent;

      if (activeSale && activeSale.products?.length > 0) {
        const saleProduct = activeSale.products.find(
          (p) => p.productId === product._id.toString()
        );
        if (saleProduct) {
          discountedPrice = product.price - (product.price * saleProduct.flashSalePercent / 100);
          discountAmount = product.price - discountedPrice;
          activeDiscountPercent = 0; // Or whatever signifies a flash sale in frontend
        }
      }

      const itemTotal = discountedPrice * item.quantity;

      totalPrice += itemTotal;
      totalDiscount += discountAmount * item.quantity;

      processedItems.push({
        _id: product._id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: product.price,
        discountPercent: activeDiscountPercent,
        discountPrice: discountedPrice,
        totalPrice: itemTotal,
        size: item.size,
      });
    }
    console.log("🚀 ~ createOrder ~ processedItems:", processedItems);

    const newOrder = await orderModel.create({
      user: {
        _id: userInfo._id,
        phone: userInfo.phone,
        userName: userInfo.userName,
        email: userInfo.email,
        avatar: userInfo.avatar,
      },
      items: processedItems,
      totalPrice,
      discount: totalDiscount,
      shippingAddress,
      paymentMethod,
    });

    if (newOrder) {
      userInfo.order.push(newOrder._id);
      userInfo.cart = [];
      await userInfo.save();

      // Send Order Confirmation Email
      sendOrderEmail(userInfo.email, userInfo.userName, 'CREATED', newOrder).catch(console.error);
    }

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while creating order",
      error: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderModel.updateById(req.params.id, req.body);

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exist" });
    }

    // If order status was updated, notify the user via email
    if (req.body.status && updatedOrder.user && updatedOrder.user.email) {
      sendOrderEmail(updatedOrder.user.email, updatedOrder.user.userName, 'STATUS_UPDATED', updatedOrder).catch(console.error);
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while updating order",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await orderModel.deleteById(req.params.id);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order does not exist" });
    }
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while deleting order",
      error: error.message,
    });
  }
};

export const getOrdersByPayload = BaseController.getDataByPayload(orderModel, {
  searchFields: ["user.userName", "user.phone", "user.email"],
});

export const getOrdersByUserId = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing id" });
    }

    const orders = await orderModel
      .findAll({ 'user._id': id })
      .sort({ createdAt: -1 });
    console.log("orders:", orders)
    if (!orders.length) {
      return res.status(200).json({
        success: true,
        data: [],
        moreInfo: { products: {}, users: {} },
      });
    }

    const productIds = orders.flatMap(
      (order) => order.items?.map((item) => item._id) || []
    );
    const uniqueProductIds = [...new Set(productIds)];

    const products = await productModel.findAll({
      _id: { $in: uniqueProductIds },
    });

    const moreInfo = {
      products: {},
    };

    products.forEach((product) => {
      moreInfo.products[product._id] = product;
    });

    res.status(200).json({ success: true, data: orders, moreInfo });
  } catch (error) {
    res.status(200).json({
      success: false,
      message: "Error while retrieving order list",
      error: error.message,
    });
  }
};
