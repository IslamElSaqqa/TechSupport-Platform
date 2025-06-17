const Specialist = require('../models/specialistModel')
const HelpSession = require('../models/helpSessionModel')
const User = require('../models/userModel')
const instaRefIdRegex = /^51\d{10}$/;
const { startOfDay, endOfDay, subDays } = require("date-fns");

// Private Access (user only can request a help session)
const createHelpSession = async (req, res) => {
    try {
        // Check if req.user exists and is a user (not a specialist)
        if (!req.user || req.user.user_presence === 1) {
            return res.status(403).json({
                error: "Only users can create a help session"
            });
        }

        const userId = req.user._id;
        const { specialist, instapay_reference, note, steps, description, image_url } = req.body;

        // Required field validation
        if (!steps || !description || !image_url || !instapay_reference) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        if (typeof instapay_reference === 'string' && !instaRefIdRegex.test(instapay_reference)) {
            return res.status(400).json({ error: "Invalid instapay reference ID" });
        }

        // Fetch user to embed in help session
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Construct session data
        const newSessionData = {
            user: {
                _id: foundUser._id,
                username: foundUser.username,
                phone_number: foundUser.phone_number,
            },
            instapay_reference,
            note,
            steps,
            description,
            image_url
        };

        // Optional: If specialist is provided, validate and embed
        if (specialist) {
            const foundSpecialist = await Specialist.findById(specialist);
            if (!foundSpecialist) {
                return res.status(404).json({ error: "Specialist not found" });
            }

            newSessionData.specialist = {
                _id: foundSpecialist._id,
                specialist_name: foundSpecialist.name,
                specialization: foundSpecialist.specialization,
                phone: foundSpecialist.phone_number,
                email: foundSpecialist.email
            };
        }

        // Create the HelpSession
        const newSession = await HelpSession.create(newSessionData);

        res.status(201).json({
            success: true,
            message: "Help session created successfully",
            data: newSession
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get All help sessions (Admin Access only)
const getAllHelpSessions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;     
        const limit = parseInt(req.query.limit) || 10; 
        const skip = (page - 1) * limit;
        const query = { status: "pending" }
        
        const total = await HelpSession.countDocuments(query);
        const sessions = await HelpSession.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user._id", "username")
            .populate("specialist._id", "specialist_name specialization");

        res.status(200).json({
            success: true,
            data: sessions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getEveryHelpSessions = async (req, res) => {
    try {
        const totalRequests = await HelpSession.countDocuments();
        const sessions = await HelpSession.find()
            .select('status type specialist._id specialist.specialist_name createdAt dayOfTheWeek')
            .sort({ createdAt: -1 })

        res.status(200).json({
            success: true,
            data: sessions,
            total: totalRequests
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getHelpSessionsByPeriod = async (req, res) => {
    try {
        const now = new Date();
        const fieldName = 'status';
        const valueToMatch = 'completed';

        const baseQuery = {
            [fieldName]: { $regex: new RegExp(`^${valueToMatch}$`, 'i') }
        };

        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);

        const sevenDaysAgo = subDays(now, 7);
        const thirtyDaysAgo = subDays(now, 30);

        const day = await HelpSession.find({
            ...baseQuery,
            createdAt: { $gte: todayStart, $lte: todayEnd }
        }).select('status specialist._id');

        const week = await HelpSession.find({
            ...baseQuery,
            createdAt: { $gte: sevenDaysAgo, $lte: now }
        }).select('status specialist._id');

        const month = await HelpSession.find({
            ...baseQuery,
            createdAt: { $gte: thirtyDaysAgo, $lte: now }
        }).select('status specialist._id');

        return res.status(200).json({
            success: true,
            data: {
                day,
                week,
                month
            }
        });
    } catch (error) {
        console.error("Error fetching help sessions:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getRequestsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const sort = req.query.sort === "desc" ? -1 : 1;

        const searchRegex = new RegExp(search, "i");

        const matchStage = {
        $match: {
            $or: [
            {
                $expr: {
                $regexMatch: {
                    input: { $toString: "$instapay_reference" },
                    regex: searchRegex
                }
                }
            },
            { "user.username": { $regex: searchRegex } },
            { "specialist.specialist_name": { $regex: searchRegex } }
            ]
        }
        };

        const pipeline = [
        matchStage,
        { $sort: { createdAt: sort } },
        { $skip: skip },
        { $limit: limit }
        ];

        const [requests, totalCount] = await Promise.all([
        HelpSession.aggregate(pipeline),
        HelpSession.aggregate([
            matchStage,
            { $count: "total" }
        ])
        ]);

        const totalRequests = totalCount[0]?.total || 0;

        res.status(200).json({
        status: "success",
        currentPage: page,
        totalPages: Math.ceil(totalRequests / limit),
        totalRequests,
        requests
        });
    } catch (error) {
        console.error("Error fetching help sessions:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

// Get a Single Help Session by ID 
// Access => (Authenticated User or Admin)
const getHelpSessionById = async (req, res) => {
    try {
        const session = await HelpSession.findById(req.params.id)
            .populate("user._id", "username")
            .populate("specialist._id", "specialist_name specialization");

        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Ensure the user requesting it is either the user involved or an admin
        if (req.user._id.toString() !== session.user._id.toString() && req.user.user_presence !== 1) {
            return res.status(403).json({ error: "Unauthorized to access this session" });
        }

        res.status(200).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

//   Update Help Session Status
// Admin or specialist access 
const updateHelpSessionStatus = async (req, res) => {
    try {
        const { status, end_time, duration, type, note, description } = req.body;
        const validStatuses = ["pending", "active", "completed", "canceled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        const session = await HelpSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Authorization logic
        let isAuthorized = false;

        // Case 1: Admin (via req.user)
        if (req.user && req.user.user_presence === 1) {
            isAuthorized = true;
        }

        else if (req.specialist) {
            const specialistId = String(req.specialist._id);
            const assignedSpecialistId = session.specialist?._id?.toString();

            if (assignedSpecialistId && specialistId === assignedSpecialistId) {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ error: "Only the assigned specialist or admin can update this session." });
        }

        // Perform update
        session.status = status;
        if (end_time) session.end_time = end_time;
        if (duration) session.duration = duration;
        if (type) session.type = type;
        if (note) session.note = note;
        if (description) session.description = description;

        await session.save();

        res.status(200).json({
            success: true,
            message: "Help session updated successfully",
            data: session
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};


// Delete a Help Session 
// Private Access => (Admin Only)
const deleteHelpSession = async (req, res) => {
    try {
        const session = await HelpSession.findByIdAndDelete(req.params.id)
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        res.status(200).json({ success: true, message: "Help session deleted successfully" });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateHelpSessionStatusBySpecialist = async (req, res) => {
    try {
        const { status, end_time, duration, type, note, description } = req.body;
        const validStatuses = ["pending", "active", "completed", "canceled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status update" });
        }

        const session = await HelpSession.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Authorization logic
        let isAuthorized = false;

        // Case 1: Admin
        if (req.user && req.user.user_presence === 1) {
            isAuthorized = true;
        }
        // Case 2: Specialist
        else if (req.specialist) {
            const specialistId = String(req.specialist._id);
            const assignedSpecialistId = session.specialist?._id?.toString();

            if (assignedSpecialistId && specialistId === assignedSpecialistId) {
                isAuthorized = true;
            }

            // If no specialist is currently assigned, assign this one (optional logic)
            if (!assignedSpecialistId || assignedSpecialistId === '') {
                // Embed the full specialist details from the DB
                const fullSpecialist = await Specialist.findById(specialistId);
                if (fullSpecialist) {
                    session.specialist = {
                        _id: fullSpecialist._id,
                        specialist_name: fullSpecialist.specialist_name,
                        specialization: fullSpecialist.specialization,
                        email: fullSpecialist.email,
                        phone: fullSpecialist.phone
                    };
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            return res.status(403).json({ error: "Only the assigned specialist or admin can update this session." });
        }

        // Perform update
        session.status = status;
        if (end_time) session.end_time = end_time;
        if (duration) session.duration = duration;
        if (type) session.type = type;
        if (note) session.note = note;
        if (description) session.description = description;

        await session.save();

        res.status(200).json({
            success: true,
            message: "Help session updated successfully",
            data: session
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getHelpSessionsByTechnician = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const status = req.query.status;
        const technicianId = req.query.technicianId;

        let query = {};

        // If status is provided and it's accepted/rejected, filter by technician
        if (status && (status === 'accepted' || status === 'rejected')) {
            query = {
                status: status,
                'specialist._id': technicianId
            };
        } else if (status && status !== 'all') {
            query.status = status;
        }

        const total = await HelpSession.countDocuments(query);
        const sessions = await HelpSession.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: sessions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Help Session Status and Assign Technician
const updateHelpSessionWithTechnician = async (req, res) => {
    try {
        const { status } = req.body;
        const sessionId = req.params.id;
        const technicianId = req.specialist._id;

        // Validate status
        const validStatuses = ["accepted", "rejected", "completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status. Must be 'accepted', 'rejected' or 'completed'" });
        }

        // Find the session
        const session = await HelpSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Get technician details
        const Specialist = require('../models/specialistModel');
        const technician = await Specialist.findById(technicianId);
        if (!technician) {
            return res.status(404).json({ error: "Technician not found" });
        }

        // Update session with status and technician info
        session.status = status;
        session.specialist = {
            _id: technician._id,
            specialist_name: technician.name,
            specialization: technician.specialization,
            email: technician.email,
            phone: technician.phone_number
        };

        await session.save();

        res.status(200).json({
            success: true,
            message: `Help session ${status} successfully`,
            data: session
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update Help Session Type (only by assigned technician)
const updateHelpSessionType = async (req, res) => {
    try {
        const { type } = req.body;
        const sessionId = req.params.id;
        const technicianId = req.specialist._id;

        // Validate type
        const validTypes = ["short", "long", ""];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: "Invalid type. Must be 'short', 'long', or empty string" });
        }

        // Find the session
        const session = await HelpSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Check if technician is assigned to this session
        if (!session.specialist || session.specialist._id.toString() !== technicianId.toString()) {
            return res.status(403).json({ error: "You can only change the type for sessions assigned to you" });
        }

        // Update type
        session.type = type;
        await session.save();

        res.status(200).json({
            success: true,
            message: "Help session type updated successfully",
            data: session
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Add Note to Help Session (only by assigned technician)
const addNoteToHelpSession = async (req, res) => {
    try {
        const { note } = req.body;
        const sessionId = req.params.id;
        const technicianId = req.specialist._id;

        if (!note || !note.trim()) {
            return res.status(400).json({ error: "Note content is required" });
        }

        // Find the session
        const session = await HelpSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ error: "Help session not found" });
        }

        // Check if technician is assigned to this session
        if (!session.specialist || session.specialist._id.toString() !== technicianId.toString()) {
            return res.status(403).json({ error: "You can only add notes to sessions assigned to you" });
        }

        // Create timestamp and format new note
        const timestamp = new Date().toISOString();
        const newNoteEntry = `[${timestamp}] [Technician: ${technicianId}] ${note.trim()}`;
        
        // Append to existing note or create new one
        session.note = session.note ? `${session.note}\n${newNoteEntry}` : newNoteEntry;
        
        await session.save();

        res.status(200).json({
            success: true,
            message: "Note added successfully",
            data: session
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};



module.exports = {
    createHelpSession,
    getAllHelpSessions,
    getHelpSessionById,
    updateHelpSessionStatus,
    updateHelpSessionStatusBySpecialist,
    deleteHelpSession,
    getRequestsPaginated,
    getEveryHelpSessions,
    getHelpSessionsByPeriod,
    getHelpSessionsByTechnician,
    updateHelpSessionWithTechnician,
    updateHelpSessionType,
    addNoteToHelpSession
}