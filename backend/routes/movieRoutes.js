const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

//router.post('/api/categories', categoryController.createCategory);
router.get("/api/categories", movieController.getCategories);
router.get("/api/category/:id", movieController.getCategory);
router.get("/api/category/:search", movieController.getCategoryBySearch);
router.get("/api/movies/:amount", movieController.getMovies);
module.exports = router;
