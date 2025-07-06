const RepairRequest = require("../model/repairRequest.model");
const Service = require("../model/service.model");
const Technician = require("../model/technician.model");
const { decodeToken } = require("../services/tokenDecode");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Helper function để tạo mã đơn hàng
const generateOrderCode = async () => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2); // 2024 -> 24
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // 01, 02, ..., 12
  const day = today.getDate().toString().padStart(2, "0"); // 01, 02, ..., 31

  const datePrefix = `RC${year}${month}${day}`; // RC240703

  // Tìm đơn hàng cuối cùng trong ngày để lấy số thứ tự
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const lastOrder = await RepairRequest.findOne({
    orderCode: { $regex: `^${datePrefix}` },
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  }).sort({ orderCode: -1 });

  let orderNumber = 1;
  if (lastOrder) {
    // Lấy 3 số cuối từ mã đơn hàng và tăng lên 1
    const lastNumber = parseInt(lastOrder.orderCode.slice(-3));
    orderNumber = lastNumber + 1;
  }

  // Format: RC240703001, RC240703002, ...
  const orderCode = `${datePrefix}${orderNumber.toString().padStart(3, "0")}`;

  return orderCode;
};

// Helper function để parse date từ nhiều format khác nhau
const parseDate = (dateString) => {
  console.log("Parsing date:", dateString, "type:", typeof dateString);

  if (!dateString) {
    throw new Error("Date string is required");
  }

  // Convert to string if needed
  const dateStr = dateString.toString().trim();

  // Handle different date formats
  let parts;
  let day, month, year;

  // Format: dd/mm/yyyy
  if (dateStr.includes("/")) {
    parts = dateStr.split("/");
    if (parts.length === 3) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      year = parseInt(parts[2], 10);
    }
  }
  // Format: dd-mm-yyyy
  else if (dateStr.includes("-")) {
    parts = dateStr.split("-");
    if (parts.length === 3) {
      // Check if it's dd-mm-yyyy or yyyy-mm-dd
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        day = parseInt(parts[2], 10);
      } else {
        // dd-mm-yyyy
        day = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
    }
  }
  // Format: yyyy-mm-dd (ISO format)
  else if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate;
    }
  }

  if (!day || !month === undefined || !year) {
    throw new Error(
      `Invalid date format: "${dateStr}". Expected formats: dd/mm/yyyy, dd-mm-yyyy, or yyyy-mm-dd`
    );
  }

  const resultDate = new Date(year, month, day);
  console.log("Parsed date result:", resultDate);

  // Validate the date
  if (isNaN(resultDate.getTime())) {
    throw new Error(
      `Invalid date: day=${day}, month=${month + 1}, year=${year}`
    );
  }

  return resultDate;
};

// Helper function để parse time từ format HH:mm - HH:mm và lấy thời gian bắt đầu
const parseTime = (timeString) => {
  console.log("Parsing time:", timeString, "type:", typeof timeString);

  if (!timeString) {
    throw new Error("Time string is required");
  }

  const timeStr = timeString.toString().trim();

  // Handle format: HH:mm - HH:mm
  if (timeStr.includes(" - ")) {
    const timeParts = timeStr.split(" - ");
    const startTime = timeParts[0].trim();
    const [hours, minutes] = startTime
      .split(":")
      .map((num) => parseInt(num, 10));

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error(`Invalid time format: "${startTime}". Expected HH:mm`);
    }

    return { hours, minutes };
  }
  // Handle format: HH:mm (single time)
  else if (timeStr.includes(":")) {
    const [hours, minutes] = timeStr.split(":").map((num) => parseInt(num, 10));

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      throw new Error(`Invalid time format: "${timeStr}". Expected HH:mm`);
    }

    return { hours, minutes };
  }

  throw new Error(
    `Invalid time format: "${timeStr}". Expected formats: HH:mm or HH:mm - HH:mm`
  );
};

// Helper function để tạo DateTime từ date và time
const createDateTime = (dateString, timeString) => {
  console.log("Creating DateTime from:", { dateString, timeString });

  const baseDate = parseDate(dateString);
  const timeInfo = parseTime(timeString);

  const dateTime = new Date(baseDate);
  dateTime.setHours(timeInfo.hours, timeInfo.minutes, 0, 0);

  console.log("Created DateTime:", dateTime);
  return dateTime;
};

// Helper function để kiểm tra technician có rảnh không
const checkTechnicianAvailability = async (
  technicianId,
  scheduledTime,
  duration
) => {
  if (!technicianId) {
    return { available: true }; // Nếu không chọn technician thì luôn available
  }

  // Tính thời gian kết thúc (duration + 30 phút di chuyển)
  const serviceEndTime = new Date(
    scheduledTime.getTime() + (duration + 30) * 60 * 1000
  );

  // Tìm tất cả booking của technician trong ngày đó
  const startOfDay = new Date(scheduledTime);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(scheduledTime);
  endOfDay.setHours(23, 59, 59, 999);

  const existingBookings = await RepairRequest.find({
    technician: technicianId,
    scheduledTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ["pending", "accepted", "in_progress"] },
  }).populate("service", "duration");

  // Kiểm tra conflict với từng booking hiện tại
  for (let booking of existingBookings) {
    const existingStart = new Date(booking.scheduledTime);
    const existingEnd = new Date(
      existingStart.getTime() + (booking.service.duration + 30) * 60 * 1000
    );

    // Kiểm tra overlap: booking mới bắt đầu trước khi booking cũ kết thúc VÀ
    // booking mới kết thúc sau khi booking cũ bắt đầu
    if (scheduledTime < existingEnd && serviceEndTime > existingStart) {
      return {
        available: false,
        conflictWith: {
          bookingId: booking._id,
          startTime: existingStart,
          endTime: existingEnd,
          serviceName: booking.service.name || "Unknown Service",
        },
      };
    }
  }

  return { available: true };
};

// Helper function để tìm khung giờ rảnh
// Helper function để xác định district liền kề
const isAdjacentDistrict = (district1, district2) => {
  // Mapping các district liền kề ở TP.HCM
  const adjacentMap = {
    "quận 1": ["quận 3", "quận 4", "quận 5", "quận 10"],
    "quận 2": ["quận 9", "thủ đức"],
    "quận 3": ["quận 1", "quận 10", "quận 11", "phú nhuận"],
    "quận 4": ["quận 1", "quận 7", "quận 8"],
    "quận 5": ["quận 1", "quận 6", "quận 8", "quận 10", "quận 11"],
    "quận 6": ["quận 5", "quận 8", "quận 11", "bình tân"],
    "quận 7": ["quận 4", "quận 8", "nhà bè"],
    "quận 8": ["quận 4", "quận 5", "quận 6", "quận 7", "bình chánh"],
    "quận 9": ["quận 2", "thủ đức"],
    "quận 10": ["quận 1", "quận 3", "quận 5", "quận 11", "phú nhuận"],
    "quận 11": ["quận 3", "quận 5", "quận 6", "quận 10", "tân bình"],
    "quận 12": ["gò vấp", "tân bình", "bình thạnh", "thủ đức"],
    "bình thạnh": ["quận 12", "phú nhuận", "gò vấp", "thủ đức"],
    "gò vấp": ["quận 12", "bình thạnh", "tân bình", "phú nhuận"],
    "phú nhuận": ["quận 3", "quận 10", "bình thạnh", "gò vấp", "tân bình"],
    "tân bình": ["quận 11", "quận 12", "gò vấp", "phú nhuận", "tân phú"],
    "tân phú": ["tân bình", "bình tân"],
    "bình tân": ["quận 6", "tân phú", "bình chánh"],
    "bình chánh": ["quận 8", "bình tân", "nhà bè"],
    "nhà bè": ["quận 7", "bình chánh"],
    "thủ đức": ["quận 2", "quận 9", "quận 12", "bình thạnh"],
  };

  // Normalize district names
  const dist1 = district1.toLowerCase().trim();
  const dist2 = district2.toLowerCase().trim();

  // Check if districts are adjacent
  const isAdjacent = adjacentMap[dist1]?.includes(dist2) || false;

  if (isAdjacent) {
    console.log(`🌆 Adjacent districts detected: ${dist1} <-> ${dist2}`);
  }

  return isAdjacent;
};

const findAvailableTimeSlots = async (
  requestedDateTime,
  serviceDuration,
  technicians
) => {
  const suggestions = [];
  const currentDate = new Date(requestedDateTime);

  // Tìm khung giờ trong 3 ngày tiếp theo
  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() + dayOffset);

    // Xác định giờ làm việc dựa trên ngày
    const isSunday = checkDate.getDay() === 0;
    const startHour = isSunday ? 8 : 7;
    const endHour = isSunday ? 17 : 21;

    // Kiểm tra các khung giờ trong ngày
    for (let hour = startHour; hour < endHour; hour++) {
      const timeSlot = new Date(checkDate);
      timeSlot.setHours(hour, 0, 0, 0);

      // Kiểm tra xem có technician nào rảnh trong khung giờ này không
      for (const tech of technicians) {
        const availabilityCheck = await checkTechnicianAvailability(
          tech._id,
          timeSlot,
          serviceDuration
        );

        if (availabilityCheck.available) {
          suggestions.push({
            date: timeSlot.toLocaleDateString("vi-VN"),
            time: `${hour.toString().padStart(2, "0")}:00`,
            datetime: timeSlot,
            availableTechnician: {
              id: tech._id,
              name: tech.name || "Kỹ thuật viên",
            },
          });
          break; // Tìm được 1 technician rảnh là đủ cho slot này
        }
      }

      // Tối đa 5 suggestions
      if (suggestions.length >= 5) break;
    }

    if (suggestions.length >= 5) break;
  }

  return suggestions;
};

// Helper function để tính điểm phân bổ technician
// Trọng số mới: Location(20%) + Workload(35%) + Rating(20%) + Experience(15%) + Fairness(7%) + Specialization(3%) = 100%
const calculateAssignmentScore = async (
  technician,
  scheduledDateTime,
  serviceId,
  customerDistrict = null
) => {
  let totalScore = 0;
  const breakdown = {};

  try {
    // 1. 🗺️ Location Score (20% trọng số) - Ưu tiên kỹ thuật viên cùng khu vực
    let locationScore = 5; // Mặc định nếu không có thông tin district

    if (customerDistrict && technician.district) {
      const customerDist = customerDistrict.toLowerCase().trim();
      const techDist = technician.district.toLowerCase().trim();

      if (customerDist === techDist) {
        locationScore = 20; // Cùng district: điểm tối đa
      } else if (isAdjacentDistrict(customerDist, techDist)) {
        locationScore = 15; // District liền kề: điểm cao
      } else {
        locationScore = 10; // District khác: điểm trung bình
      }
    }

    breakdown.location = {
      customerDistrict: customerDistrict,
      technicianDistrict: technician.district,
      score: locationScore,
    };
    totalScore += locationScore;

    console.log(
      `🗺️ Location scoring: Customer(${customerDistrict}) vs Technician(${technician.district}) = ${locationScore} points`
    );

    // 2. 📊 Workload Score (35% trọng số) - Càng ít booking hiện tại càng cao điểm
    const currentDate = new Date();
    const currentWorkload = await RepairRequest.countDocuments({
      technician: technician._id,
      status: { $in: ["pending", "accepted", "in_progress"] },
      scheduledTime: { $gte: currentDate },
    });

    // Điểm workload: tối đa 35 điểm, giảm 7 điểm cho mỗi booking
    const workloadScore = Math.max(0, 35 - currentWorkload * 7);
    breakdown.workload = { current: currentWorkload, score: workloadScore };
    totalScore += workloadScore;

    // 3. ⭐ Rating Score (20% trọng số) - Đánh giá trung bình từ khách hàng
    const ratingsData = await RepairRequest.aggregate([
      {
        $match: {
          technician: technician._id,
          "feedback.rating": { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$feedback.rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    let ratingScore = 12; // Default score nếu chưa có đánh giá
    if (ratingsData.length > 0) {
      const avgRating = ratingsData[0].avgRating;
      const totalRatings = ratingsData[0].totalRatings;
      // Điểm rating: avgRating * 4, bonus nếu có nhiều đánh giá
      ratingScore = Math.min(
        20,
        avgRating * 4 + Math.min(4, totalRatings * 0.4)
      );
    }

    breakdown.rating = {
      average: ratingsData[0]?.avgRating || 0,
      count: ratingsData[0]?.totalRatings || 0,
      score: ratingScore,
    };
    totalScore += ratingScore;

    // 4. 💼 Experience Score (15% trọng số) - Số booking đã hoàn thành
    const completedBookings = await RepairRequest.countDocuments({
      technician: technician._id,
      status: "completed",
    });

    // Điểm kinh nghiệm: tối đa 15 điểm
    const experienceScore = Math.min(15, completedBookings * 0.4);
    breakdown.experience = {
      completed: completedBookings,
      score: experienceScore,
    };
    totalScore += experienceScore;

    // 5. ⏰ Fairness Score (7% trọng số) - Lần cuối được phân công
    const lastAssignment = await RepairRequest.findOne({
      technician: technician._id,
      status: { $in: ["accepted", "completed", "in_progress"] },
    }).sort({ createdAt: -1 });

    let fairnessScore = 7; // Mặc định nếu chưa có booking nào
    if (lastAssignment) {
      const daysSinceLastAssignment =
        (currentDate - new Date(lastAssignment.createdAt)) /
        (1000 * 60 * 60 * 24);
      // Điểm công bằng: càng lâu không được phân công càng cao điểm
      fairnessScore = Math.min(7, daysSinceLastAssignment * 0.7);
    }

    breakdown.fairness = {
      lastAssignment: lastAssignment?.createdAt,
      daysSince: lastAssignment
        ? Math.floor(
            (currentDate - new Date(lastAssignment.createdAt)) /
              (1000 * 60 * 60 * 24)
          )
        : null,
      score: fairnessScore,
    };
    totalScore += fairnessScore;

    // 6. 🎯 Specialization Score (3% trọng số) - Chuyên môn với service
    let specializationScore = 2; // Mặc định
    if (technician.services && technician.services.length > 0) {
      // Nếu có specialization trong service này
      if (technician.services.some((s) => s.toString() === serviceId)) {
        specializationScore = 3;
      }
    }

    breakdown.specialization = { score: specializationScore };
    totalScore += specializationScore;

    console.log(`📊 Score calculation for ${technician._id}:`, breakdown);

    return {
      total: Math.round(totalScore * 10) / 10, // Làm tròn 1 chữ số thập phân
      breakdown: breakdown,
    };
  } catch (error) {
    console.error("Error calculating assignment score:", error);
    // Trả về điểm mặc định nếu có lỗi
    return {
      total: 50,
      breakdown: { error: "Could not calculate score", default: 50 },
    };
  }
};

// Helper function để phân công lại kỹ thuật viên
const reassignTechnician = async (booking) => {
  try {
    console.log(`🔄 Reassigning technician for booking ${booking._id}`);

    // Lấy thông tin địa chỉ để tìm district
    const addressParts = booking.address.split(",");
    const district =
      addressParts.length > 1
        ? addressParts[addressParts.length - 1].trim()
        : null;

    // Tìm tất cả kỹ thuật viên đủ điều kiện (trừ người đã từ chối)
    const availableTechnicians = await Technician.find({
      status: "active",
      depositStatus: "paid",
      _id: { $ne: booking.technician._id }, // Exclude current technician
      $or: [
        { services: { $in: [booking.service._id] } },
        { services: { $size: 0 } },
        { services: { $exists: false } },
      ],
    });

    console.log(
      `📋 Found ${availableTechnicians.length} potential technicians for reassignment`
    );

    if (availableTechnicians.length === 0) {
      // Không có kỹ thuật viên khác, đặt lại trạng thái pending
      booking.status = "pending";
      booking.technician = null;
      booking.confirmationTimeout = null;
      booking.confirmationAssignedAt = null;
      booking.timeline.push({
        status: "pending",
        description:
          "Không tìm thấy kỹ thuật viên khác, đơn hàng chờ phân công lại",
        createdAt: new Date(),
      });
      await booking.save();
      return { success: false, booking };
    }

    // Tính điểm cho các kỹ thuật viên có thể
    const availableTechsWithScore = [];
    for (const tech of availableTechnicians) {
      const availabilityCheck = await checkTechnicianAvailability(
        tech._id,
        booking.scheduledTime,
        booking.service.duration
      );

      if (availabilityCheck.available) {
        const score = await calculateAssignmentScore(
          tech,
          booking.scheduledTime,
          booking.service._id,
          district
        );
        availableTechsWithScore.push({
          technician: tech,
          score: score,
          details: score.breakdown,
        });
      }
    }

    if (availableTechsWithScore.length === 0) {
      // Không có kỹ thuật viên rảnh, đặt lại trạng thái pending
      booking.status = "pending";
      booking.technician = null;
      booking.confirmationTimeout = null;
      booking.confirmationAssignedAt = null;
      booking.timeline.push({
        status: "pending",
        description: "Không có kỹ thuật viên rảnh, đơn hàng chờ phân công lại",
        createdAt: new Date(),
      });
      await booking.save();
      return { success: false, booking };
    }

    // Sắp xếp và chọn kỹ thuật viên tốt nhất
    availableTechsWithScore.sort((a, b) => b.score.total - a.score.total);
    const bestTechnician = availableTechsWithScore[0];

    // Cập nhật booking với kỹ thuật viên mới
    booking.technician = bestTechnician.technician._id;
    booking.status = "pending_confirmation";
    booking.confirmationTimeout = new Date(Date.now() + 2 * 60 * 1000); // 2 phút mới
    booking.confirmationAssignedAt = new Date();
    booking.timeline.push({
      status: "pending_confirmation",
      description: `Đã phân công cho kỹ thuật viên khác. Vui lòng xác nhận trong 2 phút.`,
      createdAt: new Date(),
    });

    await booking.save();

    // Populate lại thông tin technician
    await booking.populate({
      path: "technician",
      populate: {
        path: "account",
        select: "fullName phone",
      },
    });

    console.log(
      `✅ Reassigned to technician ${bestTechnician.technician._id} with score ${bestTechnician.score.total}`
    );

    return { success: true, booking };
  } catch (error) {
    console.error("Error in reassignTechnician:", error);
    return { success: false, booking, error: error.message };
  }
};

// Helper function to extract district from address
const extractDistrict = (address) => {
  if (!address) return null;

  const districts = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Bình Thạnh",
    "Quận Gò Vấp",
    "Quận Tân Bình",
    "Quận Tân Phú",
    "Quận Phú Nhuận",
    "Quận Bình Tân",
    "Huyện Bình Chánh",
    "Huyện Hóc Môn",
    "Huyện Củ Chi",
    "Huyện Nhà Bè",
    "Huyện Cần Giờ",
    "Thành phố Thủ Đức",
  ];

  for (const district of districts) {
    if (address.includes(district)) {
      return district;
    }
  }

  return null;
};

// Helper function to format date and time for display
const formatDateTimeForDisplay = (dateTime) => {
  return new Date(dateTime).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const BookingController = {
  // Public API để lấy danh sách services
  getPublicServices: async (req, res) => {
    try {
      const services = await Service.find({ isActive: true })
        .select("name description category basePrice duration images")
        .sort({ category: 1, name: 1 });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách dịch vụ thành công",
        data: services,
      });
    } catch (error) {
      console.error("Error getting public services:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách dịch vụ",
        error: error.message,
      });
    }
  },

  createBooking: async (req, res) => {
    try {
      const {
        service,
        technician,
        date,
        time,
        notes,
        name,
        phone,
        address,
        district,
      } = req.body;
      console.log("Received booking request:", req.body);

      // Decode token để lấy user_id
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate các trường bắt buộc
      if (!service || !date || !time || !name || !phone || !address) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
          missing: {
            service: !service,
            date: !date,
            time: !time,
            name: !name,
            phone: !phone,
            address: !address,
          },
        });
      }

      // Validate phone number format
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Số điện thoại không hợp lệ",
          details:
            "Số điện thoại phải có định dạng: 03xxxxxxxx, 05xxxxxxxx, 07xxxxxxxx, 08xxxxxxxx, 09xxxxxxxx",
        });
      }

      // Validate name length
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Tên người đặt phải có từ 2-50 ký tự",
        });
      }

      // Validate address length
      if (address.length < 5 || address.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Địa chỉ phải có từ 5-200 ký tự",
        });
      }

      // Tạo scheduledTime từ date và time với xử lý format đúng
      let scheduledDateTime;
      try {
        scheduledDateTime = createDateTime(date, time);
        console.log(
          "Successfully created scheduledDateTime:",
          scheduledDateTime
        );
      } catch (error) {
        console.error("Error parsing date/time:", error);
        return res.status(400).json({
          success: false,
          message: "Format ngày giờ không hợp lệ",
          details: `Ngày nhận được: "${date}", Giờ nhận được: "${time}"`,
          expectedFormats:
            "Ngày: dd/mm/yyyy hoặc yyyy-mm-dd, Giờ: HH:mm hoặc HH:mm - HH:mm",
          error: error.message,
        });
      }

      // Kiểm tra thời gian đặt lịch phải trong tương lai (tối thiểu 30 phút)
      const now = new Date();
      const thirtyMinutesLater = new Date(now.getTime() + 30 * 60 * 1000);

      if (scheduledDateTime <= thirtyMinutesLater) {
        return res.status(400).json({
          success: false,
          message: "Thời gian đặt lịch phải cách ít nhất 30 phút từ hiện tại",
          details: `Thời gian hiện tại: ${now.toLocaleString("vi-VN")}`,
        });
      }

      // Kiểm tra thời gian làm việc (7:00 - 21:00)
      const workingHours = scheduledDateTime.getHours();
      if (workingHours < 7 || workingHours >= 21) {
        return res.status(400).json({
          success: false,
          message: "Thời gian đặt lịch phải trong giờ làm việc",
          details: "Giờ làm việc: 7:00 - 21:00 hàng ngày",
        });
      }

      // Chủ nhật có thể đặt lịch nhưng chỉ trong giờ hành chính (8:00 - 17:00)
      const dayOfWeek = scheduledDateTime.getDay();
      if (dayOfWeek === 0) {
        if (workingHours < 8 || workingHours >= 17) {
          return res.status(400).json({
            success: false,
            message: "Ngày Chủ nhật chỉ nhận lịch trong giờ hành chính",
            details: "Giờ làm việc Chủ nhật: 8:00 - 17:00",
          });
        }
      }

      // Validate notes length (nếu có)
      if (notes && notes.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Ghi chú không được vượt quá 500 ký tự",
        });
      }

      // Lấy thông tin service để biết duration
      const serviceInfo = await Service.findById(service);
      if (!serviceInfo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ",
        });
      }

      // Kiểm tra xem service có active không
      if (!serviceInfo.isActive) {
        return res.status(400).json({
          success: false,
          message: "Dịch vụ này hiện không khả dụng",
        });
      }

      // Kiểm tra giá dịch vụ hợp lệ
      if (!serviceInfo.basePrice || serviceInfo.basePrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Dịch vụ chưa có giá hoặc giá không hợp lệ",
        });
      }

      // Kiểm tra user không được đặt quá nhiều lần trong ngày
      const startOfDay = new Date(scheduledDateTime);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(scheduledDateTime);
      endOfDay.setHours(23, 59, 59, 999);

      const todayBookings = await RepairRequest.countDocuments({
        customer: decodedToken.id || decodedToken._id,
        scheduledTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "accepted", "in_progress"] },
      });

      if (todayBookings >= 5) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đặt quá nhiều lịch trong ngày",
          details: "Mỗi ngày chỉ được đặt tối đa 5 lịch hẹn",
        });
      }

      // Auto-assign technician logic
      let assignedTechnician = null;
      let candidateCount = 0;

      if (technician) {
        // Nếu có chọn technician cụ thể, validate
        const technicianExists = await Technician.findById(technician);
        if (!technicianExists) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy kỹ thuật viên",
          });
        }

        // Kiểm tra trạng thái kỹ thuật viên
        if (technicianExists.status !== "active") {
          return res.status(400).json({
            success: false,
            message: "Kỹ thuật viên này hiện không hoạt động",
          });
        }

        // Kiểm tra trạng thái cọc
        if (technicianExists.depositStatus !== "paid") {
          return res.status(400).json({
            success: false,
            message: "Kỹ thuật viên này chưa đóng đủ cọc để nhận đơn hàng",
          });
        }

        if (technicianExists.services && technicianExists.services.length > 0) {
          const canDoService = technicianExists.services.includes(service);
          if (!canDoService) {
            return res.status(400).json({
              success: false,
              message: "Kỹ thuật viên này không thể thực hiện dịch vụ đã chọn",
            });
          }
        }

        const availabilityCheck = await checkTechnicianAvailability(
          technician,
          scheduledDateTime,
          serviceInfo.duration
        );

        if (!availabilityCheck.available) {
          return res.status(409).json({
            success: false,
            message: "Kỹ thuật viên đã có lịch hẹn trong thời gian này",
            conflict: {
              message: `Xung đột với booking từ ${availabilityCheck.conflictWith.startTime.toLocaleTimeString(
                "vi-VN"
              )} đến ${availabilityCheck.conflictWith.endTime.toLocaleTimeString(
                "vi-VN"
              )}`,
              conflictBooking: availabilityCheck.conflictWith,
            },
            suggestions:
              "Vui lòng chọn thời gian khác hoặc để hệ thống tự động phân công kỹ thuật viên",
          });
        }

        assignedTechnician = technician;
      } else {
        // Tự động tìm kỹ thuật viên rảnh
        console.log("🔍 Auto-assigning technician...");

        // Tìm tất cả kỹ thuật viên đủ điều kiện làm service này
        const availableTechnicians = await Technician.find({
          status: "active", // Phải đang hoạt động
          depositStatus: "paid", // Phải đã đóng cọc
          $or: [
            { services: { $in: [service] } }, // Có service này trong danh sách
            { services: { $size: 0 } }, // Hoặc không giới hạn service (array rỗng)
            { services: { $exists: false } }, // Hoặc chưa set services
          ],
        });

        console.log(
          `📋 Found ${availableTechnicians.length} potential technicians`
        );

        // Tìm tất cả technician rảnh và tính điểm
        const availableTechsWithScore = [];

        for (const tech of availableTechnicians) {
          const availabilityCheck = await checkTechnicianAvailability(
            tech._id,
            scheduledDateTime,
            serviceInfo.duration
          );

          if (availabilityCheck.available) {
            // Tính điểm phân bổ cho technician này
            const score = await calculateAssignmentScore(
              tech,
              scheduledDateTime,
              service,
              district
            );
            availableTechsWithScore.push({
              technician: tech,
              score: score,
              details: score.breakdown,
            });

            console.log(
              `✅ Available technician: ${tech._id}, Score: ${score.total}`
            );
          }
        }

        // Chọn technician có điểm cao nhất với tie-breaker logic
        if (availableTechsWithScore.length > 0) {
          // Sắp xếp với multiple criteria để handle ties
          availableTechsWithScore.sort((a, b) => {
            // 1. So sánh điểm tổng
            if (b.score.total !== a.score.total) {
              return b.score.total - a.score.total;
            }

            // 2. TIE-BREAKER 1: Location (ưu tiên người cùng khu vực)
            if (
              b.score.breakdown.location.score !==
              a.score.breakdown.location.score
            ) {
              console.log(
                `🔀 Tie-breaker 1: Location score ${b.score.breakdown.location.score} vs ${a.score.breakdown.location.score}`
              );
              return (
                b.score.breakdown.location.score -
                a.score.breakdown.location.score
              );
            }

            // 3. TIE-BREAKER 2: Fairness (ưu tiên người lâu chưa làm việc)
            if (
              b.score.breakdown.fairness.score !==
              a.score.breakdown.fairness.score
            ) {
              console.log(
                `🔀 Tie-breaker 2: Fairness score ${b.score.breakdown.fairness.score} vs ${a.score.breakdown.fairness.score}`
              );
              return (
                b.score.breakdown.fairness.score -
                a.score.breakdown.fairness.score
              );
            }

            // 4. TIE-BREAKER 3: Workload (ưu tiên người ít việc hơn)
            if (
              b.score.breakdown.workload.score !==
              a.score.breakdown.workload.score
            ) {
              console.log(
                `🔀 Tie-breaker 3: Workload score ${b.score.breakdown.workload.score} vs ${a.score.breakdown.workload.score}`
              );
              return (
                b.score.breakdown.workload.score -
                a.score.breakdown.workload.score
              );
            }

            // 5. TIE-BREAKER 4: Rating (ưu tiên người có rating cao hơn)
            if (
              b.score.breakdown.rating.score !== a.score.breakdown.rating.score
            ) {
              console.log(
                `🔀 Tie-breaker 4: Rating score ${b.score.breakdown.rating.score} vs ${a.score.breakdown.rating.score}`
              );
              return (
                b.score.breakdown.rating.score - a.score.breakdown.rating.score
              );
            }

            // 6. TIE-BREAKER 5: Specialization (ưu tiên người có chuyên môn)
            if (
              b.score.breakdown.specialization.score !==
              a.score.breakdown.specialization.score
            ) {
              console.log(
                `🔀 Tie-breaker 5: Specialization ${b.score.breakdown.specialization.score} vs ${a.score.breakdown.specialization.score}`
              );
              return (
                b.score.breakdown.specialization.score -
                a.score.breakdown.specialization.score
              );
            }

            // 7. TIE-BREAKER 6: Random selection (fair random)
            console.log(
              `🎲 Final tie-breaker: Random selection between equal candidates`
            );
            return Math.random() - 0.5;
          });

          const bestTechnician = availableTechsWithScore[0];
          assignedTechnician = bestTechnician.technician._id;

          // Check nếu có tie và log thông tin
          const tiedCandidates = availableTechsWithScore.filter(
            (t) => t.score.total === bestTechnician.score.total
          );
          if (tiedCandidates.length > 1) {
            console.log(
              `⚖️ Had ${tiedCandidates.length} tied candidates with score ${bestTechnician.score.total}`
            );
            console.log(
              `🏆 Selected after tie-breaking: ${assignedTechnician}`
            );
            console.log(`🔀 Tie-breaker details:`, {
              selectedCandidate: bestTechnician.details,
              allTiedCandidates: tiedCandidates.map((t) => ({
                id: t.technician._id,
                score: t.score.total,
                location: t.score.breakdown.location.score,
                fairness: t.score.breakdown.fairness.score,
                workload: t.score.breakdown.workload.score,
                rating: t.score.breakdown.rating.score,
              })),
            });
          } else {
            console.log(
              `🏆 Clear winner: ${assignedTechnician} with score ${bestTechnician.score.total}`
            );
          }

          console.log(`📊 Final assignment details:`, bestTechnician.details);
          candidateCount = availableTechsWithScore.length;
        }

        // Nếu không có kỹ thuật viên nào rảnh, suggest khung giờ khác
        if (!assignedTechnician) {
          console.log("❌ No available technicians, finding suggestions...");

          const suggestions = await findAvailableTimeSlots(
            scheduledDateTime,
            serviceInfo.duration,
            availableTechnicians
          );

          return res.status(409).json({
            success: false,
            message: "Tất cả kỹ thuật viên đều bận trong khung giờ này",
            details:
              "Hiện tại không có kỹ thuật viên nào rảnh để thực hiện dịch vụ",
            suggestions: {
              message: "Vui lòng chọn một trong các khung giờ sau:",
              availableSlots: suggestions,
            },
          });
        }
      }

      // Tạo mã đơn hàng
      const orderCode = await generateOrderCode();
      console.log("Generated order code:", orderCode);

      // Tạo địa chỉ đầy đủ
      const fullAddress = district ? `${address}, ${district}` : address;

      // Tạo RepairRequest mới
      const newRepairRequest = new RepairRequest({
        orderCode: orderCode,
        customer: decodedToken.id || decodedToken._id,
        service: service,
        technician: assignedTechnician,
        description: notes || "",
        address: fullAddress,
        scheduledTime: scheduledDateTime,
        status: assignedTechnician ? "pending_confirmation" : "pending",
        price: {
          amount: serviceInfo.basePrice,
          currency: "VND",
        },
        confirmationTimeout: assignedTechnician
          ? new Date(Date.now() + 2 * 60 * 1000)
          : null,
        confirmationAssignedAt: assignedTechnician ? new Date() : null,
        timeline: [
          {
            status: assignedTechnician ? "pending_confirmation" : "pending",
            description: assignedTechnician
              ? `Đơn hàng ${orderCode} đã được tạo và phân công cho kỹ thuật viên. Vui lòng xác nhận trong 2 phút.`
              : `Đơn hàng ${orderCode} đã được tạo thành công. Đang tìm kỹ thuật viên phù hợp...`,
            createdAt: new Date(),
          },
        ],
      });

      // Lưu vào database
      const savedRequest = await newRepairRequest.save();

      // Populate thông tin chi tiết để trả về
      const populatedRequest = await RepairRequest.findById(savedRequest._id)
        .populate("customer", "fullName email phone")
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        });

      return res.status(200).json({
        success: true,
        message: assignedTechnician
          ? "Tạo yêu cầu sửa chữa thành công và đã phân công kỹ thuật viên"
          : "Tạo yêu cầu sửa chữa thành công",
        data: populatedRequest,
        autoAssigned: assignedTechnician ? true : false,
        assignmentInfo:
          assignedTechnician && !technician
            ? {
                method: "auto",
                reason:
                  "Hệ thống tự động chọn kỹ thuật viên phù hợp nhất dựa trên tải công việc, đánh giá và kinh nghiệm",
                selectionProcess:
                  candidateCount > 1
                    ? "intelligent_scoring_with_tie_breaker"
                    : "single_candidate",
              }
            : undefined,
      });
    } catch (error) {
      console.error("Error creating booking:", error);

      // Xử lý lỗi duplicate orderCode
      if (error.code === 11000 && error.keyPattern?.orderCode) {
        return res.status(500).json({
          success: false,
          message: "Lỗi hệ thống khi tạo mã đơn hàng. Vui lòng thử lại.",
          details: "Hệ thống đang bận, vui lòng thử lại sau ít phút",
        });
      }

      // Xử lý lỗi validation của MongoDB
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err) => err.message
        );
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ",
          details: validationErrors.join(", "),
        });
      }

      // Xử lý lỗi ObjectId không hợp lệ
      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message: "ID không hợp lệ",
          details: "Vui lòng kiểm tra lại thông tin dịch vụ hoặc kỹ thuật viên",
        });
      }

      // Xử lý lỗi kết nối database
      if (
        error.name === "MongoNetworkError" ||
        error.name === "MongoTimeoutError"
      ) {
        return res.status(503).json({
          success: false,
          message: "Lỗi kết nối cơ sở dữ liệu",
          details: "Vui lòng thử lại sau ít phút",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tạo yêu cầu sửa chữa",
        details: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  // Lấy danh sách booking của user hiện tại
  getUserBookings: async (req, res) => {
    try {
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      const { page = 1, limit = 10, status } = req.query;
      const skip = (page - 1) * limit;

      // Tạo filter query
      const filterQuery = { customer: decodedToken.id || decodedToken._id };
      if (status) {
        filterQuery.status = status;
      }

      const bookings = await RepairRequest.find(filterQuery)
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await RepairRequest.countDocuments(filterQuery);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách booking thành công",
        data: {
          bookings,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting user bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách booking",
        error: error.message,
      });
    }
  },

  // Lấy chi tiết một booking
  getBookingDetails: async (req, res) => {
    try {
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      const { bookingId } = req.params;

      const booking = await RepairRequest.findOne({
        _id: bookingId,
        customer: decodedToken.id || decodedToken._id,
      })
        .populate("customer", "fullName email phone address")
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy booking hoặc bạn không có quyền truy cập",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lấy chi tiết booking thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error getting booking details:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy chi tiết booking",
        error: error.message,
      });
    }
  },

  // Hủy booking
  cancelBooking: async (req, res) => {
    try {
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      const { bookingId } = req.params;
      const { reason } = req.body;

      const booking = await RepairRequest.findOne({
        _id: bookingId,
        customer: decodedToken.id || decodedToken._id,
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy booking hoặc bạn không có quyền truy cập",
        });
      }

      // Kiểm tra trạng thái có thể hủy không
      if (!["pending", "accepted"].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: "Không thể hủy booking ở trạng thái hiện tại",
        });
      }

      // Cập nhật trạng thái và thông tin hủy
      booking.status = "cancelled";
      booking.cancellation = {
        reason: reason || "Khách hàng hủy",
        cancelledAt: new Date(),
      };
      booking.timeline.push({
        status: "cancelled",
        description: `Booking đã được hủy. Lý do: ${
          reason || "Khách hàng hủy"
        }`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Hủy booking thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi hủy booking",
        error: error.message,
      });
    }
  },

  // API để kiểm tra thời gian rảnh của technician
  checkTechnicianAvailability: async (req, res) => {
    try {
      const { technicianId, date, time, serviceId } = req.query;

      if (!technicianId || !date || !time || !serviceId) {
        return res.status(400).json({
          success: false,
          message:
            "Vui lòng cung cấp đầy đủ thông tin: technicianId, date, time, serviceId",
        });
      }

      // Lấy thông tin service
      const serviceInfo = await Service.findById(serviceId);
      if (!serviceInfo) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy dịch vụ",
        });
      }

      // Tạo scheduledTime với xử lý format đúng
      let scheduledDateTime;
      try {
        scheduledDateTime = createDateTime(date, time);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Format ngày giờ không hợp lệ",
          details: `Ngày nhận được: "${date}", Giờ nhận được: "${time}"`,
          expectedFormats:
            "Ngày: dd/mm/yyyy hoặc yyyy-mm-dd, Giờ: HH:mm hoặc HH:mm - HH:mm",
          error: error.message,
        });
      }

      const availabilityCheck = await checkTechnicianAvailability(
        technicianId,
        scheduledDateTime,
        serviceInfo.duration
      );

      return res.status(200).json({
        success: true,
        message: availabilityCheck.available
          ? "Kỹ thuật viên có thể nhận lịch này"
          : "Kỹ thuật viên đã có lịch hẹn trong thời gian này",
        data: availabilityCheck,
      });
    } catch (error) {
      console.error("Error checking technician availability:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi kiểm tra lịch trình",
        error: error.message,
      });
    }
  },

  // API để tra cứu booking theo mã đơn hàng
  searchByOrderCode: async (req, res) => {
    try {
      const { orderCode } = req.params;

      if (!orderCode) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp mã đơn hàng",
        });
      }

      const booking = await RepairRequest.findOne({
        orderCode: orderCode.toUpperCase(),
      })
        .populate("customer", "fullName email phone address")
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng với mã này",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tìm thấy đơn hàng",
        data: booking,
      });
    } catch (error) {
      console.error("Error searching booking by order code:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi tra cứu đơn hàng",
        error: error.message,
      });
    }
  },
  getMyBookings: async (req, res) => {
    try {
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      const bookings = await RepairRequest.find({
        customer: decodedToken.id || decodedToken._id,
      })
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách booking thành công",
        data: bookings,
      });
    } catch (error) {
      console.error("Error getting my bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách booking",
        error: error.message,
      });
    }
  },

  // API để cập nhật trạng thái booking và timeline
  updateBookingStatus: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status, description } = req.body;

      // Validate status
      const validStatuses = [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "cancelled",
        "warranty_requested",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Trạng thái không hợp lệ",
        });
      }

      const booking = await RepairRequest.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Get status description
      const getStatusDescription = (status) => {
        const descriptions = {
          pending: "Đơn hàng đang chờ xử lý",
          accepted: "Kỹ thuật viên đã xác nhận và sẽ đến đúng giờ hẹn",
          in_progress: "Kỹ thuật viên đang thực hiện dịch vụ",
          completed: "Dịch vụ đã hoàn thành thành công",
          cancelled: "Đơn hàng đã được hủy",
          warranty_requested: "Yêu cầu bảo hành đã được gửi",
        };
        return descriptions[status] || "Trạng thái đã được cập nhật";
      };

      // Update booking status
      booking.status = status;

      // Add to timeline
      booking.timeline.push({
        status: status,
        description: description || getStatusDescription(status),
        createdAt: new Date(),
      });

      // Special handling for completion
      if (status === "completed") {
        booking.payment.status = "paid";
        booking.payment.paidAt = new Date();
        booking.commission.status = "eligible";
      }

      await booking.save();

      // Return updated booking with populated fields
      const updatedBooking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        });

      return res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái thành công",
        data: updatedBooking,
      });
    } catch (error) {
      console.error("Error updating booking status:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi cập nhật trạng thái",
        error: error.message,
      });
    }
  },

  // API để thêm ghi chú vào timeline
  addTimelineNote: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { note } = req.body;

      if (!note || note.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Ghi chú không được để trống",
        });
      }

      const booking = await RepairRequest.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Add note to timeline
      booking.timeline.push({
        status: booking.status,
        description: note.trim(),
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Thêm ghi chú thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error adding timeline note:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi thêm ghi chú",
        error: error.message,
      });
    }
  },

  // API để lấy danh sách đơn hàng của kỹ thuật viên
  getTechnicianBookings: async (req, res) => {
    try {
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Tìm technician theo account ID
      const technician = await Technician.findOne({
        account: decodedToken.id || decodedToken._id,
      });

      if (!technician) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin kỹ thuật viên",
        });
      }

      const { page = 1, limit = 20, status } = req.query;
      const skip = (page - 1) * limit;

      // Tạo filter query
      const filterQuery = { technician: technician._id };
      if (status) {
        filterQuery.status = status;
      }

      const bookings = await RepairRequest.find(filterQuery)
        .populate("customer", "fullName email phone address")
        .populate("service", "name description basePrice duration category")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone avatar",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await RepairRequest.countDocuments(filterQuery);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: {
          bookings,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalItems: total,
            itemsPerPage: parseInt(limit),
          },
        },
      });
    } catch (error) {
      console.error("Error getting technician bookings:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách đơn hàng",
        error: error.message,
      });
    }
  },

  // Technician confirms order (pending -> accepted)
  confirmOrder: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { notes } = req.body;

      // Decode token để lấy technician info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if technician is assigned to this booking
      if (
        !booking.technician ||
        booking.technician.account._id.toString() !== decodedToken.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in pending_confirmation status
      if (booking.status !== "pending_confirmation") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể xác nhận`,
        });
      }

      // Check if confirmation timeout has passed
      if (
        booking.confirmationTimeout &&
        new Date() > booking.confirmationTimeout
      ) {
        return res.status(400).json({
          success: false,
          message: "Thời gian xác nhận đã hết, đơn hàng sẽ được phân công lại",
        });
      }

      // Update status to accepted
      booking.status = "accepted";
      booking.confirmationTimeout = null; // Clear timeout
      booking.confirmationAssignedAt = null; // Clear assignment time
      booking.timeline.push({
        status: "accepted",
        description: notes
          ? `Kỹ thuật viên ${booking.technician.account.fullName} đã xác nhận đơn hàng. Ghi chú: ${notes}`
          : `Kỹ thuật viên ${booking.technician.account.fullName} đã xác nhận đơn hàng`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Xác nhận đơn hàng thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error confirming order:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xác nhận đơn hàng",
        error: error.message,
      });
    }
  },

  // Technician rejects order (pending_confirmation -> reassign)
  rejectOrder: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;

      // Decode token để lấy technician info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description duration")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if technician is assigned to this booking
      if (
        !booking.technician ||
        booking.technician.account._id.toString() !== decodedToken.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in pending_confirmation status
      if (booking.status !== "pending_confirmation") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể từ chối`,
        });
      }

      // Check if confirmation timeout has passed
      if (
        booking.confirmationTimeout &&
        new Date() > booking.confirmationTimeout
      ) {
        return res.status(400).json({
          success: false,
          message: "Thời gian xác nhận đã hết, đơn hàng đã được phân công lại",
        });
      }

      // Add rejection to timeline
      booking.timeline.push({
        status: "rejected",
        description: reason
          ? `Kỹ thuật viên ${booking.technician.account.fullName} đã từ chối đơn hàng. Lý do: ${reason}`
          : `Kỹ thuật viên ${booking.technician.account.fullName} đã từ chối đơn hàng`,
        createdAt: new Date(),
      });

      // Save rejection reason
      booking.rejectionReason = reason || "Không có lý do";

      // Try to reassign to another technician
      const reassignResult = await reassignTechnician(booking);

      if (reassignResult.success) {
        return res.status(200).json({
          success: true,
          message: "Đã từ chối đơn hàng và tìm được kỹ thuật viên khác",
          data: reassignResult.booking,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Đã từ chối đơn hàng, đang tìm kỹ thuật viên khác",
          data: reassignResult.booking,
        });
      }
    } catch (error) {
      console.error("Error rejecting order:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi từ chối đơn hàng",
        error: error.message,
      });
    }
  },

  // Technician starts repair (accepted -> in_progress)
  startRepair: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { notes, estimatedDuration } = req.body;

      // Decode token để lấy technician info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if technician is assigned to this booking
      if (
        !booking.technician ||
        booking.technician.account._id.toString() !== decodedToken.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in accepted status
      if (booking.status !== "accepted") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể bắt đầu sửa chữa`,
        });
      }

      // Update status to in_progress
      booking.status = "in_progress";

      let description = `Kỹ thuật viên ${booking.technician.account.fullName} đã bắt đầu sửa chữa`;
      if (estimatedDuration) {
        description += `. Thời gian dự kiến: ${estimatedDuration} phút`;
      }
      if (notes) {
        description += `. Ghi chú: ${notes}`;
      }

      booking.timeline.push({
        status: "in_progress",
        description: description,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Bắt đầu sửa chữa thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error starting repair:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi bắt đầu sửa chữa",
        error: error.message,
      });
    }
  },

  // Technician completes repair (in_progress -> completed)
  completeRepair: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { notes, finalPrice, partsUsed, workDescription } = req.body;

      // Decode token để lấy technician info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description commissionRate")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if technician is assigned to this booking
      if (
        !booking.technician ||
        booking.technician.account._id.toString() !== decodedToken.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in in_progress status
      if (booking.status !== "in_progress") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể hoàn thành`,
        });
      }

      // Update final price if provided
      if (finalPrice && finalPrice > 0) {
        booking.price.amount = finalPrice;
      }

      // Update status to pending customer confirmation
      booking.status = "pending_customer_confirmation";
      booking.payment.status = "pending"; // Customer needs to pay after confirmation

      // Set customer confirmation timeout (2 minutes)
      const now = new Date();
      const timeoutDate = new Date(now.getTime() + 2 * 60 * 1000); // 2 minutes

      booking.customerConfirmation = {
        confirmationTimeout: timeoutDate,
        confirmationAssignedAt: now,
      };

      // Calculate commission amount (but don't set as eligible yet)
      const commissionAmount =
        (booking.price.amount * booking.service.commissionRate) / 100;
      booking.commission = {
        status: "pending",
        amount: commissionAmount,
      };

      // Create completion description
      let description = `Kỹ thuật viên ${booking.technician.account.fullName} đã hoàn thành sửa chữa và chờ khách hàng xác nhận`;
      if (workDescription) {
        description += `. Công việc đã thực hiện: ${workDescription}`;
      }
      if (partsUsed) {
        description += `. Linh kiện đã sử dụng: ${partsUsed}`;
      }
      if (finalPrice) {
        description += `. Tổng chi phí: ${finalPrice.toLocaleString()} VNĐ`;
      }
      if (notes) {
        description += `. Ghi chú: ${notes}`;
      }

      booking.timeline.push({
        status: "pending_customer_confirmation",
        description: description,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Hoàn thành sửa chữa thành công, chờ khách hàng xác nhận",
        data: booking,
      });
    } catch (error) {
      console.error("Error completing repair:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi hoàn thành sửa chữa",
        error: error.message,
      });
    }
  },

  // Get technician's assigned orders
  getTechnicianOrders: async (req, res) => {
    try {
      const { status } = req.query;
      const { page = 1, limit = 10 } = req.query;

      // Decode token để lấy technician info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Find technician by account ID
      const technician = await Technician.findOne({ account: decodedToken.id });
      if (!technician) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy thông tin kỹ thuật viên",
        });
      }

      // Build query
      const query = { technician: technician._id };
      if (status) {
        query.status = status;
      }

      // Get orders with pagination
      const orders = await RepairRequest.find(query)
        .populate("customer", "fullName email phone")
        .populate("service", "name description basePrice")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await RepairRequest.countDocuments(query);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error getting technician orders:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách đơn hàng",
        error: error.message,
      });
    }
  },

  // Check and handle timeout confirmations
  checkTimeouts: async (req, res) => {
    try {
      const now = new Date();

      // Tìm tất cả booking đang chờ xác nhận và đã hết timeout
      const expiredBookings = await RepairRequest.find({
        status: "pending_confirmation",
        confirmationTimeout: { $lt: now },
      })
        .populate("service", "name description duration")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      console.log(`⏰ Found ${expiredBookings.length} expired confirmations`);

      const results = [];

      for (const booking of expiredBookings) {
        console.log(`⏰ Processing expired booking ${booking._id}`);

        // Thêm timeout event vào timeline
        booking.timeline.push({
          status: "timeout",
          description: `Kỹ thuật viên ${booking.technician.account.fullName} không phản hồi trong thời gian quy định`,
          createdAt: new Date(),
        });

        // Thử phân công lại
        const reassignResult = await reassignTechnician(booking);

        results.push({
          bookingId: booking._id,
          orderCode: booking.orderCode,
          previousTechnician: booking.technician.account.fullName,
          reassignSuccess: reassignResult.success,
          newTechnician: reassignResult.success
            ? reassignResult.booking.technician?.account?.fullName
            : null,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Đã xử lý ${expiredBookings.length} đơn hàng hết hạn xác nhận`,
        data: results,
      });
    } catch (error) {
      console.error("Error checking timeouts:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi kiểm tra timeout",
        error: error.message,
      });
    }
  },

  // Customer confirms completion (pending_customer_confirmation -> completed)
  confirmCompletion: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { rating, comment } = req.body;

      // Decode token để lấy customer info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description commissionRate")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if customer owns this booking
      if (booking.customer._id.toString() !== decodedToken.id) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in pending_customer_confirmation status
      if (booking.status !== "pending_customer_confirmation") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể xác nhận`,
        });
      }

      // Update status to completed
      booking.status = "completed";
      booking.payment.status = "pending"; // Customer needs to pay

      // Mark commission as eligible
      booking.commission.status = "eligible";

      // Save customer confirmation and clear timeout
      booking.customerConfirmation.confirmedAt = new Date();
      booking.customerConfirmation.satisfied = true;
      booking.customerConfirmation.confirmationTimeout = undefined;
      booking.customerConfirmation.confirmationAssignedAt = undefined;

      // Save feedback if provided
      if (rating || comment) {
        booking.feedback = {
          rating: rating || 5,
          comment: comment || "",
          createdAt: new Date(),
        };
      }

      // Add to timeline
      booking.timeline.push({
        status: "completed",
        description: `Khách hàng ${
          booking.customer.fullName
        } đã xác nhận hoàn thành công việc${
          rating ? ` và đánh giá ${rating} sao` : ""
        }`,
        createdAt: new Date(),
      });

      await booking.save();

      // Update technician stats
      await Technician.findByIdAndUpdate(booking.technician._id, {
        $inc: {
          completedJobs: 1,
          totalEarnings: booking.commission.amount,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Xác nhận hoàn thành thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error confirming completion:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xác nhận hoàn thành",
        error: error.message,
      });
    }
  },

  // Customer reports complaint (pending_customer_confirmation -> complaint)
  reportComplaint: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason, description } = req.body;

      // Validate input
      if (!reason || !description) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp lý do và mô tả khiếu nại",
        });
      }

      // Decode token để lấy customer info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if customer owns this booking
      if (booking.customer._id.toString() !== decodedToken.id) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in pending_customer_confirmation status
      if (booking.status !== "pending_customer_confirmation") {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể khiếu nại`,
        });
      }

      // Update status to pending admin review
      booking.status = "pending_admin_review";

      // Keep commission as pending (not eligible) until admin decides
      booking.commission.status = "pending";

      // Save customer complaint and clear timeout
      booking.customerConfirmation.confirmedAt = new Date();
      booking.customerConfirmation.satisfied = false;
      booking.customerConfirmation.complaintReason = reason;
      booking.customerConfirmation.complaintDescription = description;
      booking.customerConfirmation.confirmationTimeout = undefined;
      booking.customerConfirmation.confirmationAssignedAt = undefined;

      // Add to timeline
      booking.timeline.push({
        status: "pending_admin_review",
        description: `Khách hàng ${booking.customer.fullName} không hài lòng và tạo khiếu nại: ${reason}. Chờ admin duyệt.`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message:
          "Khiếu nại đã được ghi nhận. Chúng tôi sẽ xử lý trong thời gian sớm nhất.",
        data: booking,
      });
    } catch (error) {
      console.error("Error reporting complaint:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi ghi nhận khiếu nại",
        error: error.message,
      });
    }
  },

  // Customer cancels complaint (complaint -> completed)
  cancelComplaint: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { rating, comment } = req.body;

      // Decode token để lấy customer info
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      }

      // Validate bookingId
      if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "ID đơn hàng không hợp lệ",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description commissionRate")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if customer owns this booking
      if (booking.customer._id.toString() !== decodedToken.id) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền xử lý đơn hàng này",
        });
      }

      // Check if booking is in pending_admin_review or warranty_requested status
      if (
        !["pending_admin_review", "warranty_requested"].includes(booking.status)
      ) {
        return res.status(400).json({
          success: false,
          message: `Đơn hàng đang ở trạng thái '${booking.status}', không thể hủy khiếu nại`,
        });
      }

      // Update status to completed
      booking.status = "completed";
      booking.payment.status = "pending"; // Customer needs to pay

      // Mark commission as eligible
      booking.commission.status = "eligible";

      // Update customer confirmation and clear timeout
      booking.customerConfirmation.satisfied = true;
      booking.customerConfirmation.confirmedAt = new Date();
      booking.customerConfirmation.confirmationTimeout = undefined;
      booking.customerConfirmation.confirmationAssignedAt = undefined;
      // Clear complaint fields
      booking.customerConfirmation.complaintReason = undefined;
      booking.customerConfirmation.complaintDescription = undefined;

      // Save feedback if provided
      if (rating || comment) {
        booking.feedback = {
          rating: rating || 5,
          comment: comment || "",
          createdAt: new Date(),
        };
      }

      // Add to timeline
      booking.timeline.push({
        status: "completed",
        description: `Khách hàng ${
          booking.customer.fullName
        } đã hủy khiếu nại và xác nhận hoàn thành công việc${
          rating ? ` với đánh giá ${rating} sao` : ""
        }`,
        createdAt: new Date(),
      });

      await booking.save();

      // Update technician stats
      await Technician.findByIdAndUpdate(booking.technician._id, {
        $inc: {
          completedJobs: 1,
          totalEarnings: booking.commission.amount,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Hủy khiếu nại thành công và xác nhận hoàn thành",
        data: booking,
      });
    } catch (error) {
      console.error("Error canceling complaint:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi hủy khiếu nại",
        error: error.message,
      });
    }
  },

  // Check for customer confirmation timeouts and auto-complete orders
  checkCustomerConfirmationTimeouts: async (req, res) => {
    try {
      const now = new Date();

      // Find orders that are pending customer confirmation and have expired timeout
      const expiredOrders = await RepairRequest.find({
        status: "pending_customer_confirmation",
        "customerConfirmation.confirmationTimeout": { $lt: now },
      })
        .populate("customer", "fullName email phone")
        .populate("service", "name description commissionRate")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      console.log(
        `Found ${expiredOrders.length} expired customer confirmation orders`
      );

      for (const booking of expiredOrders) {
        try {
          // Auto-complete the order
          booking.status = "completed";
          booking.payment.status = "pending";

          // Mark commission as eligible
          booking.commission.status = "eligible";

          // Update customer confirmation
          booking.customerConfirmation.satisfied = true;
          booking.customerConfirmation.confirmedAt = new Date();

          // Add automatic completion to timeline
          booking.timeline.push({
            status: "completed",
            description: `Đơn hàng được tự động hoàn thành do khách hàng không xác nhận trong thời hạn 2 phút`,
            createdAt: new Date(),
          });

          await booking.save();

          // Update technician stats
          await Technician.findByIdAndUpdate(booking.technician._id, {
            $inc: {
              completedJobs: 1,
              totalEarnings: booking.commission.amount,
            },
          });

          console.log(
            `Auto-completed order ${booking.orderCode} due to customer confirmation timeout`
          );
        } catch (error) {
          console.error(
            `Error auto-completing order ${booking.orderCode}:`,
            error
          );
        }
      }

      return res.status(200).json({
        success: true,
        message: `Processed ${expiredOrders.length} expired customer confirmation orders`,
        data: { processedCount: expiredOrders.length },
      });
    } catch (error) {
      console.error("Error checking customer confirmation timeouts:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi kiểm tra timeout xác nhận khách hàng",
        error: error.message,
      });
    }
  },

  // Admin gets all complaints (both pending and processed)
  getAllComplaints: async (req, res) => {
    try {
      const { status } = req.query; // pending, processed, all

      let query = {
        "customerConfirmation.complaintReason": { $exists: true },
      };

      // Filter by status if provided
      if (status === "pending") {
        query.status = "pending_admin_review";
      } else if (status === "processed") {
        query["adminReview.reviewedAt"] = { $exists: true };
      }
      // If status is 'all' or not provided, get all complaints

      const complaints = await RepairRequest.find(query)
        .populate("customer", "fullName email phone")
        .populate("service", "name description")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách khiếu nại thành công",
        data: complaints,
      });
    } catch (error) {
      console.error("Error getting complaints:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách khiếu nại",
        error: error.message,
      });
    }
  },

  // Legacy function for backward compatibility - will be removed later
  getComplaintsPendingReview: async (req, res) => {
    try {
      const complaints = await RepairRequest.find({
        status: "pending_admin_review",
      })
        .populate("customer", "fullName email phone")
        .populate("service", "name description")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách khiếu nại thành công",
        data: complaints,
      });
    } catch (error) {
      console.error("Error getting complaints:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách khiếu nại",
        error: error.message,
      });
    }
  },

  // Admin reviews complaint (approve/reject)
  reviewComplaint: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const {
        decision,
        reason,
        assignedTechnicianId,
        scheduledDate,
        scheduledTime,
      } = req.body;

      // Validate input
      if (!decision || !["approved", "rejected"].includes(decision)) {
        return res.status(400).json({
          success: false,
          message: "Quyết định không hợp lệ (approved/rejected)",
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp lý do quyết định",
        });
      }

      // Additional validation for approved complaints
      if (decision === "approved") {
        if (!assignedTechnicianId) {
          return res.status(400).json({
            success: false,
            message: "Vui lòng chọn kỹ thuật viên cho việc bảo hành",
          });
        }

        if (!scheduledDate || !scheduledTime) {
          return res.status(400).json({
            success: false,
            message: "Vui lòng chọn ngày và giờ thực hiện bảo hành",
          });
        }
      }

      // Decode admin token
      const decodedToken = decodeToken(req.headers["authorization"]);
      if (!decodedToken || decodedToken.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Không có quyền truy cập",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("customer", "fullName email phone")
        .populate("service", "name description commissionRate")
        .populate({
          path: "technician",
          populate: {
            path: "account",
            select: "fullName phone",
          },
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      if (booking.status !== "pending_admin_review") {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng không ở trạng thái chờ duyệt",
        });
      }

      // Update admin review
      booking.adminReview = {
        reviewedBy: decodedToken.id,
        reviewedAt: new Date(),
        decision,
        reason,
      };

      if (decision === "approved") {
        // Store original technician info before reassigning
        const originalTechnicianId = booking.technician._id;
        const originalTechnicianName =
          booking.technician.account?.fullName || booking.technician.fullName;

        // If approved, create warranty request
        booking.status = "warranty_requested";
        booking.commission.status = "rejected"; // Original technician loses commission

        // Increase complaint count for ORIGINAL technician (the one being complained about)
        await Technician.findByIdAndUpdate(originalTechnicianId, {
          $inc: { complaintCount: 1 },
        });

        console.log(
          `🔸 Increased complaint count for original technician: ${originalTechnicianName} (ID: ${originalTechnicianId})`
        );

        // Check if original technician should be locked (5 complaints)
        const originalTechnician = await Technician.findById(
          originalTechnicianId
        );
        if (originalTechnician.complaintCount >= 5) {
          await Technician.findByIdAndUpdate(originalTechnicianId, {
            status: "banned",
            "lockInfo.isLocked": true,
            "lockInfo.lockReason": "Vượt quá số lần khiếu nại cho phép (5 lần)",
            "lockInfo.lockedAt": new Date(),
            "lockInfo.lockedBy": decodedToken.id,
          });

          // Add notification to timeline
          booking.timeline.push({
            status: "technician_banned",
            description: `Kỹ thuật viên ${originalTechnicianName} đã bị khóa tài khoản do vượt quá số lần khiếu nại cho phép`,
            createdAt: new Date(),
          });

          console.log(
            `🔒 Locked technician account: ${originalTechnicianName} (5+ complaints)`
          );
        }

        // Assign new technician if provided
        if (assignedTechnicianId) {
          // Validate new technician
          const newTechnician = await Technician.findById(assignedTechnicianId);
          if (!newTechnician) {
            return res.status(400).json({
              success: false,
              message: "Kỹ thuật viên được chọn không tồn tại",
            });
          }

          // Create new scheduled time for warranty
          const warrantyDateTime = createDateTime(scheduledDate, scheduledTime);

          // Check technician availability for warranty time
          const service = await Service.findById(booking.service);
          const serviceDuration = service ? service.duration : 120; // Default 2 hours

          const isAvailable = await checkTechnicianAvailability(
            assignedTechnicianId,
            warrantyDateTime,
            serviceDuration
          );

          if (!isAvailable) {
            return res.status(400).json({
              success: false,
              message:
                "Kỹ thuật viên đã có lịch trình khác trong thời gian này. Vui lòng chọn kỹ thuật viên khác hoặc thời gian khác.",
            });
          }

          booking.adminReview.assignedTechnician = assignedTechnicianId;
          booking.technician = assignedTechnicianId; // Assign new technician for warranty
          booking.scheduledTime = warrantyDateTime; // Set new scheduled time

          // Create commission for new technician
          booking.commission = {
            status: "pending",
            amount: booking.commission.amount, // Same commission amount
          };

          booking.timeline.push({
            status: "warranty_requested",
            description: `Admin đã duyệt khiếu nại. Kỹ thuật viên ${originalTechnicianName} bị tăng complaint count. Phân công kỹ thuật viên mới: ${
              newTechnician.account?.fullName || newTechnician.fullName
            }. Thời gian: ${formatDateTimeForDisplay(warrantyDateTime)}`,
            createdAt: new Date(),
          });

          console.log(
            `✅ Assigned new technician for warranty: ${
              newTechnician.account?.fullName || newTechnician.fullName
            } (ID: ${assignedTechnicianId})`
          );
        } else {
          booking.timeline.push({
            status: "warranty_requested",
            description: `Admin đã duyệt khiếu nại. Kỹ thuật viên ${originalTechnicianName} bị tăng complaint count. Chờ phân công kỹ thuật viên mới.`,
            createdAt: new Date(),
          });
        }
      } else {
        // If rejected, complete the order
        booking.status = "completed";
        booking.commission.status = "eligible"; // Technician gets commission
        booking.timeline.push({
          status: "completed",
          description: `Admin đã từ chối khiếu nại. Lý do: ${reason}`,
          createdAt: new Date(),
        });

        // Update technician stats
        await Technician.findByIdAndUpdate(booking.technician._id, {
          $inc: {
            completedJobs: 1,
            totalEarnings: booking.commission.amount,
          },
        });
      }

      await booking.save();

      return res.status(200).json({
        success: true,
        message: `Đã ${
          decision === "approved" ? "duyệt" : "từ chối"
        } khiếu nại`,
        data: booking,
      });
    } catch (error) {
      console.error("Error reviewing complaint:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xử lý khiếu nại",
        error: error.message,
      });
    }
  },

  // Get available technicians for warranty assignment
  getAvailableTechniciansForWarranty: async (req, res) => {
    try {
      const { serviceId, excludeTechnicianId, customerAddress } = req.query;

      console.log("🔍 getAvailableTechniciansForWarranty called with:", {
        serviceId,
        excludeTechnicianId,
        customerAddress,
      });

      const query = {
        status: "active",
        depositStatus: "paid",
        "lockInfo.isLocked": false,
      };

      // Exclude original technician
      if (excludeTechnicianId) {
        query._id = { $ne: excludeTechnicianId };
      }

      // Filter by service if provided
      if (serviceId) {
        query.$or = [
          { services: { $in: [serviceId] } },
          { services: { $size: 0 } },
          { services: { $exists: false } },
        ];
      }

      console.log("📋 Query filter:", query);

      let technicians = await Technician.find(query)
        .populate("account", "fullName phone")
        .select(
          "account fullName phone district experience rating completedJobs complaintCount services"
        )
        .sort({ rating: -1, completedJobs: -1 });

      console.log(
        `✅ Found ${technicians.length} technicians before location filtering`
      );

      // Filter by location if customer address is provided
      if (customerAddress) {
        const customerDistrict = extractDistrict(customerAddress);
        console.log("📍 Customer district:", customerDistrict);

        if (customerDistrict) {
          // Sort by location priority: same district first, then adjacent districts
          technicians = technicians.sort((a, b) => {
            const aSameDistrict = a.district === customerDistrict ? 1 : 0;
            const bSameDistrict = b.district === customerDistrict ? 1 : 0;

            if (aSameDistrict !== bSameDistrict) {
              return bSameDistrict - aSameDistrict; // Same district first
            }

            const aAdjacent = isAdjacentDistrict(a.district, customerDistrict)
              ? 1
              : 0;
            const bAdjacent = isAdjacentDistrict(b.district, customerDistrict)
              ? 1
              : 0;

            if (aAdjacent !== bAdjacent) {
              return bAdjacent - aAdjacent; // Adjacent districts next
            }

            // If same location priority, sort by rating and completed jobs
            if (a.rating !== b.rating) {
              return b.rating - a.rating;
            }

            return b.completedJobs - a.completedJobs;
          });
        }
      }

      // Format the response data to ensure proper field mapping
      const formattedTechnicians = technicians.map((tech) => ({
        _id: tech._id,
        fullName: tech.account?.fullName || tech.fullName,
        phone: tech.account?.phone || tech.phone,
        district: tech.district,
        experience: tech.experience,
        rating: tech.rating,
        completedJobs: tech.completedJobs,
        complaintCount: tech.complaintCount,
      }));

      console.log("🎯 Final technicians list:", formattedTechnicians);

      return res.status(200).json({
        success: true,
        message: "Lấy danh sách kỹ thuật viên thành công",
        data: formattedTechnicians,
      });
    } catch (error) {
      console.error("❌ Error getting available technicians:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy danh sách kỹ thuật viên",
        error: error.message,
      });
    }
  },

  // Get technician complaint statistics
  getTechnicianComplaintStats: async (req, res) => {
    try {
      const stats = await Technician.aggregate([
        {
          $group: {
            _id: null,
            totalTechnicians: { $sum: 1 },
            activeTechnicians: {
              $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            lockedTechnicians: {
              $sum: { $cond: ["$lockInfo.isLocked", 1, 0] },
            },
            totalComplaints: { $sum: "$complaintCount" },
            avgComplaintCount: { $avg: "$complaintCount" },
          },
        },
      ]);

      const topComplaintTechnicians = await Technician.find({
        complaintCount: { $gt: 0 },
      })
        .populate("account", "fullName phone")
        .select("fullName phone complaintCount completedJobs status lockInfo")
        .sort({ complaintCount: -1 })
        .limit(10);

      return res.status(200).json({
        success: true,
        message: "Lấy thống kê khiếu nại thành công",
        data: {
          stats: stats[0] || {
            totalTechnicians: 0,
            activeTechnicians: 0,
            lockedTechnicians: 0,
            totalComplaints: 0,
            avgComplaintCount: 0,
          },
          topComplaintTechnicians,
        },
      });
    } catch (error) {
      console.error("Error getting complaint stats:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy thống kê khiếu nại",
        error: error.message,
      });
    }
  },

  // Get available time slots for a technician on a specific date
  getAvailableTimeSlots: async (req, res) => {
    try {
      const { technicianId, date } = req.query;

      if (!technicianId || !date) {
        return res.status(400).json({
          success: false,
          message: "Thiếu thông tin technicianId hoặc date",
        });
      }

      // Validate technician exists
      const technician = await Technician.findById(technicianId);
      if (!technician) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy kỹ thuật viên",
        });
      }

      // Parse date
      const requestedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (requestedDate < today) {
        return res.status(400).json({
          success: false,
          message: "Không thể chọn ngày trong quá khứ",
        });
      }

      // Generate available time slots
      const timeSlots = [];
      const startHour = 7; // 7:00 AM
      const endHour = 21; // 9:00 PM

      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlot = `${hour.toString().padStart(2, "0")}:00`;
        timeSlots.push(timeSlot);
      }

      // Check existing bookings for this technician on this date
      const existingBookings = await RepairRequest.find({
        "technician._id": technicianId,
        scheduledTime: {
          $gte: new Date(date + "T00:00:00.000Z"),
          $lt: new Date(date + "T23:59:59.999Z"),
        },
        status: { $in: ["accepted", "in_progress"] },
      });

      // Filter out occupied time slots
      const availableSlots = timeSlots.filter((slot) => {
        const [hour] = slot.split(":");
        const slotTime = new Date(date + `T${hour}:00:00.000Z`);

        return !existingBookings.some((booking) => {
          const bookingTime = new Date(booking.scheduledTime);
          const timeDiff = Math.abs(slotTime - bookingTime) / (1000 * 60 * 60);
          return timeDiff < 2; // 2 hour buffer
        });
      });

      return res.status(200).json({
        success: true,
        message: "Lấy khung giờ trống thành công",
        data: availableSlots,
      });
    } catch (error) {
      console.error("Error getting available time slots:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy khung giờ trống",
        error: error.message,
      });
    }
  },

  // Complete warranty repair (for technician)
  completeWarrantyRepair: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { workDescription, partsUsed, notes } = req.body;
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token không hợp lệ",
        });
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const technicianId = decodedToken.id;

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("technician", "account")
        .populate("customer", "fullName phone")
        .populate("service", "name");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if technician is assigned to this booking
      if (booking.technician._id.toString() !== technicianId) {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      // Check if booking is in warranty_requested status
      if (booking.status !== "warranty_requested") {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng không ở trạng thái bảo hành",
        });
      }

      // Update booking status to warranty_completed
      booking.status = "warranty_completed";
      booking.warrantyWork = {
        completedAt: new Date(),
        workDescription: workDescription || "Đã hoàn thành bảo hành",
        partsUsed: partsUsed || [],
        notes: notes || "",
      };

      // Add to timeline
      booking.timeline.push({
        status: "warranty_completed",
        description: `Kỹ thuật viên đã hoàn thành bảo hành: ${
          workDescription || "Đã hoàn thành bảo hành"
        }`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Hoàn thành bảo hành thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error completing warranty repair:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi hoàn thành bảo hành",
        error: error.message,
      });
    }
  },

  // Customer confirms warranty completion
  confirmWarrantyCompletion: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { rating, comment } = req.body;

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("technician", "account")
        .populate("customer", "fullName phone")
        .populate("service", "name");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if booking is in warranty_completed status
      if (booking.status !== "warranty_completed") {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng không ở trạng thái chờ xác nhận bảo hành",
        });
      }

      // Update booking status to completed
      booking.status = "completed";
      booking.warrantyConfirmation = {
        confirmedAt: new Date(),
        satisfied: true,
        rating: rating || 5,
        comment: comment || "",
      };

      // Add to timeline
      booking.timeline.push({
        status: "warranty_confirmed",
        description: `Khách hàng đã xác nhận hài lòng với dịch vụ bảo hành. Đánh giá: ${
          rating || 5
        } sao`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Xác nhận bảo hành thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error confirming warranty completion:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi xác nhận bảo hành",
        error: error.message,
      });
    }
  },

  // Customer reports warranty complaint
  reportWarrantyComplaint: async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { reason, description } = req.body;

      if (!reason || !description) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng cung cấp lý do và mô tả khiếu nại",
        });
      }

      // Find booking
      const booking = await RepairRequest.findById(bookingId)
        .populate("technician", "account")
        .populate("customer", "fullName phone")
        .populate("service", "name");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng",
        });
      }

      // Check if booking is in warranty_completed status
      if (booking.status !== "warranty_completed") {
        return res.status(400).json({
          success: false,
          message: "Đơn hàng không ở trạng thái chờ xác nhận bảo hành",
        });
      }

      // Update booking status to pending_admin_review
      booking.status = "pending_admin_review";
      booking.warrantyComplaint = {
        complainedAt: new Date(),
        reason: reason,
        description: description,
      };

      // Add to timeline
      booking.timeline.push({
        status: "warranty_complaint",
        description: `Khách hàng đã khiếu nại về dịch vụ bảo hành. Lý do: ${reason}`,
        createdAt: new Date(),
      });

      await booking.save();

      return res.status(200).json({
        success: true,
        message: "Ghi nhận khiếu nại bảo hành thành công",
        data: booking,
      });
    } catch (error) {
      console.error("Error reporting warranty complaint:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi ghi nhận khiếu nại bảo hành",
        error: error.message,
      });
    }
  },
};

module.exports = BookingController;
