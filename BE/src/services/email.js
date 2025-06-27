const express = require("express");
const nodemailer = require("nodemailer");

module.exports = {
  randomCode: () => {
    const characters = "0123456789";
    function generateString(length) {
      var result = "";
      const charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }
    return generateString(6);
  },
  sendEmail: async (code, mail) => {
    async function autoSend(code, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"K-Care. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: "Quên mật khẩu",
        text: code,
        html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>KCare - Mã xác thực quên mật khẩu</title>
            <style>
                body {
                font-family: 'Segoe UI', Arial, sans-serif;
                background: #f4f6fb;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 420px;
                margin: 40px auto;
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(0,0,0,0.08);
                overflow: hidden;
                }
                .header {
                background: linear-gradient(90deg, #2563eb 0%, #1e40af 100%);
                color: #fff;
                text-align: center;
                padding: 32px 0 16px 0;
                }
                .header h1 {
                margin: 0;
                font-size: 28px;
                letter-spacing: 1px;
                }
                .content {
                padding: 32px 24px 24px 24px;
                text-align: center;
                }
                .otp-box {
                display: inline-block;
                background: #f1f5f9;
                color: #2563eb;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 12px;
                padding: 16px 32px;
                border-radius: 12px;
                margin: 24px 0;
                border: 2px dashed #2563eb;
                }
                .desc {
                color: #334155;
                font-size: 16px;
                margin-bottom: 24px;
                }
                .footer {
                background: #f1f5f9;
                color: #64748b;
                text-align: center;
                font-size: 13px;
                padding: 18px 0;
                border-top: 1px solid #e5e7eb;
                }
                @media (max-width: 500px) {
                .container { margin: 0; border-radius: 0; }
                .content { padding: 24px 8px; }
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>KCare</h1>
                <p style="margin: 0; font-size: 16px;">Xác thực quên mật khẩu</p>
                </div>
                <div class="content">
                <p class="desc">Xin chào,</p>
                <p class="desc">Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản KCare.<br>
                Vui lòng sử dụng mã OTP bên dưới để xác thực. Mã có hiệu lực trong 5 phút.</p>
                <div class="otp-box">${code}</div>
                <p class="desc" style="font-size:14px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.<br>Đừng chia sẻ mã này cho bất kỳ ai.</p>
                </div>
                <div class="footer">
                &copy; ${new Date().getFullYear()} KCare. Mọi quyền được bảo lưu.
                </div>
            </div>
            </body>
            </html>
            `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return autoSend(code, mail);
  },
  replyEmail: async (subject, message, mail) => {
    async function replyEmail(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"KCare. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: left;
                        }
                        .message {
                            margin: 20px 0;
                            padding: 20px;
                            background-color: #f4f4f4;
                            border: 1px solid #dddddd;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>KCare. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>Thank you for reaching out to us. Below is our response to your message:</p>
                            <div class="message">${message}</div>
                            <p>If you have any further questions or need additional assistance, please do not hesitate to contact us.</p>
                            <p>Best regards,</p>
                            <p>KCare. Customer Support Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 KCare. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return replyEmail(subject, message, mail);
  },
  confirmTechnician: async (subject, message, mail) => {
    async function confirmTechnician(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"KCare Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f9fafb;
                            margin: 0;
                            padding: 0;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 650px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #4f46e5, #3b82f6);
                            padding: 30px 0;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                            font-weight: 700;
                            letter-spacing: 0.5px;
                        }
                        .header-logo {
                            width: 70px;
                            height: 70px;
                            background-color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 15px;
                            font-size: 32px;
                            font-weight: bold;
                            color: #4f46e5;
                        }
                        .success-icon {
                            font-size: 36px;
                            display: block;
                            margin: 20px auto;
                            text-align: center;
                            color: #10b981;
                        }
                        .content {
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                            border-left: 5px solid #4f46e5;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .next-steps {
                            background-color: #ecfdf5;
                            border-radius: 12px;
                            padding: 20px 25px;
                            margin: 30px 0;
                            text-align: left;
                        }
                        .next-steps h3 {
                            color: #10b981;
                            margin-top: 0;
                            font-size: 18px;
                        }
                        .next-steps ul {
                            padding-left: 20px;
                            margin-bottom: 0;
                        }
                        .next-steps li {
                            margin-bottom: 10px;
                            color: #374151;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #4f46e5, #3b82f6);
                            color: white;
                            text-decoration: none;
                            padding: 12px 30px;
                            border-radius: 50px;
                            font-weight: 600;
                            margin: 25px 0;
                            transition: all 0.3s ease;
                        }
                        .button:hover {
                            background: linear-gradient(135deg, #4338ca, #2563eb);
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
                        }
                        .support {
                            margin-top: 30px;
                            color: #6b7280;
                            font-size: 15px;
                        }
                        .support a {
                            color: #4f46e5;
                            text-decoration: none;
                        }
                        .footer {
                            background-color: #f3f4f6;
                            padding: 20px;
                            text-align: center;
                            font-size: 14px;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                        .social {
                            margin: 15px 0;
                        }
                        .social a {
                            display: inline-block;
                            margin: 0 10px;
                            color: #4b5563;
                            text-decoration: none;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="header-logo">B</div>
                            <h1>KCare. Customer Support</h1>
                        </div>
                        <div class="content">
                            <div class="success-icon">🎉</div>
                            <h2>Chúc mừng! Bạn đã trở thành kỹ thuật viên</h2>
                            <p>Tài khoản của bạn đã được phê duyệt thành công và bây giờ bạn có thể bắt đầu làm việc trên KCare.</p>
                            
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            
                            <div class="next-steps">
                                <h3>Các bước tiếp theo</h3>
                                <ul>
                                    <li>Đăng nhập vào tài khoản kỹ thuật viên của bạn</li>
                                    <li>Hoàn thiện thông tin kỹ thuật viên</li>
                                    <li>Bắt đầu đăng ký dịch vụ</li>
                                    <li>Thiết lập các phương thức thanh toán</li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer">
                            <div class="social">
                                <a href="#">Facebook</a>
                                <a href="#">Instagram</a>
                                <a href="#">Twitter</a>
                            </div>
                            <p>&copy; 2023 Besign. Tất cả các quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return confirmTechnician(subject, message, mail);
  },
  rejectTechnician: async (subject, message, mail) => {
    async function rejectTechnician(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>We regret to inform you that your account has been rejected due to the following reasons:</p>
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@besign.vn">support@besign.vn</a>.</p>
                            <p>Thank you for your understanding.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2023 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return rejectTechnician(subject, message, mail);
  },
  blockTechnician: async (subject, message, mail) => {
    async function blockTechnician(subject, message, mail) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <p>We regret to inform you that your account has been blocked due to violating our terms of service. Here are the details:</p>  
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <p>If you have any questions or need further assistance, please contact our support team at <a href="mailto:support@besign.vn">support@besign.vn</a>.</p>
                            <p>Thank you for your understanding.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2023 Besign. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return blockTechnician(subject, message, mail);
  },
  sendQRCodeTechnician: async (fullName, mail, qrCodeUrl) => {
    async function sendQRCodeTechnician(fullName, mail, qrCodeUrl) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"K-Care Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject:
          "Đăng ký Kỹ thuật viên thành công - Hoàn tất thanh toán ký quỹ",
        text: `Chào ${fullName}, cảm ơn bạn đã đăng ký làm kỹ thuật viên tại K-Care. Vui lòng hoàn tất thanh toán ký quỹ 1,000,000 VNĐ theo mã QR đính kèm.`,
        html: `<!DOCTYPE html>
                <html lang="vi">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>K-Care - Đăng ký Kỹ thuật viên thành công</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f3f4f6;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .container {
                            width: 100%;
                            max-width: 650px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 16px;
                            overflow: hidden;
                            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #2563eb, #1e40af);
                            padding: 40px 30px;
                            text-align: center;
                            color: white;
                        }
                        .header h1 {
                            margin: 0 0 10px 0;
                            font-size: 32px;
                            font-weight: 700;
                            letter-spacing: 1px;
                        }
                        .header p {
                            margin: 0;
                            font-size: 16px;
                            opacity: 0.9;
                        }
                        .header-logo {
                            width: 80px;
                            height: 80px;
                            background-color: white;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px;
                            font-size: 36px;
                            font-weight: bold;
                            color: #2563eb;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        .welcome-icon {
                            font-size: 48px;
                            display: block;
                            margin: 20px auto;
                            text-align: center;
                        }
                        .content {
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 28px;
                            margin-bottom: 20px;
                            font-weight: 600;
                        }
                        .welcome-text {
                            font-size: 18px;
                            color: #4b5563;
                            margin-bottom: 30px;
                            line-height: 1.6;
                        }
                        .deposit-info {
                            background: linear-gradient(135deg, #fef3c7, #fcd34d);
                            border-radius: 16px;
                            padding: 30px;
                            margin: 30px 0;
                            text-align: center;
                            border: 2px solid #f59e0b;
                        }
                        .deposit-info h3 {
                            color: #92400e;
                            margin: 0 0 15px 0;
                            font-size: 24px;
                            font-weight: 700;
                        }
                        .deposit-amount {
                            font-size: 32px;
                            font-weight: 800;
                            color: #92400e;
                            margin: 15px 0;
                        }
                        .qr-section {
                            background-color: #f8fafc;
                            border-radius: 16px;
                            padding: 30px;
                            margin: 30px 0;
                            text-align: center;
                            border: 2px dashed #3b82f6;
                        }
                        .qr-section h3 {
                            color: #1e40af;
                            margin: 0 0 20px 0;
                            font-size: 20px;
                            font-weight: 600;
                        }
                        .qr-code {
                            max-width: 200px;
                            height: auto;
                            margin: 20px auto;
                            border-radius: 12px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        }
                        .bank-info {
                            background-color: #f1f5f9;
                            border-radius: 12px;
                            padding: 20px;
                            margin: 20px 0;
                            text-align: left;
                            border-left: 5px solid #2563eb;
                        }
                        .bank-info h4 {
                            color: #1e40af;
                            margin: 0 0 15px 0;
                            font-size: 18px;
                        }
                        .bank-detail {
                            display: flex;
                            justify-content: space-between;
                            margin: 8px 0;
                            padding: 8px 0;
                            border-bottom: 1px solid #e2e8f0;
                        }
                        .bank-detail:last-child {
                            border-bottom: none;
                        }
                        .bank-label {
                            color: #64748b;
                            font-weight: 500;
                        }
                        .bank-value {
                            color: #1e293b;
                            font-weight: 600;
                        }
                        .next-steps {
                            background-color: #ecfdf5;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 30px 0;
                            text-align: left;
                        }
                        .next-steps h3 {
                            color: #059669;
                            margin-top: 0;
                            font-size: 20px;
                            margin-bottom: 15px;
                        }
                        .next-steps ol {
                            padding-left: 20px;
                            margin-bottom: 0;
                        }
                        .next-steps li {
                            margin-bottom: 12px;
                            color: #374151;
                            line-height: 1.5;
                        }
                        .warning-box {
                            background-color: #fef2f2;
                            border: 1px solid #fca5a5;
                            border-radius: 12px;
                            padding: 20px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .warning-box h4 {
                            color: #dc2626;
                            margin: 0 0 10px 0;
                            font-size: 16px;
                            font-weight: 600;
                        }
                        .warning-box p {
                            color: #7f1d1d;
                            margin: 0;
                            line-height: 1.5;
                        }
                        .support {
                            margin-top: 30px;
                            color: #6b7280;
                            font-size: 15px;
                        }
                        .support a {
                            color: #2563eb;
                            text-decoration: none;
                            font-weight: 600;
                        }
                        .footer {
                            background-color: #f1f5f9;
                            padding: 25px;
                            text-align: center;
                            font-size: 14px;
                            color: #6b7280;
                            border-top: 1px solid #e5e7eb;
                        }
                        .footer-links {
                            margin: 15px 0;
                        }
                        .footer-links a {
                            display: inline-block;
                            margin: 0 15px;
                            color: #4b5563;
                            text-decoration: none;
                            font-weight: 500;
                        }
                        .footer-links a:hover {
                            color: #2563eb;
                        }
                        @media (max-width: 600px) {
                            .container {
                                margin: 0;
                                border-radius: 0;
                            }
                            .content {
                                padding: 30px 20px;
                            }
                            .deposit-amount {
                                font-size: 28px;
                            }
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>KCare</h1>
                            <p>Hệ thống chăm sóc thiết bị chuyên nghiệp</p>
                        </div>
                        <div class="content">
                            <div class="welcome-icon">🎉</div>
                            <h2>Chào mừng ${fullName}!</h2>
                            <p class="welcome-text">
                                Cảm ơn bạn đã đăng ký trở thành kỹ thuật viên tại K-Care. 
                                Hồ sơ của bạn đã được tiếp nhận và đang chờ xử lý.
                            </p>
                            
                            <div class="deposit-info">
                                <h3>💰 Thanh toán ký quỹ</h3>
                                <p style="margin: 0; color: #92400e; font-size: 16px;">
                                    Để hoàn tất đăng ký, vui lòng thanh toán số tiền ký quỹ:
                                </p>
                                <div class="deposit-amount">1,000,000 VNĐ</div>
                            </div>
                            
                            <div class="qr-section">
                                <h3>📱 Quét mã QR để thanh toán</h3>
                                <img src="${qrCodeUrl}" alt="QR Code thanh toán" class="qr-code" />
                                <p style="color: #64748b; margin: 15px 0 0 0; font-size: 14px;">
                                    Quét mã QR bằng ứng dụng ngân hàng của bạn
                                </p>
                            </div>
                            
                            <div class="bank-info">
                                <h4>🏦 Thông tin chuyển khoản</h4>
                                <div class="bank-detail">
                                    <span class="bank-label">Ngân hàng:</span>
                                    <span class="bank-value">Vietcombank</span>
                                </div>
                                <div class="bank-detail">
                                    <span class="bank-label">Số tài khoản:</span>
                                    <span class="bank-value">1234567890</span>
                                </div>
                                <div class="bank-detail">
                                    <span class="bank-label">Chủ tài khoản:</span>
                                    <span class="bank-value">CONG TY K-CARE</span>
                                </div>
                                <div class="bank-detail">
                                    <span class="bank-label">Nội dung:</span>
                                    <span class="bank-value">KYQUY ${fullName} ${mail}</span>
                                </div>
                            </div>
                            
                            <div class="next-steps">
                                <h3>📋 Các bước tiếp theo</h3>
                                <ol>
                                    <li>Quét mã QR hoặc chuyển khoản theo thông tin trên</li>
                                    <li>Đảm bảo nội dung chuyển khoản chính xác</li>
                                    <li>Chờ xác nhận thanh toán (1-2 giờ làm việc)</li>
                                    <li>Admin sẽ xem xét và phê duyệt hồ sơ của bạn</li>
                                    <li>Nhận email thông báo kết quả trong 24-48 giờ</li>
                                </ol>
                            </div>
                            
                            <div class="warning-box">
                                <h4>⚠️ Lưu ý quan trọng</h4>
                                <p>
                                    • Vui lòng chuyển khoản đúng số tiền và nội dung để tránh chậm trễ xử lý<br>
                                    • Tiền ký quỹ sẽ được hoàn trả khi kết thúc hợp tác<br>
                                    • Liên hệ hotline nếu gặp vấn đề trong quá trình thanh toán
                                </p>
                            </div>
                            
                            <p class="support">
                                Cần hỗ trợ? Liên hệ hotline: <strong>1900 xxxx</strong> hoặc email: 
                                <a href="mailto:support@k-care.vn">support@k-care.vn</a>
                            </p>
                        </div>
                        <div class="footer">
                            <div class="footer-links">
                                <a href="#">Trang chủ</a>
                                <a href="#">Dịch vụ</a>
                                <a href="#">Liên hệ</a>
                                <a href="#">Chính sách</a>
                            </div>
                            <p>&copy; ${new Date().getFullYear()} K-Care. Mọi quyền được bảo lưu.</p>
                            <p style="margin: 5px 0 0 0; font-size: 12px;">
                                Email này được gửi tự động, vui lòng không trả lời.
                            </p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return sendQRCodeTechnician(fullName, mail, qrCodeUrl);
  },
  confirmOrder: async (subject, message, mail, productName) => {
    async function confirmOrder(subject, message, mail, productName) {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "djtimz1411@gmail.com",
          pass: "esfryvpkyuykxyzy",
        },
      });
      var mailOptions = {
        from: '"Besign. Customer Support" <djtimz1411@gmail.com>',
        to: mail,
        subject: subject,
        text: message,
        html: `<!DOCTYPE html>
                <html lang="en">
                
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 20px 0;
                            background-color: #4CAF50;
                            color: #ffffff;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #1f2937;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .message-box {
                            background-color: #f3f4f6;
                            border-radius: 12px;
                            padding: 25px;
                            margin: 20px 0;
                            text-align: left;
                        }
                        .message-box p {
                            margin: 0;
                            line-height: 1.7;
                            color: #4b5563;
                        }
                        .download-section {
                            text-align: center;
                            margin: 30px 0;
                        }
                        .download-btn {
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                            transition: background-color 0.3s;
                        }
                        .download-btn:hover {
                            background-color: #45a049;
                        }
                        .product-info {
                            background-color: #f8f9fa;
                            padding: 15px;
                            border-radius: 8px;
                            margin: 20px 0;
                        }
                        .product-name {
                            font-size: 18px;
                            font-weight: bold;
                            color: #2c3e50;
                            margin-bottom: 10px;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 12px;
                            color: #888888;
                        }
                    </style>
                </head>
                
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Besign. Customer Support</h1>
                        </div>
                        <div class="content">
                            <h2>Dear Customer,</h2>
                            <div class="message-box">
                                <p>${message}</p>
                            </div>
                            <div class="product-info">
                                <div class="product-name">${productName}</div>
                                <p>Your digital product is ready for download</p>
                            </div>
                            <div class="download-section">
                                <a href="#" class="download-btn">Download Now</a>
                            </div>
                            <p style="color: #666; font-size: 14px; margin-top: 20px;">
                                If you have any questions, please contact our support team.
                            </p>
                        </div>
                    </div>
                </body>
                </html>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }
    return confirmOrder(subject, message, mail, productName);
  },
};
