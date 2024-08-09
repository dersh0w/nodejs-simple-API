require("dotenv").config();
const app = require("./src/app");

const port = process.env.APP_PORT ?? 3000;
app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
