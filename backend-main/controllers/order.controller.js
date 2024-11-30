const OrderDetail = require("../models/order_detail.model");
const orderService = require("../services/order.service");
const userService = require("../services/user.service");

const getAllOrders = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findAll();
    res.json(orderDetail);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// const createOrder = async (req, res) => {
//   try {
//     let { start_time, ...orderData } = req.body;

//     // Lấy thông tin người dùng từ token (hoặc cookie, session)
//     const user = await userService.getUserByUserName(req.user.username); // Cập nhật nếu có thay đổi trong xác thực

//     // Tạo order mới
//     const newOrder = await orderService.createOrder({
//       customer_id: user.id,
//       time: start_time,
//       ...orderData,
//     });

//     // Tính toán start_time và end_time cho reservation
//     const startTime = newOrder.time;
//     const endTime = new Date(startTime);
//     endTime.setMinutes(endTime.getMinutes() + process.env.END_TIME_OFFSET_MINUTES || 120); // Cộng thêm thời gian từ env

//     // Kiểm tra bàn trống trong khoảng thời gian người dùng chọn
//     const availableOrders = await orderService.checkAvailableTables(startTime, endTime);

//     if (availableOrders && availableOrders.length > 0) {
//       // Chọn một bàn trống (ví dụ bàn đầu tiên)
//       const order_id = availableOrders[0].id;
//       console.log(availableOrders.id)
//       // Tạo reservation cho order vừa tạo
//       const reservationData = {
//         reservation_id: newOrder.id,
//         order_id: order_id,
//         start_time: startTime,
//       };

//       // Tạo reservation
//       await orderService.createReservation(reservationData);

//       // Trả về kết quả order đã tạo
//       res.status(201).json(newOrder);
//     } else {
//       // Nếu không có bàn trống
//       res.status(400).json({ error: 'No available orders for the selected time' });
//     }
//   } catch (error) {
//     console.error('Error creating order:', error); // In chi tiết lỗi
//     res.status(500).json({ error: 'Error creating order' });
//   }
// };

const createOrder = async (req, res) => {
  try {
    let { start_time, num_people, ...orderData } = req.body; // Số lượng khách

    // Tạo order mới
    const newOrder = await orderService.createOrder({
      customer_id: req.user.id,
      time: start_time,
      num_people, // Lưu số lượng khách vào order
      ...orderData,
    });

    // Tính toán start_time và end_time cho reservation
    const startTime = newOrder.time;
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + process.env.END_TIME_OFFSET_MINUTES || 120); // Cộng thêm thời gian từ env

    // Kiểm tra bàn trống trong khoảng thời gian người dùng chọn
    const availableTables = await orderService.checkAvailableTables(startTime, endTime);

    if (availableTables && availableTables.length > 0) {
      // Tính toán số bàn cần thiết để phục vụ tất cả khách
      let remainingPeople = num_people;
      let reservedTables = [];
      let totalCapacity = 0;

      // Duyệt qua các bàn có sẵn và tính tổng sức chứa
      for (let table of availableTables) {
        totalCapacity += table.capacity;

        if (remainingPeople > 0) {
          const peopleAssignedToTable = Math.min(remainingPeople, table.capacity);
          remainingPeople -= peopleAssignedToTable;
          reservedTables.push({
            reservation_id: newOrder.id,
            table_id: table.table_number,
            people_assigned: peopleAssignedToTable,
            start_time: startTime,
            end_time: endTime,
          });
        }

        if (remainingPeople <= 0) {
          break;
        }
      }

      // Kiểm tra nếu tổng sức chứa không đủ cho tất cả khách
      if (remainingPeople > 0) {
        // Không đủ bàn
        res.status(400).json({ error: 'Not enough available tables to seat all guests.' });
        return; // Không lưu vào DB
      }

      // Nếu đủ bàn, lưu thông tin reservation vào DB
      await orderService.createReservations(reservedTables);

      // Trả về kết quả order đã tạo
      res.status(201).json(newOrder);
    } else {
      // Nếu không có bàn trống
      res.status(400).json({ error: 'No available tables for the selected time' });
    }
  } catch (error) {
    console.error('Error creating order:', error); // In chi tiết lỗi
    res.status(500).json({ error: 'Error creating order' });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id, ...otherFields } = req.body; // Adjust as needed to accept relevant fields
    if (!id) {
      return res.status(400).send("Order number required.");
    }
    if (!otherFields || Object.keys(otherFields).length === 0) {
      return res.status(400).send("No fields to update.");
    }
    // Update the user information in the database
    const updatedOrder = await orderService.updateOrder(id, {
      ...otherFields, // Spread other fields if there are additional updates
    });

    if (!updatedOrder) {
      return res.status(404).send("Order not found!");
    }
    res.json({
      status: "SUCCESS",
      message: "Order updated successfully!",
      Order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating order" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
};
