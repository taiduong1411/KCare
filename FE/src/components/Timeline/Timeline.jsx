import React from "react";
import {
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiTool,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiUser,
  FiHome,
  FiStar,
} from "react-icons/fi";

const Timeline = ({ order, compact = false }) => {
  // Define timeline steps based on order status
  const getTimelineSteps = () => {
    const baseSteps = [
      {
        id: "pending",
        title: "Đã đặt lịch",
        description: "Yêu cầu dịch vụ đã được tạo",
        icon: FiClock,
        color: "blue",
        completed: true,
      },
      {
        id: "accepted",
        title: "Đã xác nhận",
        description: "Kỹ thuật viên đã nhận việc",
        icon: FiUser,
        color: "yellow",
        completed: [
          "accepted",
          "in_progress",
          "completed",
          "warranty_requested",
          "warranty_completed",
        ].includes(order.status),
      },
      {
        id: "in_progress",
        title: "Đang thực hiện",
        description: "Kỹ thuật viên đang làm việc",
        icon: FiTool,
        color: "purple",
        completed: [
          "in_progress",
          "pending_customer_confirmation",
          "completed",
          "warranty_requested",
          "warranty_completed",
        ].includes(order.status),
      },
      {
        id: "pending_customer_confirmation",
        title: "Chờ xác nhận",
        description: "Chờ khách hàng xác nhận hoàn thành",
        icon: FiAlertCircle,
        color: "amber",
        completed: [
          "pending_customer_confirmation",
          "completed",
          "warranty_requested",
          "warranty_completed",
        ].includes(order.status),
      },
      {
        id: "completed",
        title: "Hoàn thành",
        description: "Dịch vụ đã được hoàn thành",
        icon: FiCheck,
        color: "green",
        completed: [
          "completed",
          "warranty_requested",
          "warranty_completed",
        ].includes(order.status),
      },
    ];

    // Handle special cases
    if (order.status === "cancelled") {
      return [
        baseSteps[0],
        {
          id: "cancelled",
          title: "Đã hủy",
          description: "Đơn hàng đã được hủy",
          icon: FiX,
          color: "red",
          completed: true,
        },
      ];
    }

    if (order.status === "pending_admin_review") {
      return [
        baseSteps[0],
        baseSteps[1],
        baseSteps[2],
        baseSteps[3],
        {
          id: "pending_admin_review",
          title: "Chờ admin duyệt",
          description: "Khiếu nại đang được xem xét",
          icon: FiClock,
          color: "orange",
          completed: true,
        },
      ];
    }

    if (order.status === "warranty_requested") {
      return [
        ...baseSteps,
        {
          id: "warranty",
          title: "Yêu cầu bảo hành",
          description: "Đang xử lý yêu cầu bảo hành",
          icon: FiAlertCircle,
          color: "orange",
          completed: true,
        },
        {
          id: "warranty_completed",
          title: "Hoàn thành bảo hành",
          description: "Chờ kỹ thuật viên hoàn thành bảo hành",
          icon: FiStar,
          color: "green",
          completed: false,
        },
      ];
    }

    if (order.status === "warranty_completed") {
      return [
        ...baseSteps,
        {
          id: "warranty",
          title: "Yêu cầu bảo hành",
          description: "Đang xử lý yêu cầu bảo hành",
          icon: FiAlertCircle,
          color: "orange",
          completed: true,
        },
        {
          id: "warranty_completed",
          title: "Hoàn thành bảo hành",
          description: "Chờ xác nhận bảo hành",
          icon: FiStar,
          color: "green",
          completed: true,
        },
      ];
    }

    return baseSteps;
  };

  const timelineSteps = getTimelineSteps();
  const completedSteps = timelineSteps.filter((step) => step.completed).length;
  const totalSteps = timelineSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStepColor = (step) => {
    const colors = {
      blue: step.completed
        ? "bg-blue-500 text-white"
        : "bg-blue-100 text-blue-600",
      yellow: step.completed
        ? "bg-yellow-500 text-white"
        : "bg-yellow-100 text-yellow-600",
      purple: step.completed
        ? "bg-purple-500 text-white"
        : "bg-purple-100 text-purple-600",
      green: step.completed
        ? "bg-green-500 text-white"
        : "bg-green-100 text-green-600",
      red: step.completed ? "bg-red-500 text-white" : "bg-red-100 text-red-600",
      orange: step.completed
        ? "bg-orange-500 text-white"
        : "bg-orange-100 text-orange-600",
      amber: step.completed
        ? "bg-amber-500 text-white"
        : "bg-amber-100 text-amber-600",
    };
    return colors[step.color] || colors.blue;
  };

  if (compact) {
    // Compact version for order cards
    return (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500">Tiến độ</span>
          <span className="text-xs text-gray-400">
            {completedSteps}/{totalSteps} bước
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Timeline steps */}
        <div className="flex items-center justify-between">
          {timelineSteps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs
                ${getStepColor(step)}
                ${step.completed ? "shadow-md" : ""}
                transition-all duration-300
              `}>
                <step.icon className="w-3 h-3" />
              </div>
              <span
                className={`
                text-xs mt-1 text-center max-w-[60px] leading-tight
                ${
                  step.completed ? "text-gray-700 font-medium" : "text-gray-400"
                }
              `}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        {/* Current status */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">
            {order.status === "pending" && "Đang chờ xác nhận"}
            {order.status === "accepted" && "Kỹ thuật viên sẽ đến đúng giờ"}
            {order.status === "in_progress" && "Đang thực hiện dịch vụ"}
            {order.status === "pending_customer_confirmation" &&
              "Chờ bạn xác nhận hoàn thành"}
            {order.status === "completed" && "Dịch vụ đã hoàn thành"}
            {order.status === "pending_admin_review" &&
              "Chờ admin duyệt khiếu nại"}
            {order.status === "cancelled" && "Đơn hàng đã hủy"}
            {order.status === "warranty_requested" && "Đang xử lý bảo hành"}
            {order.status === "warranty_completed" &&
              "Chờ bạn xác nhận bảo hành"}
          </span>
        </div>
      </div>
    );
  }

  // Full version for detailed view
  return (
    <div className="timeline-container p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Tiến độ đơn hàng
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Tiến độ: {completedSteps}/{totalSteps} bước
          </span>
          <span className="font-medium">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => (
          <div key={step.id} className="relative flex items-start space-x-4">
            {/* Connector line */}
            {index < timelineSteps.length - 1 && (
              <div className="absolute left-5 top-10 w-0.5 h-8 bg-gray-200" />
            )}

            {/* Icon */}
            <div
              className={`
              w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
              ${getStepColor(step)}
              ${step.completed ? "shadow-lg" : ""}
              transition-all duration-300
            `}>
              <step.icon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={`text-sm font-semibold ${
                    step.completed ? "text-gray-900" : "text-gray-500"
                  }`}>
                  {step.title}
                </h4>
                {step.completed && (
                  <span className="text-xs text-gray-400">✓ Đã hoàn thành</span>
                )}
              </div>
              <p
                className={`text-xs mt-1 ${
                  step.completed ? "text-gray-600" : "text-gray-400"
                }`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Additional timeline from order data */}
      {order.timeline && order.timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Lịch sử chi tiết
          </h4>
          <div className="space-y-3">
            {order.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(event.createdAt).toLocaleString("vi-VN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
