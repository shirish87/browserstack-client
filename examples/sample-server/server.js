import express from "express";
import path from "node:path";
import { createGateway } from "@dot-slash/browserstack-router";

const PORT = process.env.PORT ?? 40000;

const app = express();

app.use(express.static(path.resolve(import.meta.dirname, "public"), { dotfiles: "allow" }));

app.use("/gateway", (req, res, next) => {
  const username = req.headers["x-browserstack-username"];
  const accessKey = req.headers["x-browserstack-access-key"];
  delete req.headers["x-browserstack-username"];
  delete req.headers["x-browserstack-access-key"];

  if (typeof username !== "string" || !username || typeof accessKey !== "string" || !accessKey) {
    res.status(400).type("text/plain").send("Missing x-browserstack-username / x-browserstack-access-key headers");
    return;
  }

  const forwardRequest = createGateway({
    username,
    accessKey,
    allowedHosts: ["api.browserstack.com"],
  });
  forwardRequest(req, res, next);
});

app.listen(PORT, () => {
  console.log(`Sample server running at http://localhost:${PORT}`);
});
