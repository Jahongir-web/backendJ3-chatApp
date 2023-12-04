const express = require("express");
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware");
const userCtrl = require("../controller/userCtrl");

router.get('/', userCtrl.getAllUsers);
router.get('/:id', userCtrl.getUser);
router.put('/:id', authMiddleware, userCtrl.updateUser);
router.delete('/:id', authMiddleware, userCtrl.deleteUser);

module.exports = router