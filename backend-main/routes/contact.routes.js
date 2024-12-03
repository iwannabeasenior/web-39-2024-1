
const express = require("express");
const { authenticateToken } = require("../middlewares/auth.middleware");
const router = express.Router();
const contactController = require("../controllers/contact.controller.js");

router.post('/create', authenticateToken, contactController.createContact);

router.get('/getAll', authenticateToken, contactController.getAllContacts);

module.exports = router;