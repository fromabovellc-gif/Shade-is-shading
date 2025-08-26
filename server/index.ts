import express from "express";
const app = express();
const PORT = Number(process.env.PORT) || 5051;

app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/hello", (_req, res) => res.json({ message: "Hello from server" }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});
