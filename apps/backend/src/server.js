const express = require("express");
const corsMiddleware = require("./configs/cors");
const authRouter = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userStatsRouter = require("./routes/user.stats.routes");
const adminStatsRouter = require("./routes/admin.stats.routes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use('/api/products', productRoutes);
app.use('/api/user', userStatsRouter);
app.use('/api/admin', adminStatsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter)

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
  console.log(`✅ Deployed Backend URL: ${process.env.BACKEND_SERVER_URL}`);
});
