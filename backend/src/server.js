const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");

const app = express();


app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);

// ตั้งค่า Port และรัน Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});