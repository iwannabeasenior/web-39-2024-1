const OrderDetail = require("../models/order_detail.model");
const orderService = require("../services/order.service");
const userService = require("../services/user.service");

const getAllOrders = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findAll();
    res.json(orderDetail);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tables" });
  }
};

const createOrder = async (req, res) => {
  let { ...orderData } = req.body;
  
  try {
    // Lấy thông tin người dùng
    const user = await userService.getUserByUserName(req.user.username);

    // Tạo order mới
    const newOrder = await orderService.createOrder({ customer_id: user.id, ...orderData });

    // Tạo reservation cho order vừa tạo
    const reservationData = {
      reservation_id: newOrder.id,
      table_id: 1, // Giả sử bạn đang cố gắng đặt bàn với ID là 1
      start_time: newOrder.time,
    };

    // Đợi cho việc tạo reservation hoàn tất
    await orderService.createReservation(reservationData);

    // Trả về kết quả order đã tạo
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);  // In chi tiết lỗi
    res.status(500).json({ error: "Error creating order" });
  }
};


// const updateTable = async (req, res) => {
//   try {
//     const { table_number, ...otherFields } = req.body; // Adjust as needed to accept relevant fields
//     if (!table_number) {
//       return res.status(400).send("Order number required.");
//     }
//     if (!otherFields || Object.keys(otherFields).length === 0) {
//       return res.status(400).send("No fields to update.");
//     }
//     // Update the user information in the database
//     const updatedTable = await tableService.updateTable(table_number, {
//       ...otherFields, // Spread other fields if there are additional updates
//     });

//     if (!updatedTable) {
//       return res.status(404).send("Order not found!");
//     }
//     res.json({
//       status: "SUCCESS",
//       message: "Order updated successfully!",
//       Order: updatedTable,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating order" });
//   }
// };

// const tableInfo = async (req, res) => {
//   try {
//     const { ...otherFields } = req.body; // Adjust as needed to accept relevant fields

//     if (!otherFields || Object.keys(otherFields).length === 0) {
//       return res.status(400).send("No fields to update.");
//     }

//     // Update the user information in the database
//     const updatedUser = await userService.updateUser(req.user.username, {
//       ...otherFields, // Spread other fields if there are additional updates
//     });

//     if (!updatedUser) {
//       return res.status(404).send("User not found!");
//     }
//     res.json({
//       status: "SUCCESS",
//       message: "User updated successfully!",
//       user: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching order" });
//   }
// };

// const deleteTable = async (req, res) => {
//   try {
//     console.log(req.body.table_number)
//     const order = await tableService.getTableByTableNumber(req.body.table_number);
//     console.log(order)
//     if (order) {
//       await order.destroy();
//       res.json({ message: "Order deleted" });
//     } else {
//       res.status(404).json({ error: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting order" });
//   }
// };

module.exports = {
  getAllOrders,
  createOrder,
};
