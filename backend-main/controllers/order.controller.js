const OrderDetail = require("../models/order_detail.model");
const orderService = require("../services/order.service");
const userService = require("../services/user.service");
const sequelize = require("../config/db.config"); // Đảm bảo import sequelize để sử dụng transaction

const getAllOrders = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findAll();
    res.json(orderDetail);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// const createOrder = async (req, res) => {
//   const transaction = await sequelize.transaction(); // Khởi tạo transaction
//   try {
//     let { start_time, num_people, ...orderData } = req.body; // Số lượng khách

//     // Tạo order mới trong transaction
//     const newOrder = await orderService.createOrder(
//       {
//         customer_id: req.user.id,
//         time: start_time,
//         num_people, // Lưu số lượng khách vào order
//         ...orderData,
//       },
//       { transaction } // Pass transaction vào trong service
//     );

//     // Tính toán start_time và end_time cho reservation
//     const startTime = newOrder.time;
//     const endTime = new Date(startTime);
//     endTime.setMinutes(endTime.getMinutes() + process.env.END_TIME_OFFSET_MINUTES || 120); // Cộng thêm thời gian từ env

//     // Kiểm tra bàn trống trong khoảng thời gian người dùng chọn
//     const availableTables = await orderService.checkAvailableTables(startTime, endTime);

//     if (availableTables && availableTables.length > 0) {
//       // Tính toán số bàn cần thiết để phục vụ tất cả khách
//       let remainingPeople = num_people;
//       let reservedTables = [];
//       let totalCapacity = 0;

//       // Duyệt qua các bàn có sẵn và tính tổng sức chứa
//       for (let table of availableTables) {
//         totalCapacity += table.capacity;

//         if (remainingPeople > 0) {
//           const peopleAssignedToTable = Math.min(remainingPeople, table.capacity);
//           remainingPeople -= peopleAssignedToTable;
//           reservedTables.push({
//             reservation_id: newOrder.id,
//             table_id: table.table_number,
//             people_assigned: peopleAssignedToTable,
//             start_time: startTime,
//             end_time: endTime,
//           });
//         }

//         if (remainingPeople <= 0) {
//           break;
//         }
//       }

//       // Kiểm tra nếu tổng sức chứa không đủ cho tất cả khách
//       if (remainingPeople > 0) {
//         // Không đủ bàn
//         await transaction.rollback(); // Rollback transaction nếu không đủ bàn
//         res.status(400).json({ error: 'Not enough available tables to seat all guests.' });
//         return; // Không lưu vào DB
//       }

//       // Nếu đủ bàn, lưu thông tin reservation vào DB
//       await orderService.createReservations(reservedTables, { transaction }); // Pass transaction vào trong service

//       // Commit transaction khi tất cả các thao tác thành công
//       await transaction.commit();

//       // Trả về kết quả order đã tạo
//       res.status(201).json(newOrder);
//     } else {
//       // Nếu không có bàn trống
//       await transaction.rollback(); // Rollback transaction nếu không có bàn trống
//       res.status(400).json({ error: 'No available tables for the selected time' });
//     }
//   } catch (error) {
//     // Xử lý lỗi và rollback transaction
//     console.error('Error creating order:', error);
//     await transaction.rollback(); // Rollback transaction nếu có lỗi
//     res.status(500).json({ error: 'Error creating order' });
//   }
// };

const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction(); // Khởi tạo transaction
  try {
    let { start_time, num_people, items, ...orderData } = req.body; // Số lượng khách và danh sách các món hàng

    // Tạo order mới trong transaction
    const newOrder = await orderService.createOrder(
      {
        customer_id: req.user.id,
        time: start_time,
        num_people, // Lưu số lượng khách vào order
        ...orderData,
      },
      { transaction } // Pass transaction vào trong service
    );

    // Tính toán start_time và end_time cho reservation
    const startTime = newOrder.time;
    const endTime = new Date(startTime);
    endTime.setMinutes(
      endTime.getMinutes() + process.env.END_TIME_OFFSET_MINUTES || 120
    ); // Cộng thêm thời gian từ env

    // Kiểm tra bàn trống trong khoảng thời gian người dùng chọn
    const availableTables = await orderService.checkAvailableTables(
      startTime,
      endTime
    );

    if (availableTables && availableTables.length > 0) {
      // Tính toán số bàn cần thiết để phục vụ tất cả khách
      let remainingPeople = num_people;
      let reservedTables = [];
      let totalCapacity = 0;

      // Duyệt qua các bàn có sẵn và tính tổng sức chứa
      for (let table of availableTables) {
        totalCapacity += table.capacity;

        if (remainingPeople > 0) {
          const peopleAssignedToTable = Math.min(
            remainingPeople,
            table.capacity
          );
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
        await transaction.rollback(); // Rollback transaction nếu không đủ bàn
        res
          .status(400)
          .json({ error: "Not enough available tables to seat all guests." });
        return; // Không lưu vào DB
      }

      // Nếu đủ bàn, lưu thông tin reservation vào DB
      await orderService.createReservations(reservedTables, { transaction }); // Pass transaction vào trong service

      // Tạo item orders (mối quan hệ giữa món hàng và đơn hàng)
      let itemOrders = items.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
        order_id: newOrder.id,
      }));

      // Lưu thông tin vào bảng item_order
      await orderService.createItemOrders(itemOrders, { transaction });

      // Commit transaction khi tất cả các thao tác thành công
      await transaction.commit();

      // Trả về kết quả order đã tạo
      res.status(201).json(newOrder);
    } else {
      // Nếu không có bàn trống
      await transaction.rollback(); // Rollback transaction nếu không có bàn trống
      res
        .status(400)
        .json({ error: "No available tables for the selected time" });
    }
  } catch (error) {
    // Xử lý lỗi và rollback transaction
    console.error("Error creating order:", error);
    await transaction.rollback(); // Rollback transaction nếu có lỗi
    res.status(500).json({ error: "Error creating order" });
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
