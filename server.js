require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./src/app");

const DB_URI = process.env.DB_URI;
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log(`Connected to MongoDB!`);
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB!`);
    console.log(err);
    process.exit(1);
  });
  
const port = process.env.APP_PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on :${port}`);
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed!");
  } catch (err) {
    console.log(`Erro closing MongoDB connection: ${err}`);
  }
  process.exit(0);
});
