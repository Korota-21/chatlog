const express = require("express");
const chatController = require('../controllers/chat.controller')

const router = express.Router();
router.get("/", chatController.index);

router.get("/:id", chatController.show);
router.post("/", chatController.store);

router.delete("/:id", chatController.delete);
module.exports = router;