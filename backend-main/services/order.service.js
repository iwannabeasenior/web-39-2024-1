const { Op } = require("sequelize");
const sequelize = require("../config/db.config");

const OrderDetail = require("../models/order_detail.model");
const ReservationTable = require("../models/reservation_table.model");
const TableInfo = require("../models/table_info.model");

// 1. Cấu hình dotenv để đọc biến môi trường từ .env
require("dotenv").config();

// 2. Lấy giá trị thời gian từ môi trường, mặc định là 120 phút nếu không có giá trị
const reservationDurationMinutes =
  parseInt(process.env.TABLE_RESERVATION_DURATION_MINUTES) || 120; // Giả sử 120 phút là giá trị mặc định

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

// Hàm kiểm tra xem có bàn nào trống trong khoảng thời gian người dùng chọn
const checkAvailableTables = async (startTime, endTime) => {
  try {
    // Chuyển startTime và endTime sang dạng chuỗi ISO chuẩn
    const startTimeFormatted = new Date(startTime).toISOString();
    const endTimeFormatted = new Date(endTime).toISOString();

    // Tìm các bàn trống trong khoảng thời gian từ startTime đến endTime
    const availableTables = await TableInfo.findAll({
      where: {
        table_number: {
          [Op.notIn]: sequelize.literal(`
            (SELECT table_id 
            FROM reservation_table
            WHERE start_time < '${endTimeFormatted}' AND end_time > '${startTimeFormatted}')
          `),
        },
      },
    });

    // Kiểm tra và trả về danh sách các bàn trống nếu có
    // console.log("Số bàn trống:", availableTables.length);
    // console.log(availableTables);
    return availableTables.length > 0 ? availableTables : null;
  } catch (error) {
    console.error("Error checking available tables:", error);
    throw error;
  }
};

// Hàm tạo đặt bàn
// async function createReservation(reservationData) {
//   try {
//     const { reservation_id, table_id, start_time } = reservationData;

//     // Tính toán thời gian kết thúc (end_time) từ start_time, cộng thêm thời gian lấy từ env
//     const end_time = new Date(start_time);
//     end_time.setMinutes(end_time.getMinutes() + reservationDurationMinutes); // Cộng thêm thời gian từ env (tính theo phút)

//     // Tạo đối tượng reservation mới
//     const newReservation = new ReservationTable({
//       reservation_id,
//       table_id,
//       start_time,
//       end_time, // Cung cấp end_time
//     });

//     // Lưu reservation mới vào cơ sở dữ liệu
//     await newReservation.save();

//     return newReservation; // Trả về reservation vừa được tạo
//   } catch (error) {
//     console.error("Error creating reservation:", error);
//     throw new Error("Error saving the Reservation");
//   }
// }

async function createReservations(reservedTables) {
  try {
    // Kiểm tra nếu không có bàn nào trong reservedTables
    if (!reservedTables || reservedTables.length === 0) {
      throw new Error('No tables to reserve');
    }

    // Tạo danh sách các reservation từ dữ liệu reservedTables
    const createdReservations = [];

    // Lặp qua từng bàn trong reservedTables và tạo reservation
    for (let reservationData of reservedTables) {
      const { reservation_id, table_id, start_time, people_assigned } = reservationData;

      // Tính toán thời gian kết thúc (end_time) từ start_time, cộng thêm thời gian lấy từ env
      const end_time = new Date(start_time);
      end_time.setMinutes(end_time.getMinutes() + parseInt(process.env.RESERVATION_DURATION_MINUTES) || 120); // Cộng thêm thời gian từ env (tính theo phút)



      // Kiểm tra xem bàn có đủ sức chứa cho số người đã phân bổ không

      // const userObject = await User.findOne({
      //   where: {
      //     username: user.payload.username,
      //   },
      // });  
      const table = await TableInfo.findOne({
        where: {
          table_number: table_id,
        }
      }); // Lấy thông tin bàn từ cơ sở dữ liệu
      if (!table) {
        throw new Error(`Table with number ${table_id} not found`);
      }

      if (table.capacity < people_assigned) {
        throw new Error(`Table ${table_id} does not have enough capacity for ${people_assigned} people`);
      }

      // Tạo đối tượng reservation mới
      const newReservation = new ReservationTable({
        reservation_id,
        table_id,
        start_time,
        end_time, // Cung cấp end_time
        people_assigned,
      });

      // Lưu reservation mới vào cơ sở dữ liệu
      await newReservation.save();
      createdReservations.push(newReservation); // Thêm reservation vừa tạo vào danh sách

    }

    // Trả về danh sách các reservation đã tạo
    return createdReservations;

  } catch (error) {
    console.error("Error creating reservations:", error);
    throw new Error("Error saving the Reservations");
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
  createReservations,
  checkAvailableTables,
  updateTable,
  getTableByTableNumber,
};
