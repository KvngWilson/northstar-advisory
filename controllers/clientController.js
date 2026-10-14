const { readFile } = require("node:fs/promises");
const requiredStrings = [
  "id",
  "name",
  "classification",
  "riskCategory",
  "email",
  "phone",
  "advisor",
  "status",
  "lastReview",
  "nextReview",
  "objective",
  "notes",
];
const loadClients = async (dataPath) => {
  // Read per request; require(JSON) would cache data until the process restarts.
  const clients = JSON.parse(await readFile(dataPath, "utf8"));
  if (!Array.isArray(clients))
    throw new Error("Client dataset must be an array.");
  const ids = new Set();
  for (const client of clients) {
    if (
      !client ||
      requiredStrings.some(
        (key) => typeof client[key] !== "string" || !client[key].trim(),
      ) ||
      !["Individual", "Corporate"].includes(client.classification) ||
      !["Low", "Moderate", "High"].includes(client.riskCategory) ||
      !/^[A-Za-z0-9_-]+$/.test(client.id) ||
      ids.has(client.id) ||
      !Number.isFinite(client.portfolioValue) ||
      client.portfolioValue < 0 ||
      typeof client.kycComplete !== "boolean"
    ) {
      throw new Error("Invalid client record or duplicate ID.");
    }
    ids.add(client.id);
  }
  return clients;
};
const createClientController = (dataPath) => ({
  home: async (req, res) => {
    const clients = await loadClients(dataPath);
    res.render("pages/home", {
      title: "Overview",
      count: clients.length,
      corporate: clients.filter((c) => c.classification === "Corporate").length,
      highRisk: clients.filter((c) => c.riskCategory === "High").length,
      pendingKyc: clients.filter((c) => !c.kycComplete).length,
    });
  },
  list: async (req, res) => {
    const clients = await loadClients(dataPath);
    res.render("pages/clients", { title: "Client directory", clients });
  },
  details: async (req, res) => {
    const clients = await loadClients(dataPath);
    const client = clients.find((c) => c.id === req.params.id);
    if (!client)
      return res
        .status(404)
        .render("pages/error", {
          title: "Client not found",
          heading: "Client not found",
          message:
            "No client record matches this ID. Return to the directory to select a client.",
        });
    res.render("pages/clientDetails", { title: client.name, client });
  },
});
module.exports = { createClientController, loadClients };
