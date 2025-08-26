import express from "express";
const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/hello", (_req, res) => res.json({ message: "Hello from server" }));

app.get("/__debug", (_req, res) => {
  res.json({ ok: true, server: "express", port: PORT, time: new Date().toISOString() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
  console.log("SERVER DEBUG route ready");
});
