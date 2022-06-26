const express = require("express");
const messageController = require('../controllers/message.controller')
const { hasMessage } = require('../validations/validators')

const router = express.Router();
router.get("/chat/:chat", messageController.index);

router.get("/:id", messageController.show);
router.post("/", hasMessage, messageController.store);

router.patch("/:id", hasMessage, messageController.update);
router.delete("/:id", messageController.delete);
module.exports = router;