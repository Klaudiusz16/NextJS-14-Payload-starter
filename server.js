const express = require("express");
const next = require("next");
const payload = require("payload");
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
require("dotenv").config();

const start = async () => {
  try {
    await app.prepare();
    const server = express();

    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      express: server,
    });

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log("> Ready on http://localhost:3000");
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
