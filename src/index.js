import app from "./api/server.js";
import dotenv from "dotenv";

dotenv.config({
  override: true
});

const port =
  process.env.PORT || 3000;

app.listen({
  port,
  host: "0.0.0.0"
})
.then(() => {
  console.log(
    `ReplicationCode running on ${port}`
  );
});
