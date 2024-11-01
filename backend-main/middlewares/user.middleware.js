const { isUserExists } = require("../services/user.service");

// Middleware kiểm tra tính hợp lệ của dữ liệu đầu vào
const validateSignUpMiddleware = (req, res, next) => {
  const { role, name, address, bio, email, phone, username, password } =
    req.body;

  if (!name || !email || !phone || !username || !password) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name.trim())) {
    return res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w\.\-]+@([\w\-]+\.)+[\w\-]{2,4}$/.test(email.trim())) {
    return res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (password.trim().length < 8) {
    return res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  }

  next(); // Chuyển tiếp nếu dữ liệu hợp lệ
};

// Middleware kiểm tra xem người dùng đã tồn tại chưa
const checkUserExistsMiddleware = async (req, res, next) => {
  try {
    const { email, phone, username } = req.body;
    const userExists = await isUserExists({ email, phone, username });

    if (userExists) {
      return res.json({
        status: "FAILED",
        message:
          "User with the provided email, phone number, or username already exists",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.json({
      status: "FAILED",
      message: "An error occurred while checking for existing user!",
    });
  }
};

module.exports = {
  validateSignUpMiddleware,
  checkUserExistsMiddleware,
};
