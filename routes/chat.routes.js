const express = require("express");
const chatController = require('../controllers/chat.controller')
const { isArray } = require('../validations/validators')

const router = express.Router();
router.get("/", chatController.index);

router.get("/:id", chatController.show);
router.post("/", isArray, chatController.store);

router.patch("/:id", chatController.update);
router.delete("/:id", chatController.delete);
module.exports = router;