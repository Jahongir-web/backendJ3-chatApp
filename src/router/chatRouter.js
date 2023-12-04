const express = require("express");
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware");
const chatCtrl = require("../controller/chatCtrl");

router.get('/', authMiddleware, chatCtrl.userChats);
router.get('/:firstId/:secondId', authMiddleware, chatCtrl.findChat);
router.delete('/:chatId', authMiddleware, chatCtrl.deleteChat);

module.exports = router