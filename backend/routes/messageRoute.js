const express = require('express');
const { newMessage, getMessages, deleteMsg } = require('../controllers/messageController');
const { isAuthenticated } = require('../middlewares/auth');

const router = express();

router.route("/newMessage").post(isAuthenticated, newMessage);
router.route("/messages/:chatId").get(isAuthenticated, getMessages);
router.route("/message/delete/:chatId").delete(deleteMsg);

module.exports = router;