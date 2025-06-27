import React, { useEffect } from "react";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FiCheckCircle,
  FiHome,
  FiTool,
  FiUsers,
  FiAward,
  FiHeart,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import {
  FaHandshake,
  FaLightbulb,
  FaUserTie,
  FaGraduationCap,
} from "react-icons/fa";
import { MdSpeed, MdHighQuality } from "react-icons/md";

function About() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const values = [
    {
      icon: <FiHeart className="text-3xl" />,
      title: "Tận tâm phục vụ",
      description:
        "Đặt lợi ích khách hàng lên hàng đầu, phục vụ như người thân",
      color: "from-red-400 to-red-600",
    },
    {
      icon: <MdHighQuality className="text-3xl" />,
      title: "Chất lượng cao",
      description: "Cam kết dịch vụ đạt chuẩn, sử dụng linh kiện chính hãng",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: <MdSpeed className="text-3xl" />,
      title: "Nhanh chóng",
      description: "Phản hồi trong 30 phút, có mặt đúng hẹn, xử lý gọn gàng",
      color: "from-green-400 to-green-600",
    },
    {
      icon: <FaHandshake className="text-3xl" />,
      title: "Minh bạch",
      description:
        "Báo giá rõ ràng, không phát sinh chi phí, thanh toán thuận tiện",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: <FiShield className="text-3xl" />,
      title: "Uy tín",
      description: "Bảo hành dài hạn, bảo mật thông tin, cam kết chất lượng",
      color: "from-orange-400 to-orange-600",
    },
    {
      icon: <FaLightbulb className="text-3xl" />,
      title: "Đổi mới",
      description: "Không ngừng cải tiến công nghệ và quy trình phục vụ",
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  const milestones = [
    {
      year: "2019",
      title: "Thành lập KCare",
      description: "Khởi đầu với 5 kỹ thuật viên tại TP.HCM",
      icon: "🚀",
    },
    {
      year: "2020",
      title: "Mở rộng dịch vụ",
      description: "Phục vụ 24/7, thêm dịch vụ bảo trì định kỳ",
      icon: "📈",
    },
    {
      year: "2021",
      title: "10.000 khách hàng",
      description: "Cột mốc 10.000 khách hàng tin tưởng sử dụng",
      icon: "🎯",
    },
    {
      year: "2022",
      title: "Mở rộng địa bàn",
      description: "Phủ sóng toàn bộ TP.HCM và các tỉnh lân cận",
      icon: "🗺️",
    },
    {
      year: "2023",
      title: "Nền tảng số",
      description: "Ra mắt app di động và hệ thống đặt lịch online",
      icon: "📱",
    },
    {
      year: "2024",
      title: "50.000+ khách hàng",
      description: "Đội ngũ 100+ kỹ thuật viên chuyên nghiệp",
      icon: "🏆",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn An",
      position: "Founder & CEO",
      image: "https://i.pravatar.cc/300?img=11",
      description: "15 năm kinh nghiệm trong lĩnh vực điện lạnh",
    },
    {
      name: "Trần Thị Bình",
      position: "Co-founder & COO",
      image: "https://i.pravatar.cc/300?img=23",
      description: "Chuyên gia vận hành và quản lý chất lượng dịch vụ",
    },
    {
      name: "Lê Văn Cường",
      position: "CTO",
      image: "https://i.pravatar.cc/300?img=12",
      description: "10 năm kinh nghiệm phát triển platform công nghệ",
    },
    {
      name: "Phạm Thu Hà",
      position: "Head of Customer Service",
      image: "https://i.pravatar.cc/300?img=25",
      description: "Đam mê mang lại trải nghiệm tốt nhất cho khách hàng",
    },
  ];

  const stats = [
    { number: "50K+", label: "Khách hàng tin tưởng", icon: <FiUsers /> },
    { number: "100+", label: "Kỹ thuật viên", icon: <FaUserTie /> },
    { number: "150K+", label: "Dịch vụ hoàn thành", icon: <FiCheckCircle /> },
    { number: "98%", label: "Khách hàng hài lòng", icon: <FiHeart /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-white pt-32 lg:pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" data-aos="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Về <span className="text-blue-600">KCare</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Nền tảng kết nối khách hàng với kỹ thuật viên chuyên nghiệp, mang
              dịch vụ bảo trì thiết bị gia dụng đến tận nhà với chất lượng tốt
              nhất
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-blue-50 rounded-2xl p-8" data-aos="fade-right">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FiTarget className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sứ mệnh</h2>
              <p className="text-gray-700 leading-relaxed">
                KCare ra đời với sứ mệnh mang đến giải pháp bảo trì, sửa chữa
                thiết bị gia dụng tiện lợi, nhanh chóng và đáng tin cậy cho mọi
                gia đình Việt Nam. Chúng tôi kết nối khách hàng với đội ngũ kỹ
                thuật viên chuyên nghiệp, đảm bảo dịch vụ chất lượng cao với giá
                cả hợp lý.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-8" data-aos="fade-left">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <FiTrendingUp className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Tầm nhìn
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Trở thành nền tảng dịch vụ bảo trì thiết bị gia dụng số 1 Việt
                Nam, nơi mọi gia đình đều có thể dễ dàng tiếp cận dịch vụ chuyên
                nghiệp. Đồng thời, tạo ra cơ hội việc làm ổn định và thu nhập
                cao cho hàng nghìn kỹ thuật viên trên cả nước.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              6 giá trị cốt lõi định hướng mọi hoạt động của KCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}>
                <div className="text-4xl mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <p className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </p>
                <p className="text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              KCare hoạt động như thế nào?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Mô hình kết nối 2 chiều giữa khách hàng và kỹ thuật viên
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Customers */}
            <div className="bg-blue-50 rounded-2xl p-8" data-aos="fade-right">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiHome className="text-blue-600" />
                Dành cho Khách hàng
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Đặt lịch dịch vụ
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Đặt lịch online hoặc gọi hotline
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Kỹ thuật viên đến nhà
                    </h4>
                    <p className="text-gray-600 text-sm">
                      KTV chuyên nghiệp đến đúng hẹn
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Kiểm tra & báo giá
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Minh bạch chi phí trước khi thực hiện
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Hoàn thành & bảo hành
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Thanh toán và nhận bảo hành dịch vụ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Technicians */}
            <div className="bg-orange-50 rounded-2xl p-8" data-aos="fade-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiTool className="text-orange-600" />
                Dành cho Kỹ thuật viên
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Đăng ký tham gia
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Đăng ký và được xét duyệt nhanh chóng
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Nhận đơn hàng
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Nhận đơn tự động theo khu vực hoạt động
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Thực hiện dịch vụ
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Phục vụ khách hàng tận tâm, chuyên nghiệp
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Nhận hoa hồng
                    </h4>
                    <p className="text-gray-600 text-sm">
                      70% giá trị đơn hàng, thanh toán hàng tuần
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những người sáng lập và điều hành KCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Từ startup nhỏ đến nền tảng dịch vụ hàng đầu
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200"></div>

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                } mb-12`}
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                <div
                  className={`w-5/12 ${
                    index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"
                  }`}>
                  <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'justify-end' : ''}">
                      <span className="text-3xl">{milestone.icon}</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {milestone.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
          data-aos="zoom-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Cùng KCare xây dựng tương lai
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Hãy tham gia cùng chúng tôi để mang dịch vụ chất lượng đến mọi gia
            đình
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Trở thành khách hàng
            </button>
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Gia nhập đội ngũ
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
