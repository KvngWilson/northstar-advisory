const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createApp } = require("../app");
const records = require("../data/clients.json");
test("all pages use shared layout, navigation, footer and risk badges", async () => {
  const app = createApp();
  for (const url of ["/", "/clients", "/clients/NS-1001"]) {
    const response = await request(app).get(url).expect(200);
    for (const text of [
      "portal-header",
      "portal-nav",
      "portal-footer",
      "/css/bootstrap.min.css",
    ])
      assert.ok(response.text.includes(text));
  }
  const list = await request(app).get("/clients");
  for (const client of records)
    assert.ok(list.text.includes(`/clients/${client.id}`));
  assert.ok(list.text.includes("Moderate risk"));
  const detail = await request(app).get("/clients/NS-1001");
  assert.ok(detail.text.includes("Compliance &amp; risk"));
  assert.ok(detail.text.includes("Moderate risk"));
  await request(app).get("/clients/missing").expect(404);
  await request(app).get("/missing").expect(404);
  await request(app).get("/images/northstar.svg").expect(200);
  await request(app).get("/css/bootstrap.min.css").expect(200);
});
test("saved data changes appear without restarting; EJS escapes content; invalid data returns 500", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "northstar-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const dataPath = path.join(directory, "clients.json");
  await fs.writeFile(dataPath, JSON.stringify(records));
  const app = createApp({ dataPath });
  await request(app).get("/clients").expect(200);
  const changed = [
    { ...records[0], name: "<script>alert(1)</script>", riskCategory: "High" },
  ];
  await fs.writeFile(dataPath, JSON.stringify(changed));
  const list = await request(app).get("/clients").expect(200);
  assert.ok(list.text.includes("&lt;script&gt;"));
  assert.ok(!list.text.includes("<script>alert(1)</script>"));
  const detail = await request(app).get("/clients/NS-1001").expect(200);
  assert.ok(detail.text.includes("High risk"));
  await fs.writeFile(dataPath, "[]");
  assert.ok(
    (await request(app).get("/clients").expect(200)).text.includes(
      "No client records",
    ),
  );
  await fs.writeFile(dataPath, "invalid json");
  await request(app).get("/clients").expect(500);
});
