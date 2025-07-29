const express = require("express");

const getAllPrimium = require("../controllers/premiumController");
const { authenticate } = require("../middleWare/authentication");

const premiumRoute = express.Router();

premiumRoute.get("/", authenticate, getAllPrimium);

module.exports = premiumRoute;
