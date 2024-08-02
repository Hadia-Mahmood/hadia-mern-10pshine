const express = require('express');
const router = express.Router();
const authenticate= require("../middleware/utilities");
const {createUser, userLogin } = require('../controllers/user.controllers');



router.route("/create-account").post( createUser)
router.route("/login").post(userLogin)


 
module.exports = router; 