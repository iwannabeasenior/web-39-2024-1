const OrderDetail = require("../models/order_detail.model");
const ReservationTable = require("../models/reservation_table.model");

// 1. Cấu hình dotenv để đọc biến môi trường từ .env
require('dotenv').config();

// 2. Lấy giá trị thời gian từ môi trường, mặc định là 120 phút nếu không có giá trị
const reservationDurationMinutes = parseInt(process.env.TABLE_RESERVATION_DURATION_MINUTES) || 120;  // Giả sử 120 phút là giá trị mặc định

async function createOrder(orderData) {
  try {
    const newOrder = new OrderDetail({
      ...orderData,
    });

    // Lưu order mới vào cơ sở dữ liệu
    await newOrder.save();

    return newOrder; // Trả về order vừa được tạo
  } catch (error) {
    // Xử lý lỗi khi lưu vào cơ sở dữ liệu
    throw new Error("Error saving the order");
  }
}

// Hàm tạo đặt bàn
async function createReservation(reservationData) {
    try {
      const { reservation_id, table_id, start_time } = reservationData;
  
      // Tính toán thời gian kết thúc (end_time) từ start_time, cộng thêm thời gian lấy từ env
      const end_time = new Date(start_time);
      end_time.setMinutes(end_time.getMinutes() + reservationDurationMinutes); // Cộng thêm thời gian từ env (tính theo phút)
  
      // Tạo đối tượng reservation mới
      const newReservation = new ReservationTable({
        reservation_id,
        table_id,
        start_time,
        end_time,  // Cung cấp end_time
      });
  
      // Lưu order mới vào cơ sở dữ liệu và đợi kết quả
      await newReservation.save(); 
  
      return newReservation; // Trả về order vừa được tạo
    } catch (error) {
      // Xử lý lỗi khi lưu vào cơ sở dữ liệu
      console.error("Error details: ", error);  // In ra chi tiết lỗi
      throw new Error("Error saving the Reservation");
    }
  }

const updateTable = async (table_number, updatedData) => {
  // Tìm người dùng theo username
  const table = await TableInfo.findOne({ where: { table_number } });

  // Kiểm tra nếu người dùng tồn tại
  if (!table) {
    throw new Error("Table not found");
  }

  // Cập nhật thông tin người dùng
  Object.assign(table, updatedData);
  await table.save(); // Lưu cập nhật vào cơ sở dữ liệu

  return table;
};

async function getTableByTableNumber(table_number) {
  try {
    // Truy vấn cơ sở dữ liệu để tìm bản ghi có table_number tương ứng
    const table = await TableInfo.findOne({
      where: { table_number: table_number },
    });

    // Nếu không tìm thấy, trả về thông báo hoặc null
    if (!table) {
      return `Không tìm thấy bàn với số bàn: ${table_number}`;
    }

    // Trả về đối tượng table (TableInfo)
    return table;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Lỗi khi truy vấn:", error);
    throw error; // Ném lỗi ra ngoài
  }
}

module.exports = {
  createOrder,
  createReservation,
  updateTable,
  getTableByTableNumber,
};
