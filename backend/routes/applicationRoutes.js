const express = require("express");
const router = express.Router();
const { applyToRequest, getMyApplications, getRequestApplicants,acceptApplication,rejectApplication } = require("../controllers/applicationController.js");
const { protect } = require("../middlewares/authMiddleware.js"); // Your auth protector

router.post("/apply", protect, applyToRequest);
router.get("/my-applications",protect, getMyApplications);
router.get("/request/:requestId", protect, getRequestApplicants);
router.put("/accept/:applicationId", protect, acceptApplication);
router.put("/reject/:applicationId", protect, rejectApplication);

module.exports = router;