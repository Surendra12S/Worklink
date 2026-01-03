const express = require("express");
const { protect } = require("../middlewares/authMiddleware.js");
const router = express.Router();
const { createRequest, getMyRequests, getHomeRequest } = require("../controllers/requestController.js");

router.post("/",protect,createRequest);
router.get("/my-posts",protect, getMyRequests);
router.get("/home", protect, getHomeRequest);
module.exports = router;