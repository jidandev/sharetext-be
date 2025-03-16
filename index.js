const express = require('express');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const subTaskRoutes = require('./routes/subTaskRoutes');
const {setupORM} = require("./config/db")

dotenv.config();

const app = express();
app.use(express.json());
setupORM();

app.use('/', taskRoutes);
app.use('/', subTaskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});