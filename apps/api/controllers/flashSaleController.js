import FlashSale from "../models/flashSaleModel.js";

const flashSaleController = {
  createFlashSale: async (req, res) => {
    try {
      const data = new FlashSale(req.body);
      const result = await data.save();
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getAllFlashSales: async (req, res) => {
    try {
      const results = await FlashSale.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  getActiveFlashSale: async (req, res) => {
    try {
      const now = new Date();
      const results = await FlashSale.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: true,
      }).populate("products.productId");
      
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateFlashSale: async (req, res) => {
    try {
      const result = await FlashSale.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteFlashSale: async (req, res) => {
    try {
      await FlashSale.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Flash Sale deleted successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default flashSaleController;
