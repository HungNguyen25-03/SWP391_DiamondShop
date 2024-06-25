const express = require("express");
const productRouters = express.Router();

// get all the controllers at once
const {
  getProduct,
  getProById,
  searchByName,
  filtering,
  getAllProductWithoutPaginationController,
} = require("../controller/products.controller");

// Define the routes with their corresponding controller functions
productRouters.post("/getProduct", getProduct);
productRouters.get("/getProById", getProById);
productRouters.get("/search", searchByName);
productRouters.post("/filter", filtering);
productRouters.get(
  "/getAllProductWithoutPagination",
  getAllProductWithoutPaginationController
);

module.exports = productRouters;
