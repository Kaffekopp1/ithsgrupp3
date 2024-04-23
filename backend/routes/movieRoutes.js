const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

//router.post('/api/categories', categoryController.createCategory);
router.get("/api/categories", movieController.getCategories);
router.get("/api/category", movieController.getCategory);
router.get("/api/movies", movieController.getMovies);
module.exports = router;
