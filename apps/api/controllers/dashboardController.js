import mongoose from "mongoose";

export const getDashboard = async (req, res) => {
  try {
    // Tổng số user role "user"
    const totalUsers = await mongoose.connection
      .collection("users")
      .countDocuments({ role: "user" });

    // Lấy tất cả order
    const orders = await mongoose.connection
      .collection("orders")
      .find({})
      .toArray();

    // Tổng số order
    const totalOrders = orders.length;

    // Tổng doanh thu
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    // ===== Revenue by Month =====
    const monthlyRevenueMap = {};
    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyRevenueMap[monthKey]) monthlyRevenueMap[monthKey] = 0;
      monthlyRevenueMap[monthKey] += order.totalPrice || 0;
    });

    const monthlyRevenue = Object.keys(monthlyRevenueMap)
      .sort()
      .map((month) => ({
        month,
        value: monthlyRevenueMap[month],
      }));

    // ===== Top Products =====
    const productMap = {}; // {_id: { name, quantity, revenue } }

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item._id.toString();
        if (!productMap[id]) {
          productMap[id] = {
            _id: id,
            name: item.name,
            quantity: 0,
            revenue: 0,
          };
        }
        productMap[id].quantity += item.quantity;
        productMap[id].revenue += item.totalPrice || 0;
      });
    });

    // Chuyển thành mảng và sắp xếp theo quantity giảm dần
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // top 10 sản phẩm

    res.status(200).json({
      users: totalUsers,
      orders: totalOrders,
      revenue: totalRevenue,
      monthlyRevenue,
      topProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
