require("dotenv").config();
const express = require("express");
const path = require("node:path");
const mongoose = require("mongoose");
const { fileStore } = require("./storage/file");
const { mongoStore } = require("./storage/mongo");
const { routes } = require("./routes/clients");
function createApp(options = {}) {
  const driver = options.driver || process.env.STORAGE_DRIVER || "file";
  if (!["file", "mongodb"].includes(driver))
    throw new Error("STORAGE_DRIVER must be file or mongodb");
  const store =
    options.store ||
    (driver === "mongodb"
      ? mongoStore()
      : fileStore(
          options.dataPath ||
            process.env.DATA_FILE ||
            path.join(__dirname, "data/clients.json"),
        ));
  const app = express();
  app.disable("x-powered-by");
  app.use(
    "/vendor/angular",
    express.static(path.join(__dirname, "node_modules/angular")),
  );
  app.use(
    "/vendor/bootstrap",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
  );
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/api", routes(store));
  app.get(["/", "/clients", "/clients/:id"], (req, res) =>
    res.sendFile(path.join(__dirname, "public/index.html")),
  );
  app.use((req, res) => res.status(404).json({ error: "Not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Client data is unavailable" });
  });
  return app;
}
async function start() {
  if ((process.env.STORAGE_DRIVER || "file") === "mongodb")
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/northstar",
    );
  const app = createApp();
  const port = Number(process.env.PORT || 3000);
  return app.listen(port, () =>
    console.log(`NorthStar: http://localhost:${port}`),
  );
}
if (require.main === module)
  start().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
module.exports = { createApp, start };
