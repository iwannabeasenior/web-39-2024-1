const db = require("../config/db.config");

// Định nghĩa model cho bảng users
const User = {
  // Phương thức để tạo người dùng mới
  create: (newUser, result) => {
    const query = "INSERT INTO users SET ?";

    // Thực thi câu lệnh query với dữ liệu user mới
    db.query(query, newUser, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null); // Trả về lỗi nếu có
        return;
      }

      // Trả về kết quả nếu thành công (id của user vừa thêm)
      result(null, { id: res.insertId, ...newUser });
    });
  },
};

module.exports = User;
