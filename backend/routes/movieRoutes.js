const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

//router.post('/api/categories', categoryController.createCategory);
router.get("/api/categories", movieController.getCategories);
router.get("/api/category/:id", movieController.getCategory);
router.get("/api/category/search/:search", movieController.getCategoryBySearch);
router.get("/api/movies/:amount", movieController.getMovies);
router.get(
  "/api/movies/search/:keyword/:amount",
  movieController.getMovieBySearch,
);
router.get("/api/actor/:actor", movieController.getActor);
router.get("/api/moviesactor/:movie", movieController.getActorsMovie);
router.get("/api/searcher/:keyword", movieController.getFromSearch);

router.get("/api/importMovie/:tmdbId", movieController.importMovie);
router.delete("/api/delete/movie/:id", movieController.deleteMovie);

module.exports = router;
