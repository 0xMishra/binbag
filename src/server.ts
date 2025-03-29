import { app } from "./app";
import { config } from "./config";

import mongoose from "mongoose";

mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));

app.listen(config.PORT, () =>
  console.log(`server running on PORT:${process.env.PORT}`),
);
