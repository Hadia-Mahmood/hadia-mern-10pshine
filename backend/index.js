const express = require("express");
require("dotenv").config();
const userRoute = require('./routes/userRoute');
const notesRoute = require('./routes/noteRoute');

const databaseConnection = require('./DbConnection/db.connection');
databaseConnection();
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE,PATCH,HEAD",
    credentials: true,
  })
);


app.use(express.json());
app.use('/user', userRoute);
app.use('/notes', notesRoute);




// error handling
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  return res.status(statusCode).json({
    error: true,
    statusCode,
    message,
  })
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;
