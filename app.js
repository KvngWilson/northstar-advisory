const express = require("express");
const layouts = require("express-ejs-layouts");
const path = require("node:path");
const clientRoutes = require("./routes/clientRoutes");
const createApp = (options = {}) => {
  const app = express();
  app.disable("x-powered-by");
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.set("layout", "layouts/main");
  app.locals.money = (value) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(value);
  app.locals.riskClass = (risk) =>
    ({ Low: "low", Moderate: "moderate", High: "high" })[risk] || "unknown";
  app.use(
    "/css/bootstrap.min.css",
    express.static(
      path.join(__dirname, "node_modules/bootstrap/dist/css/bootstrap.min.css"),
    ),
  );
  app.use(express.static(path.join(__dirname, "public")));
  app.use(layouts);
  app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    res.locals.currentPath = req.path;
    res.locals.year = new Date().getFullYear();
    next();
  });
  app.use(
    clientRoutes(options.dataPath || path.join(__dirname, "data/clients.json")),
  );
  app.use((req, res) =>
    res
      .status(404)
      .render("pages/error", {
        title: "Page not found",
        heading: "Page not found",
        message: "The page or client record you requested does not exist.",
      }),
  );
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    console.error("Unable to render client data:", error.message);
    res
      .status(500)
      .render("pages/error", {
        title: "Data unavailable",
        heading: "Client data is temporarily unavailable",
        message:
          "The dataset could not be loaded. Please contact the operations team or try again after the dataset is corrected.",
      });
  });
  return app;
};
if (require.main === module) {
  const port = process.env.PORT || 3000;
  createApp().listen(port, () =>
    console.log(`NorthStar portal: http://localhost:${port}`),
  );
}
module.exports = { createApp };
