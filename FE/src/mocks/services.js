export const mockServices = [
  {
    id: 1,
    slug: "may-lanh",
    name: "Máy lạnh",
    description: "Vệ sinh, bảo dưỡng, sửa chữa máy lạnh các loại",
    detailedDescription:
      "Dịch vụ bảo trì máy lạnh chuyên nghiệp, bao gồm vệ sinh dàn nóng, dàn lạnh, kiểm tra gas, thay thế linh kiện. Phục vụ tất cả các hãng: Daikin, Panasonic, LG, Samsung, Toshiba,...",
    icon: "FaSnowflake",
    color: "from-blue-400 to-blue-600",
    price: {
      from: 150000,
      to: 500000,
      unit: "máy",
    },
    duration: "30-60 phút",
    popularIssues: [
      "Máy lạnh không mát",
      "Máy lạnh bị chảy nước",
      "Máy lạnh kêu to",
      "Máy lạnh có mùi hôi",
      "Remote không hoạt động",
    ],
    maintenancePackages: [
      {
        name: "Gói cơ bản",
        price: 150000,
        services: ["Vệ sinh dàn lạnh", "Kiểm tra gas", "Vệ sinh lưới lọc"],
      },
      {
        name: "Gói nâng cao",
        price: 350000,
        services: [
          "Vệ sinh dàn lạnh",
          "Vệ sinh dàn nóng",
          "Kiểm tra gas",
          "Bổ sung gas (nếu cần)",
          "Kiểm tra điện",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1565181963346-cf6aba67f661?w=600",
  },
  {
    id: 2,
    slug: "tu-lanh",
    name: "Tủ lạnh",
    description: "Kiểm tra gas, vệ sinh, thay linh kiện tủ lạnh",
    detailedDescription:
      "Bảo trì tủ lạnh định kỳ giúp tiết kiệm điện, kéo dài tuổi thọ thiết bị. Chúng tôi phục vụ mọi loại tủ lạnh: mini, 2 cánh, side by side, inverter...",
    icon: "MdKitchen",
    color: "from-cyan-400 to-cyan-600",
    price: {
      from: 200000,
      to: 600000,
      unit: "tủ",
    },
    duration: "45-90 phút",
    popularIssues: [
      "Tủ lạnh không lạnh",
      "Tủ lạnh đóng tuyết",
      "Tủ lạnh kêu to",
      "Rò rỉ nước",
      "Hao điện bất thường",
    ],
    maintenancePackages: [
      {
        name: "Gói cơ bản",
        price: 200000,
        services: ["Vệ sinh tủ", "Kiểm tra nhiệt độ", "Vệ sinh gioăng cửa"],
      },
      {
        name: "Gói toàn diện",
        price: 450000,
        services: [
          "Vệ sinh toàn bộ",
          "Kiểm tra gas",
          "Thay gioăng cửa",
          "Kiểm tra board mạch",
          "Tư vấn sử dụng",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600",
  },
  {
    id: 3,
    slug: "may-giat",
    name: "Máy giặt",
    description: "Vệ sinh lồng giặt, sửa chữa bo mạch, thay linh kiện",
    detailedDescription:
      "Bảo dưỡng máy giặt định kỳ giúp quần áo sạch hơn, máy hoạt động êm ái và bền bỉ. Phục vụ cả máy giặt cửa trên và cửa ngang.",
    icon: "MdLocalLaundryService",
    color: "from-purple-400 to-purple-600",
    price: {
      from: 180000,
      to: 500000,
      unit: "máy",
    },
    duration: "45-60 phút",
    popularIssues: [
      "Máy giặt không vắt",
      "Máy giặt rung lắc mạnh",
      "Không cấp/thoát nước",
      "Lồng giặt có mùi hôi",
      "Board mạch bị lỗi",
    ],
    maintenancePackages: [
      {
        name: "Gói vệ sinh",
        price: 180000,
        services: ["Vệ sinh lồng giặt", "Vệ sinh bộ lọc", "Kiểm tra cơ bản"],
      },
      {
        name: "Gói bảo dưỡng",
        price: 400000,
        services: [
          "Vệ sinh toàn bộ",
          "Kiểm tra motor",
          "Kiểm tra board",
          "Thay gioăng cửa",
          "Cân chỉnh máy",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1626806787461-102c1b0b43a6?w=600",
  },
  {
    id: 4,
    slug: "tivi",
    name: "Tivi",
    description: "Sửa chữa màn hình, board nguồn, cài đặt TV",
    detailedDescription:
      "Dịch vụ sửa chữa và bảo dưỡng TV LCD, LED, OLED, Smart TV. Xử lý mọi vấn đề từ phần cứng đến phần mềm.",
    icon: "FaTv",
    color: "from-orange-400 to-orange-600",
    price: {
      from: 150000,
      to: 800000,
      unit: "TV",
    },
    duration: "30-120 phút",
    popularIssues: [
      "Màn hình không hiển thị",
      "Không có âm thanh",
      "Remote không hoạt động",
      "Smart TV bị treo",
      "Màn hình có vết sọc",
    ],
    maintenancePackages: [
      {
        name: "Gói kiểm tra",
        price: 150000,
        services: ["Kiểm tra tổng quát", "Vệ sinh TV", "Cài đặt kênh"],
      },
      {
        name: "Gói sửa chữa",
        price: "Báo giá sau kiểm tra",
        services: [
          "Thay linh kiện",
          "Sửa board mạch",
          "Cài đặt phần mềm",
          "Bảo hành 6 tháng",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600",
  },
  {
    id: 5,
    slug: "may-nuoc-nong",
    name: "Máy nước nóng",
    description: "Vệ sinh bình, kiểm tra an toàn, thay linh kiện",
    detailedDescription:
      "Bảo trì máy nước nóng định kỳ đảm bảo an toàn, tiết kiệm điện và kéo dài tuổi thọ. Phục vụ cả bình nóng lạnh trực tiếp và gián tiếp.",
    icon: "FaFireAlt",
    color: "from-red-400 to-red-600",
    price: {
      from: 200000,
      to: 500000,
      unit: "máy",
    },
    duration: "45-60 phút",
    popularIssues: [
      "Nước không nóng",
      "Rò rỉ điện",
      "Bình bị rò nước",
      "Relay không hoạt động",
      "Cặn bẩn trong bình",
    ],
    maintenancePackages: [
      {
        name: "Gói an toàn",
        price: 200000,
        services: [
          "Kiểm tra an toàn điện",
          "Vệ sinh bình",
          "Kiểm tra van an toàn",
        ],
      },
      {
        name: "Gói toàn diện",
        price: 400000,
        services: [
          "Vệ sinh bình",
          "Thay que đốt",
          "Kiểm tra relay",
          "Kiểm tra cách điện",
          "Tư vấn sử dụng",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1585202900225-6d3ac5356b67?w=600",
  },
  {
    id: 6,
    slug: "lo-vi-song",
    name: "Lò vi sóng",
    description: "Kiểm tra magnetron, vệ sinh, sửa chữa",
    detailedDescription:
      "Bảo dưỡng lò vi sóng đảm bảo an toàn thực phẩm và hiệu quả nấu nướng. Kiểm tra bức xạ, vệ sinh khoang lò chuyên nghiệp.",
    icon: "MdMicrowave",
    color: "from-yellow-400 to-yellow-600",
    price: {
      from: 150000,
      to: 400000,
      unit: "lò",
    },
    duration: "30-45 phút",
    popularIssues: [
      "Không nóng thức ăn",
      "Đĩa xoay không quay",
      "Phát ra tiếng kêu lạ",
      "Đèn không sáng",
      "Nút bấm không hoạt động",
    ],
    maintenancePackages: [
      {
        name: "Gói vệ sinh",
        price: 150000,
        services: ["Vệ sinh khoang lò", "Kiểm tra đĩa xoay", "Test hoạt động"],
      },
      {
        name: "Gói sửa chữa",
        price: "Báo giá sau kiểm tra",
        services: [
          "Thay magnetron",
          "Sửa board điều khiển",
          "Thay linh kiện",
          "Bảo hành 3 tháng",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=600",
  },
  {
    id: 7,
    slug: "quat-dien",
    name: "Quạt điện",
    description: "Vệ sinh, tra dầu, thay linh kiện quạt các loại",
    detailedDescription:
      "Bảo dưỡng quạt điện giúp quạt chạy êm, mát hơn và tiết kiệm điện. Phục vụ quạt trần, quạt đứng, quạt bàn, quạt hộp...",
    icon: "FaFan",
    color: "from-green-400 to-green-600",
    price: {
      from: 100000,
      to: 300000,
      unit: "quạt",
    },
    duration: "20-40 phút",
    popularIssues: [
      "Quạt chạy yếu",
      "Quạt kêu to",
      "Không đảo chiều được",
      "Motor nóng",
      "Cánh quạt bị gãy",
    ],
    maintenancePackages: [
      {
        name: "Gói cơ bản",
        price: 100000,
        services: ["Vệ sinh cánh quạt", "Tra dầu motor", "Kiểm tra tụ điện"],
      },
      {
        name: "Gói nâng cao",
        price: 200000,
        services: [
          "Vệ sinh toàn bộ",
          "Thay tụ điện",
          "Cân bằng cánh",
          "Kiểm tra motor",
          "Bảo dưỡng định kỳ",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1565608087341-404b25492fee?w=600",
  },
  {
    id: 8,
    slug: "may-loc-nuoc",
    name: "Máy lọc nước",
    description: "Thay lõi lọc, vệ sinh, kiểm tra chất lượng nước",
    detailedDescription:
      "Bảo trì máy lọc nước RO, Nano, UF định kỳ đảm bảo nước sạch cho gia đình. Kiểm tra TDS, thay lõi lọc chính hãng.",
    icon: "MdWaterDrop",
    color: "from-blue-400 to-cyan-600",
    price: {
      from: 200000,
      to: 800000,
      unit: "máy",
    },
    duration: "45-60 phút",
    popularIssues: [
      "Nước có mùi lạ",
      "Lưu lượng nước yếu",
      "Máy bị rò nước",
      "TDS cao",
      "Lõi lọc bị tắc",
    ],
    maintenancePackages: [
      {
        name: "Gói kiểm tra",
        price: 200000,
        services: ["Kiểm tra TDS", "Vệ sinh vỏ máy", "Kiểm tra áp suất"],
      },
      {
        name: "Gói thay lõi",
        price: "Từ 500.000đ",
        services: [
          "Thay lõi lọc",
          "Vệ sinh bình chứa",
          "Kiểm tra van",
          "Test chất lượng nước",
          "Bảo hành 6 tháng",
        ],
      },
    ],
    image: "https://images.unsplash.com/photo-1560707303-4e980ce876ad?w=600",
  },
];

export const getServiceBySlug = (slug) => {
  return mockServices.find((service) => service.slug === slug);
};

export const getPopularServices = () => {
  return mockServices.slice(0, 6);
};
