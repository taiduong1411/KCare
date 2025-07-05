const express = require("express");
const app = express();
const { createServer } = require("http");
const httpServer = createServer(app);
const path = require("path");
const cors = require("cors");
const database = require("./src/database/database.config");
database.connect();
require("dotenv").config();

const port = process.env.PORT || 3000;

// Express Config
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// CORS config
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Router
const accountRouter = require("./src/routers/account.router");
const blogRouter = require("./src/routers/blog.router");
const adminRouter = require("./src/routers/admin.router");
const contactRouter = require("./src/routers/contact.router");
const bookingRouter = require("./src/routers/booking.router");
app.use("/api/account", accountRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);
app.use("/api/booking", bookingRouter);

// Start scheduler for timeout management
const { startScheduler } = require("./src/services/scheduler");
startScheduler();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
