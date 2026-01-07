const Application = require("../models/Application.js");
const Request = require("../models/Request.js");

const applyToRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const helperId = req.user.id; // From your auth middleware

        // 1. Check if requestId is provided
        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" });
        }

        // 2. Check if the Request exists
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // 3. Prevent applying to own request
        // .toString() is needed because createdBy is an ObjectId
        if (request.createdBy.toString() === helperId) {
            return res.status(400).json({ message: "You cannot apply to your own request" });
        }

        // 4. Check if request is still 'open'
        if (request.status !== "open") {
            return res.status(400).json({ message: "This request is no longer accepting applications" });
        }

        // 5. Prevent duplicate applications
        const existingApplication = await Application.findOne({ 
            requestId, 
            helperId 
        });
        
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this request" });
        }

        // 6. Create the Application
        const newApplication = await Application.create({
            requestId,
            helperId,
            status: "pending" // though default is pending, being explicit is fine
        });

        res.status(201).json({
            message: "Application sent successfully",
            data: newApplication
        });

    } catch (error) {
        console.error("Apply API Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// GET /api/applications/my-applications
const getMyApplications = async (req, res) => {
    try {
        const helperId = req.user.id; // Step 1: From auth middleware

        // Step 2 & 3: Find applications and "JOIN" (populate) Request details
        const applications = await Application.find({ helperId })
            .populate({
                path: "requestId",
                select: "title location category status" // Only get what the frontend needs
            })
            .sort({ createdAt: -1 }); // Step 4: Latest first

        // Step 5: Send the array
        res.status(200).json(applications);

    } catch (error) {
        console.error("Fetch My Applications Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// GET /api/applications/request/:requestId
const getRequestApplicants = async (req, res) => {
    try {
        const { requestId } = req.params; // Step 2: Get ID from URL
        const ownerId = req.user.id;      // Step 1: From auth middleware

        // Step 3: Check if request exists
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Step 4: Authorization Check - Only the owner can see applicants
        if (request.createdBy.toString() !== ownerId) {
            return res.status(403).json({ 
                message: "Unauthorized: You are not the owner of this request" 
            });
        }

        // Step 5 & 6: Fetch apps + Populate Helper info (name/email only)
        const applicants = await Application.find({ requestId })
            .populate("helperId", "name email") 
            .sort({ createdAt: -1 }); // Step 7: Latest first

        // Step 8: Send response
        res.status(200).json(applicants);

    } catch (error) {
        console.error("Fetch Applicants Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const acceptApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const ownerId = req.user.id; // Step 1

        // Step 2: Check if application exists
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Step 3: Fetch the related request
        const request = await Request.findById(application.requestId);
        if (!request) {
            return res.status(404).json({ message: "Related request not found" });
        }

        // Step 4: Authorization check
        if (request.createdBy.toString() !== ownerId) {
            return res.status(403).json({ message: "Unauthorized: You don't own this request" });
        }

        // Step 5: Check request status
        if (request.status !== "open") {
            return res.status(400).json({ message: "This request is no longer open" });
        }

        // Step 6: Check application status
        if (application.status !== "pending") {
            return res.status(400).json({ message: "This application is already processed" });
        }

        // Step 7: ACCEPT the selected application
        application.status = "accepted";
        await application.save();

        // Step 8: REJECT all other applications for the same request
        await Application.updateMany(
            { 
                requestId: request._id, 
                _id: { $ne: applicationId } // $ne means "Not Equal"
            },
            { status: "rejected" }
        );

        // Step 9: Update request status
        request.status = "in_progress";
        await request.save();

        // Step 10: Send response
        res.status(200).json({ message: "Application accepted and request locked" });

    } catch (error) {
        console.error("Accept Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const ownerId = req.user.id;

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: "Application not found" });

        const request = await Request.findById(application.requestId);
        if (request.createdBy.toString() !== ownerId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        application.status = "rejected";
        await application.save();

        res.status(200).json({ message: "Application rejected" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { 
    applyToRequest, 
    getMyApplications, 
    getRequestApplicants,
    acceptApplication,
    rejectApplication // Don't forget to export!
};
