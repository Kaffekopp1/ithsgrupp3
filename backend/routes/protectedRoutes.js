const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const personController = require("../controllers/personController");
router.get("/", verifyToken, (req, res) => {
	res.status(200).json({ message: "Protected route accessed" });
});
//ta bort film från person
router.delete(
	"/api/moviefromactor/",
	verifyToken,
	personController.deleteMovieFromPerson
);
//byt namn på person
router.put(
	"/api/changeChangeName/:personName/:personId",
	verifyToken,
	personController.changeChangeName
);
//add movie to persono
router.post(
	"/api/addMovieToPerson/",
	verifyToken,
	personController.addMovieToPerson
);

module.exports = router;
