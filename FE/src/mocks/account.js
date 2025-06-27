// Danh sách tài khoản mẫu để test
export const accounts = [
  {
    id: "admin_01",
    username: "admin",
    password: "admin123",
    fullName: "Administrator",
    role: "admin",
    email: "admin@kcare.com",
    avatar:
      "https://ui-avatars.com/api/?name=Administrator&background=0D8ABC&color=fff",
    phone: "0901234567",
    status: "active",
    createdAt: "2024-01-01",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluXzAxIiwidXNlcm5hbWUiOiJhZG1pbiIsImZ1bGxOYW1lIjoiQWRtaW5pc3RyYXRvciIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5Aa2NhcmUuY29tIiwiaWF0IjoxNzA5NjQyNDAwLCJleHAiOjE3NDA3NDY0MDB9.8J7vqsf9fJxB4X4B4B4X4B4B4X4B4B4X4B4B4X4B",
  },
  {
    id: "tech_01",
    username: "technician1",
    password: "tech123",
    fullName: "Nguyễn Văn Kỹ Thuật",
    role: "technician",
    email: "technician1@kcare.com",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Van+Ky+Thuat&background=2ECC71&color=fff",
    phone: "0909876543",
    specialization: "Điện lạnh",
    status: "active",
    createdAt: "2024-01-15",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlY2hfMDEiLCJ1c2VybmFtZSI6InRlY2huaWNpYW4xIiwiZnVsbE5hbWUiOiJOZ3V54buFbiBWxINuIEvhu7kgVGh14bqtdCIsInJvbGUiOiJ0ZWNobmljaWFuIiwiZW1haWwiOiJ0ZWNobmljaWFuMUBrY2FyZS5jb20iLCJzcGVjaWFsaXphdGlvbiI6IsSQaeG7h24gbOG6oW5oIiwiaWF0IjoxNzA5NjQyNDAwLCJleHAiOjE3NDA3NDY0MDB9.9K8wrtg0gKxC5X5C5C5X5C5C5X5C5C5X5C5C5X5C",
  },
  {
    id: "tech_02",
    username: "technician2",
    password: "tech123",
    fullName: "Trần Thị Sửa Chữa",
    role: "technician",
    email: "technician2@kcare.com",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Thi+Sua+Chua&background=E74C3C&color=fff",
    phone: "0908765432",
    specialization: "Điện tử",
    status: "active",
    createdAt: "2024-02-01",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlY2hfMDIiLCJ1c2VybmFtZSI6InRlY2huaWNpYW4yIiwiZnVsbE5hbWUiOiJUcuG6p24gVGjhu4sgU-G7rWEgQ2jhu69hIiwicm9sZSI6InRlY2huaWNpYW4iLCJlbWFpbCI6InRlY2huaWNpYW4yQGtjYXJlLmNvbSIsInNwZWNpYWxpemF0aW9uIjoixJBp4buHbiB04butIiwiaWF0IjoxNzA5NjQyNDAwLCJleHAiOjE3NDA3NDY0MDB9.0L9xsth1hLyD6X6D6D6X6D6D6X6D6D6X6D6D6X6D",
  },
  {
    id: "user_01",
    username: "customer1",
    password: "user123",
    fullName: "Lê Văn Khách",
    role: "customer",
    email: "customer1@gmail.com",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Van+Khach&background=9B59B6&color=fff",
    phone: "0907654321",
    address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    status: "active",
    createdAt: "2024-02-15",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMDEiLCJ1c2VybmFtZSI6ImN1c3RvbWVyMSIsImZ1bGxOYW1lIjoiTMOqIFbEg24gS2jDoWNoIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6ImN1c3RvbWVyMUBnbWFpbC5jb20iLCJhZGRyZXNzIjoiMTIzIE5ndXnhu4VuIFbEg24gQ-G7qywgUXXhuq1uIDUsIFRQLkhDTSIsImlhdCI6MTcwOTY0MjQwMCwiZXhwIjoxNzQwNzQ2NDAwfQ.1M0ysui2iMzE7X7E7E7X7E7E7X7E7E7X7E7E7X7E",
  },
  {
    id: "user_02",
    username: "customer2",
    password: "user123",
    fullName: "Phạm Thị Hàng",
    role: "customer",
    email: "customer2@gmail.com",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thi+Hang&background=F1C40F&color=fff",
    phone: "0906543210",
    address: "456 Lê Hồng Phong, Quận 10, TP.HCM",
    status: "active",
    createdAt: "2024-03-01",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMDIiLCJ1c2VybmFtZSI6ImN1c3RvbWVyMiIsImZ1bGxOYW1lIjoiUGjhuqFtIFRo4buLIEjDoG5nIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6ImN1c3RvbWVyMkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiNDU2IEzDqiBIw7RuZyBQaG9uZywgUXXhuq1uIDEwLCBUUC5IQ00iLCJpYXQiOjE3MDk2NDI0MDAsImV4cCI6MTc0MDc0NjQwMH0.2N1ztuj3jNzF8X8F8F8X8F8F8X8F8F8X8F8F8X8F",
  },
];

// Hàm helper để kiểm tra thông tin đăng nhập
export const checkLogin = (username, password) => {
  return accounts.find(
    (account) => account.username === username && account.password === password
  );
};

// Hàm lấy thông tin tài khoản theo id
export const getAccountById = (id) => {
  return accounts.find((account) => account.id === id);
};

// Hàm lấy danh sách tài khoản theo vai trò
export const getAccountsByRole = (role) => {
  return accounts.filter((account) => account.role === role);
};
