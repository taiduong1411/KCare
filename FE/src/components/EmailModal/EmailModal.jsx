import PropTypes from "prop-types";
import { Input, Button, Typography, Avatar, Space, Divider } from "antd";
import {
  UserOutlined,
  MailOutlined,
  SendOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./EmailModal.css"; // Import the custom CSS file
const { TextArea } = Input;
const { Title, Text } = Typography;

const EmailModal = ({
  visible,
  onClose,
  onSend,
  emailContent,
  setEmailContent,
  currentContact,
}) => {
  if (!visible) return null;

  return (
    <div className="email-modal">
      <div className="email-modal-content">
        {/* Header với gradient đẹp */}
        <div className="email-modal-header">
          <Space align="center" className="header-content">
            <div className="header-icon">
              <MailOutlined />
            </div>
            <div>
              <Title level={4} className="email-modal-title">
                Phản hồi khách hàng
              </Title>
              <Text className="header-subtitle">
                Gửi email trả lời tới khách hàng
              </Text>
            </div>
          </Space>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="close-button"
          />
        </div>

        <div className="email-modal-body">
          {/* Customer info card */}
          <div className="customer-info-card">
            <Space align="center" className="customer-info">
              <Avatar
                size={40}
                icon={<UserOutlined />}
                className="customer-avatar"
              />
              <div className="customer-details">
                <Text strong className="customer-name">
                  {currentContact?.fullname || "Khách hàng"}
                </Text>
                <div className="customer-email">
                  <MailOutlined className="email-icon" />
                  <Text className="email-text">{currentContact?.email}</Text>
                </div>
              </div>
            </Space>
          </div>

          <Divider orientation="left" orientationMargin="0">
            <Text type="secondary" className="divider-text">
              Nội dung phản hồi
            </Text>
          </Divider>

          {/* Enhanced form */}
          <div className="email-form">
            <div className="textarea-container">
              <TextArea
                rows={12}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Nhập nội dung phản hồi cho khách hàng...&#10;&#10;Ví dụ:&#10;Xin chào [Tên khách hàng],&#10;&#10;Cảm ơn bạn đã liên hệ với K-Care. Chúng tôi đã nhận được yêu cầu của bạn và sẽ..."
                className="email-textarea"
                autoFocus
                showCount
                maxLength={1000}
              />
            </div>
          </div>
        </div>

        {/* Enhanced footer */}
        <div className="email-modal-footer">
          <div className="footer-info">
            <Text type="secondary" className="char-count">
              {emailContent?.length || 0}/1000 ký tự
            </Text>
          </div>
          <Space>
            <Button onClick={onClose} className="cancel-button" size="large">
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              onClick={onSend}
              className="send-button"
              disabled={!emailContent?.trim()}
              icon={<SendOutlined />}
              size="large">
              Gửi phản hồi
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

EmailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  emailContent: PropTypes.string.isRequired,
  setEmailContent: PropTypes.func.isRequired,
  currentContact: PropTypes.shape({
    email: PropTypes.string,
  }),
};

EmailModal.defaultProps = {
  currentContact: { email: "" },
};

export default EmailModal;
