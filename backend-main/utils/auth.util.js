const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;

const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);

const generateToken = async (payload, secretSignature, tokenLife) => {
  try {
    const result = await sign({ payload }, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife,
    });
    return result;
  } catch (error) {
    console.log(`Error in generate access token: ${error}`);
    return null;
  }
};

const verifyToken = async (token, secretSignature) => {
  try {
    const result = await verify(token, secretSignature, {
      algorithms: ["HS256"],
    });
    return result;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
