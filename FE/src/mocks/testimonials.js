export const mockTestimonials = [
  {
    id: 1,
    name: "Chị Nguyễn Thị Lan",
    location: "Quận 1, TP.HCM",
    content:
      "Dịch vụ rất chuyên nghiệp. Kỹ thuật viên đến đúng giờ, làm việc nhanh gọn và sạch sẽ. Máy lạnh nhà tôi chạy êm ru sau khi được vệ sinh.",
    rating: 5,
    service: "Vệ sinh máy lạnh",
    serviceId: 1,
    date: "2024-01-15",
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Anh Trần Văn Minh",
    location: "Quận 7, TP.HCM",
    content:
      "Tủ lạnh nhà tôi bị hỏng vào cuối tuần, gọi KCare và được hỗ trợ ngay. Giá cả hợp lý, thợ có tay nghề cao.",
    rating: 5,
    service: "Sửa tủ lạnh",
    serviceId: 2,
    date: "2024-01-20",
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Chị Phạm Thu Hà",
    location: "Thủ Đức, TP.HCM",
    content:
      "Đã sử dụng gói bảo trì định kỳ cho cả nhà. Rất tiện lợi, không phải lo lắng về việc bảo dưỡng thiết bị nữa.",
    rating: 5,
    service: "Gói bảo trì",
    serviceId: null,
    date: "2024-01-25",
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Anh Lê Hoàng Nam",
    location: "Quận 2, TP.HCM",
    content:
      "Máy giặt nhà tôi bị rung lắc mạnh, kỹ thuật viên đến kiểm tra và xử lý rất nhanh. Giải thích rõ ràng nguyên nhân và cách khắc phục.",
    rating: 5,
    service: "Sửa máy giặt",
    serviceId: 3,
    date: "2024-02-01",
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    name: "Chị Võ Thị Mai",
    location: "Quận 3, TP.HCM",
    content:
      "Lần đầu sử dụng dịch vụ và rất hài lòng. Đặt lịch online tiện lợi, kỹ thuật viên nhiệt tình và chuyên nghiệp.",
    rating: 4,
    service: "Vệ sinh máy lạnh",
    serviceId: 1,
    date: "2024-02-05",
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 6,
    name: "Anh Đỗ Minh Tuấn",
    location: "Bình Thạnh, TP.HCM",
    content:
      "TV nhà tôi bị hỏng màn hình, được sửa chữa nhanh chóng với giá cả phải chăng. Còn được bảo hành 6 tháng nữa.",
    rating: 5,
    service: "Sửa Tivi",
    serviceId: 4,
    date: "2024-02-10",
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: 7,
    name: "Chị Nguyễn Thị Hồng",
    location: "Quận 5, TP.HCM",
    content:
      "Máy nước nóng được bảo dưỡng định kỳ, giờ hoạt động tốt và tiết kiệm điện hơn trước. Cảm ơn KCare!",
    rating: 5,
    service: "Bảo trì máy nước nóng",
    serviceId: 5,
    date: "2024-02-15",
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: 8,
    name: "Anh Bùi Văn Đức",
    location: "Gò Vấp, TP.HCM",
    content:
      "Dịch vụ 24/7 thật sự tiện lợi. Máy lạnh bị hỏng lúc 9h tối, 30 phút sau đã có thợ đến xử lý.",
    rating: 5,
    service: "Sửa máy lạnh khẩn cấp",
    serviceId: 1,
    date: "2024-02-18",
    avatar: "https://i.pravatar.cc/150?u=8",
  },
  {
    id: 9,
    name: "Chị Lý Thị Thanh",
    location: "Quận 10, TP.HCM",
    content:
      "Thay lõi lọc máy lọc nước định kỳ, được kiểm tra TDS miễn phí. Nhân viên tư vấn nhiệt tình về cách sử dụng.",
    rating: 4,
    service: "Thay lõi máy lọc nước",
    serviceId: 8,
    date: "2024-02-20",
    avatar: "https://i.pravatar.cc/150?u=9",
  },
  {
    id: 10,
    name: "Anh Trương Văn Hùng",
    location: "Tân Bình, TP.HCM",
    content:
      "Lò vi sóng được vệ sinh sạch sẽ, còn được hướng dẫn cách bảo quản đúng cách. Giá cả rất hợp lý.",
    rating: 5,
    service: "Vệ sinh lò vi sóng",
    serviceId: 6,
    date: "2024-02-22",
    avatar: "https://i.pravatar.cc/150?u=10",
  },
];

export const getLatestTestimonials = (limit = 3) => {
  return mockTestimonials
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

export const getTestimonialsByService = (serviceId) => {
  return mockTestimonials.filter(
    (testimonial) => testimonial.serviceId === serviceId
  );
};

export const getHighRatingTestimonials = () => {
  return mockTestimonials.filter((testimonial) => testimonial.rating >= 4);
};
