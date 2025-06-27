import React from "react";
import {
  FiUsers,
  FiTool,
  FiBell,
  FiSearch,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiMapPin,
  FiStar,
  FiTrendingUp,
  FiPhoneCall,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import Sidebar from "../../../components/SideBarAdmin/Sidebar";

function Dashboard() {
  // Dữ liệu doanh thu theo tuần
  const revenueData = [
    { name: "T2", revenue: 4500000 },
    { name: "T3", revenue: 5200000 },
    { name: "T4", revenue: 4800000 },
    { name: "T5", revenue: 6100000 },
    { name: "T6", revenue: 5800000 },
    { name: "T7", revenue: 7200000 },
    { name: "CN", revenue: 6500000 },
  ];

  // Dữ liệu số lượng đơn theo loại dịch vụ
  const serviceData = [
    { name: "Máy lạnh", value: 35 },
    { name: "Tủ lạnh", value: 25 },
    { name: "Máy giặt", value: 20 },
    { name: "TV", value: 15 },
    { name: "Khác", value: 5 },
  ];

  // Dữ liệu hiệu suất kỹ thuật viên theo ngày
  const technicianPerformance = [
    { name: "T2", completed: 12, pending: 3 },
    { name: "T3", completed: 15, pending: 4 },
    { name: "T4", completed: 13, pending: 2 },
    { name: "T5", completed: 16, pending: 5 },
    { name: "T6", completed: 14, pending: 3 },
    { name: "T7", completed: 18, pending: 4 },
    { name: "CN", completed: 11, pending: 2 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const stats = [
    {
      title: "Tổng số kỹ thuật viên",
      value: "24",
      icon: <FiUsers className="w-6 h-6" />,
      trend: "+2",
      trendColor: "text-green-500",
      description: "Kỹ thuật viên đang hoạt động",
    },
    {
      title: "Đơn sửa chữa hôm nay",
      value: "18",
      icon: <FiTool className="w-6 h-6" />,
      trend: "+5",
      trendColor: "text-green-500",
      description: "Đơn hàng đã nhận",
    },
    {
      title: "Doanh thu tháng",
      value: "45.2M",
      icon: <FiDollarSign className="w-6 h-6" />,
      trend: "+8%",
      trendColor: "text-green-500",
      description: "So với tháng trước",
    },
  ];

  const recentOrders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      service: "Sửa máy lạnh",
      technician: "Trần Văn Kỹ",
      status: "Hoàn thành",
      amount: "850.000đ",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      service: "Sửa tủ lạnh",
      technician: "Lê Văn Sửa",
      status: "Đang xử lý",
      amount: "650.000đ",
    },
    {
      id: "DH003",
      customer: "Phạm Văn C",
      service: "Sửa máy giặt",
      technician: "Nguyễn Văn Thợ",
      status: "Chờ xác nhận",
      amount: "750.000đ",
    },
  ];

  const topTechnicians = [
    {
      name: "Trần Văn Kỹ",
      completedOrders: 28,
      rating: 4.8,
      revenue: "24.5M",
      status: "Đang làm việc",
    },
    {
      name: "Lê Văn Sửa",
      completedOrders: 25,
      rating: 4.7,
      revenue: "22.8M",
      status: "Đang rảnh",
    },
    {
      name: "Nguyễn Văn Thợ",
      completedOrders: 22,
      rating: 4.9,
      revenue: "20.2M",
      status: "Đang làm việc",
    },
  ];

  // Thống kê trạng thái đơn hàng
  const orderStats = [
    {
      title: "Đơn hoàn thành",
      value: "142",
      icon: <FiCheckCircle className="w-5 h-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Đơn đang xử lý",
      value: "28",
      icon: <FiClock className="w-5 h-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Đơn có vấn đề",
      value: "5",
      icon: <FiAlertCircle className="w-5 h-5" />,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  // Thêm dữ liệu đánh giá theo thời gian
  const ratingTrends = [
    { name: "1/3", rating: 4.5, reviews: 12 },
    { name: "2/3", rating: 4.7, reviews: 15 },
    { name: "3/3", rating: 4.6, reviews: 10 },
    { name: "4/3", rating: 4.8, reviews: 18 },
    { name: "5/3", rating: 4.7, reviews: 14 },
    { name: "6/3", rating: 4.9, reviews: 20 },
    { name: "7/3", rating: 4.8, reviews: 16 },
  ];

  // Dữ liệu khu vực hoạt động
  const serviceAreas = [
    { area: "Quận 1", orders: 45, revenue: 38500000 },
    { area: "Quận 2", orders: 38, revenue: 32000000 },
    { area: "Quận 3", orders: 42, revenue: 35600000 },
    { area: "Quận 7", orders: 35, revenue: 29800000 },
    { area: "Quận Bình Thạnh", orders: 40, revenue: 34200000 },
  ];

  // Thống kê cuộc gọi
  const callStats = {
    total: 256,
    answered: 245,
    missed: 11,
    avgDuration: "8.5",
    satisfaction: 4.8,
  };

  // Thống kê chi tiết doanh thu
  const revenueDetails = {
    totalRevenue: 185000000,
    serviceRevenue: 165000000,
    partsRevenue: 20000000,
    avgOrderValue: 850000,
    growth: 15.5,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Component hiển thị số liệu với icon
  const StatisticCard = ({ icon, title, value, subValue, color }) => (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="flex items-center">
          <p className="text-xl font-semibold">{value}</p>
          {subValue && (
            <span className="ml-2 text-sm text-gray-500">{subValue}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f5f8ff]">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng, kỹ thuật viên..."
                className="ml-2 bg-transparent border-none focus:outline-none w-64"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2">
                <FiBell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 transition-transform hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm ${stat.trendColor}`}>
                        {stat.trend}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        {stat.description}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Status Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {orderStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Doanh thu tuần</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      fill="#93c5fd"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service Distribution Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Phân bố dịch vụ</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={serviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {serviceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Technician Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Hiệu suất xử lý đơn hàng
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={technicianPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" name="Hoàn thành" fill="#2563eb" />
                  <Bar dataKey="pending" name="Đang xử lý" fill="#93c5fd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Thêm phần Revenue Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chi tiết doanh thu</h2>
              <div className="flex items-center text-green-600">
                <FiTrendingUp className="w-5 h-5 mr-1" />
                <span>+{revenueDetails.growth}% so với tháng trước</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(revenueDetails.totalRevenue)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Doanh thu dịch vụ</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(revenueDetails.serviceRevenue)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Doanh thu phụ tùng</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(revenueDetails.partsRevenue)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Giá trị đơn trung bình</p>
                <p className="text-xl font-bold text-orange-600">
                  {formatCurrency(revenueDetails.avgOrderValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Service Areas and Call Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Service Areas */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Khu vực hoạt động</h2>
              <div className="space-y-4">
                {serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FiMapPin className="w-5 h-5 text-blue-500" />
                      <span className="ml-3 font-medium">{area.area}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{area.orders} đơn</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(area.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Thống kê cuộc gọi</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatisticCard
                  icon={<FiPhoneCall className="w-6 h-6 text-blue-500" />}
                  title="Tổng cuộc gọi"
                  value={callStats.total}
                  color="bg-blue-100"
                />
                <StatisticCard
                  icon={<FiCheckCircle className="w-6 h-6 text-green-500" />}
                  title="Cuộc gọi đã trả lời"
                  value={callStats.answered}
                  color="bg-green-100"
                />
                <StatisticCard
                  icon={<FiClock className="w-6 h-6 text-orange-500" />}
                  title="Thời lượng trung bình"
                  value={callStats.avgDuration}
                  subValue="phút"
                  color="bg-orange-100"
                />
                <StatisticCard
                  icon={<FiStar className="w-6 h-6 text-yellow-500" />}
                  title="Đánh giá hài lòng"
                  value={callStats.satisfaction}
                  subValue="/5"
                  color="bg-yellow-100"
                />
              </div>
            </div>
          </div>

          {/* Rating Trends */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Xu hướng đánh giá</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ratingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[4, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rating"
                    stroke="#2563eb"
                    name="Điểm đánh giá"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="reviews"
                    stroke="#10b981"
                    name="Số lượng đánh giá"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Đơn sửa chữa gần đây
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Mã ĐH</th>
                      <th className="pb-3">Khách hàng</th>
                      <th className="pb-3">Kỹ thuật viên</th>
                      <th className="pb-3">Trạng thái</th>
                      <th className="pb-3 text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentOrders.map((order, index) => (
                      <tr key={index} className="text-sm">
                        <td className="py-3">{order.id}</td>
                        <td className="py-3">{order.customer}</td>
                        <td className="py-3">{order.technician}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              order.status === "Hoàn thành"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Đang xử lý"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Technicians */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                Top kỹ thuật viên tháng
              </h2>
              <div className="space-y-4">
                {topTechnicians.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUsers className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{tech.name}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          <span>{tech.completedOrders} đơn</span>
                          <span className="mx-2">•</span>
                          <span>{tech.rating} ⭐</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        {tech.revenue}
                      </p>
                      <p className="text-sm text-gray-500">{tech.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
