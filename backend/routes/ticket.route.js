import express from "express";

import moment from "moment";
import Accommodation from "../models/schemas/Accommodation.schema.js";
import Payment from "../models/schemas/payment.schema.js";
import Room from "../models/schemas/Room.schema.js";
import Ticket from "../models/schemas/Ticket.schema.js";
import User from "../models/schemas/user.schema.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            userId,
            accommodationId,
            rooms,
            fromDate,
            toDate,
            status,
            totalPrice,
        } = req.body;

        if (!userId || !accommodationId || !fromDate || !toDate || !totalPrice) {
            return res.status(400).json({ message: "Lỗi hệ thống thiếu thông tin" });
        }

        if (fromDate > toDate) {
            return res.status(400).json({ message: "Thời gian trả phòng cần lớn hơn thời gian nhận phòng" });
        }

        const accommodation = await Accommodation.findById(
            accommodationId,
        ).populate({
            path: "rooms",
            select: "name ownerId capacity quantity pricePerNight amenities",
        });
        if (!accommodation) {
            return res.status(404).json({ message: "Không tồn tại chỗ nghỉ" });
        }

        if (!rooms.length) {
            // Ensure accommodation type is [0, 1, 2]
            if (![1, 2, 3].includes(accommodation.type)) {
                return res.status(400).json({
                    message: "Cần lựa chọn phòng",
                });
            }
        } else {
            if ([0, 1, 2].includes(accommodation.type)) {
                return res.status(400).json({
                    message:
                        "Không chọn phòng với dạnh chỗ nghỉ nguyên căn",
                });
            }

            for (const { roomId, bookedQuantity } of rooms) {
                const room = accommodation.rooms.find(
                    (r) => r._id.toString() === roomId,
                );
                if (!room) {
                    return res.status(404).json({
                        message: `Không tồn tại phòng đang được tạo`,
                    });
                }

                const overlappingTickets = await Ticket.find({
                    accommodation: accommodationId,
                    rooms: { $elemMatch: { roomId } },
                    $or: [
                        { fromDate: { $lte: fromDate }, toDate: { $gte: toDate } },
                        { fromDate: { $gte: fromDate, $lte: toDate } },
                        { toDate: { $gte: fromDate, $lte: toDate } },
                    ],
                });

                const totalBookedQuantity = overlappingTickets.reduce((sum, ticket) => {
                    const roomBooking = ticket.rooms.find((r) => r.roomId === roomId);
                    return sum + (roomBooking?.bookedQuantity || 0);
                }, 0);

                const availableQuantity = room.quantity - totalBookedQuantity;
                if (availableQuantity < bookedQuantity) {
                    return res.status(400).json({
                        message: `Số lượng phòng ${room.name} còn lại không đủ. Chỉ còn ${availableQuantity} phòng.`,
                    });
                }
            }
        }

        const user = await User.findById(userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: 'Tài khoản không tồn tại, vui lòng đăng nhập' });
        }
        if (user.balance < totalPrice) {
            return res.status(400).json({
                message: 'Số dư không đủ, vui lòng nạp thêm tiền vào ví thanh toán',
            });
        }
        user.balance -= totalPrice;
        await user.save();
        const date = new Date()
        let orderId = moment(date).format('DDHHmmss');
        const newPayment = new Payment({
            txnRef: "O" + orderId,
            amount: totalPrice,
            userId,
            status: 1,
            description: 'Thanh toán đặt phòng ' + accommodation.name,
        });
        await newPayment.save();

        const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        const newPaymentAdmin = new Payment({
            txnRef: 'I' + orderId,
            amount: totalPrice,
            userId: admin._id,
            status: 1,
            description: 'Thanh toán đặt phòng ' + accommodation.name + ' cho ' + user.fullName,
        });
        await newPaymentAdmin.save();
        admin.balance += totalPrice;
        await admin.save()

        const newTicket = new Ticket({
            hostId: accommodation.ownerId,
            userId,
            accommodation: accommodationId,
            rooms: rooms,
            fromDate,
            toDate,
            status,
            totalPrice,
        });

        if (!newTicket.rooms?.length) {
            newTicket.bookedQuantity = 1;
        }

        const savedTicket = await newTicket.save();

        res.status(201).json({ ticket: savedTicket });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
});

router.patch("/:ticketId", async (req, res) => {
    const { ticketId } = req.params;
    const { isPaid, isConfirmed, isCanceled } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        let msg = "";
        // Handle payment logic
        if (isPaid) {
            msg = "PAID";
            // TODO: IMPLEMENT Payment function
            // await functionA(ticket); // Call functionA before updating payment status
            ticket.isPaid = isPaid;
        }

        // Handle cancellation logic
        if (isCanceled) {
            msg = "CANCELED";
            // TODO: IMPLEMENT Cancel function
            // await functionB(ticket); // Call functionB before updating cancellation status
            ticket.isCanceled = isCanceled;
        }

        // Handle confirmation logic
        if (isConfirmed) {
            msg = "CONFIRMED";
            ticket.isConfirmed = isConfirmed;
        }

        const updatedTicket = await ticket.save();
        res.status(200).json({
            message: `Ticket updated successfully: ${msg}`,
            ticket: updatedTicket,
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/reviews', async (req, res) => {
    try {
        const { userId, isShow } = req.query;
        let query = {
            star: { $gt: 0 },
        }
        if (userId) {
            query.userId = userId;
        }
        if (isShow) {
            query.isShow = true;
        }
        const reviews = await Ticket.find(query).populate('userId').populate('accommodation');

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: 'Error fetching reviews', error: error.message });
    }
});

router.get("/detail/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findById(id)
            .populate("userId", "name email")
            .populate("accommodation")


        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        const roomIds = ticket.rooms.map((room) => room.roomId);
        const roomDetails = await Room.find({ _id: { $in: roomIds } });
        const detailedRooms = ticket.rooms.map((room) => {
            const roomDetail = roomDetails.find((detail) => detail._id.toString() === room.roomId.toString());
            return {
                ...room.toObject(),
                ...roomDetail?.toObject(),
            };
        });

        res.status(200).json({
            ...ticket.toObject(),
            detailedRooms
        });
    } catch (error) {
        console.error("Error fetching ticket and rooms:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const { id, userId, status, keyword } = req.query;
        let query = {}
        if (id) {
            query.hostId = id
        }
        if (userId) {
            query.userId = userId
        }
        if (status) {
            query.status = status
        }
        const tickets = await Ticket.find(query).populate({
            path: 'userId',
            match: keyword
                ? {
                    $or: [
                        { email: { $regex: keyword, $options: "i" } },
                        { phone: { $regex: keyword, $options: "i" } }
                    ]
                }
                : {}
        }).populate('accommodation');
        const filteredTickets = tickets.filter(ticket => ticket.userId !== null);

        if (!filteredTickets) {
            return res.status(404).json({ message: "No ticket found" });
        }

        res.status(200).json(filteredTickets);
    } catch (error) {
        console.error("Error retrieving ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res
                .status(400)
                .json({ message: 'Status is required' });
        }
        const checkTicket = await Ticket.findById(id).populate('accommodation').populate('hostId');
        const now = new Date();
        const departureTime = new Date(checkTicket.fromDate);
        const twelveHours = 24 * 60 * 60 * 1000; // 12h
        if (now.getTime() - departureTime.getTime() > twelveHours) {
            return res
                .status(400)
                .json({ message: 'Không thể huỷ đặt phòng lúc này.' });
        }
        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        );
        if (!ticket) {
            return res.status(404).json({ message: 'Vẽ không tồn tại' });
        }
        const user = await User.findById(ticket.userId);
        if (!user) {
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });
        }
        const totalPrice = ticket.totalPrice
        let orderId = moment(now).format('DDHHmmss');
        if (status === 2) {

            user.balance += totalPrice;
            await user.save();
            const newPayment = new Payment({
                txnRef: 'I' + orderId,
                amount: totalPrice,
                userId: checkTicket.userId,
                status: 1,
                description: 'Hoàn tiền huỷ đặt phòng ' + checkTicket.accommodation.name,
            });
            await newPayment.save();

            const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
            const newPaymentAdmin = new Payment({
                txnRef: 'O' + orderId,
                amount: totalPrice,
                userId: admin._id,
                status: 1,
                description: 'Thanh toán hoàn tiền đặt phòng ' + checkTicket.accommodation.name + ' cho ' + user.name,
            });
            await newPaymentAdmin.save();
            admin.balance = admin.balance - totalPrice;
            await admin.save()
        }
        if (status === 3) {
            const admin = await User.findOne({ roles: ['admin'] });
            const newPaymentAdmin = new Payment({
                txnRef: "O" + orderId,
                amount: totalPrice * 0.8,
                userId: admin._id,
                status: 1,
                description: 'Thanh toán tiền cho lượt đặt phòng ' + checkTicket._id,
            });
            admin.balance -= totalPrice * 0.8;
            await admin.save();
            await newPaymentAdmin.save();

            const newPaymentHostOwner = new Payment({
                txnRef: "I" + orderId,
                amount: totalPrice * 0.8,
                userId: checkTicket.hostId._id,
                status: 1,
                description: 'Hệ thống thanh toán cho lượt đặt phòng ' + checkTicket._id,
            });
            const owner = await User.findById(checkTicket.hostId._id);
            if (!owner) {
                return res.status(404).json({ message: "Không tồn tại chủ chỗ nghỉ" });
            }
            owner.balance += totalPrice * 0.8;
            await owner.save();
            await newPaymentHostOwner.save();

        }

        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: 'Error updating ticket', error: error.message });
    }
});

router.post('/review/:ticketId', async (req, res) => {
    try {
        const { ticketId } = req.params;
        const { star, review } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res
                .status(404)
                .json({ message: 'Không tìm thấy thông tin đặt phòng' });
        }
        ticket.star = star;
        ticket.review = review;
        await ticket.save();

        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Xảy ra lỗi hệ thông', error: error.message });
    }
});
router.patch('/update-show/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { isShow } = req.body;

        const ticket = await Ticket.findByIdAndUpdate(
            id,
            { isShow },
            { new: true },
        );
        if (!ticket) {
            return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: 'Lỗi hệ thống', error: error.message });
    }
});

export default router;
