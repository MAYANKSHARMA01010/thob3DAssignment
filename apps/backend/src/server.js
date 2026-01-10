const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>Backend Running Successfully 🚀</h1>");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Local Backend URL: ${process.env.BACKEND_LOCAL_URL}`);
});
