const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/user.model");

// async function isUserExists({email, phone, username}) {

// }

async function isUserExists({ email, phone, username }) {
  const result = await User.findAll({
    where: {
      [Op.or]: [{ email: email }, { phone: phone }, { username: username }],
    },
  });
  return result.length > 0;
}

async function createUser(userData) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // Sử dụng User.create để lưu trực tiếp vào cơ sở dữ liệu và nhận lại đối tượng đã lưu
  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });

  return newUser.save(); // newUser sẽ bao gồm tất cả các thuộc tính từ cơ sở dữ liệu
}

module.exports = {
  isUserExists,
  createUser,
};
