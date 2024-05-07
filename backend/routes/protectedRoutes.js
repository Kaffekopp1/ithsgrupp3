const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const personController = require("../controllers/personController");
router.get("/", verifyToken, (req, res) => {
	res.status(200).json({ message: "Protected route accessed" });
});

router.delete(
	"/api/moviefromactor/",
	verifyToken,
	personController.deleteMovieFromPerson
);

module.exports = router;
