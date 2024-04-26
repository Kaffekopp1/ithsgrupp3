const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const personController = require("../controllers/personController");
const searchController = require("../controllers/searchController");
const tmdController = require("../controllers/tmdController");

//router.post('/api/categories', categoryController.createCategory);
router.get("/api/categories", movieController.getCategories);
router.get("/api/category/:id", movieController.getCategory);
router.delete("/api/delete/movie/:id", movieController.deleteMovie);
router.get("/api/movies/:amount", movieController.getMovies);
router.put("/api/changeDescription/", movieController.changeMovieDescription);
router.get("/api/specificMovie/:movieId", movieController.getSpecificMovie);

router.get("/api/actorWithmovie/:actorId", personController.getActorWithmovie);
router.get("/api/actors/:amount", personController.getActors);
router.get("/api/moviesactor/:movie", personController.getActorsMovie);
router.delete("/api/delete/crew/:id", personController.deletePerson);
router.post("/api/addJobbTitle", personController.addJobbTitle);

router.get("/api/actor/:actor", searchController.getActorBySearch);
router.get(
  "/api/category/search/:search",
  searchController.getCategoryBySearch,
);
router.get(
  "/api/movies/search/:keyword/:amount",
  searchController.getMovieBySearch,
);
router.get("/api/searcher/:keyword", searchController.getFromSearch);

router.get("/api/importMovie/:tmdbId", tmdController.importMovie);

module.exports = router;
