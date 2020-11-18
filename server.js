const express = require("express");

const connectDb = require('./db');

console.log('Connect DB', connectDb);

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json({ extended: false }));

app.use("/payment", require("./routes/payment"));

app.listen(port, () => console.log(`server started on port ${port}`));
