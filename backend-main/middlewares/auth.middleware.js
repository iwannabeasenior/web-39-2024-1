require("dotenv").config();
const express = require("express");
const app = express();
const authUtil = require("../utils/auth.util");

app.use(express.json());

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access token required!");

  const user = await authUtil.verifyToken(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!user) {
    return res.status(400).send("Access token canot be used!");
  }
  next();
}

module.exports = {
  authenticateToken,
};
