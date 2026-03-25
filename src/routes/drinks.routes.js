const { Router } = require("express");
const {
  getAllDrinks,
  getDrinkById,
  createDrink,
  updateDrink,
  deleteDrink,
  getDrinkStats,
} = require("../controllers/drinks.controller");
const { validateDrink } = require("../middleware/validateDrink");
const { validateDrinkQuery } = require("../middleware/validateDrinkQuery");
const { requireAuth } = require("../middleware/requireAuth");
const { requireOwnership } = require("../middleware/requireOwnership");

const router = Router();

router.get("/", requireAuth, validateDrinkQuery, (req, res, next) => {
  return getAllDrinks(req, res, next);
});

router.get("/stats", requireAuth, validateDrinkQuery, (req, res, next) => {
  return getDrinkStats(req, res, next);
});

router.get("/:id", requireAuth, (req, res, next) => {
  return getDrinkById(req, res, next);
});

router.post("/", requireAuth, validateDrink, (req, res, next) => {
  return createDrink(req, res, next);
});

router.put("/:id", requireAuth, requireOwnership, validateDrink, (req, res, next) => {
  return updateDrink(req, res, next);
});

router.delete("/:id", requireAuth, requireOwnership, (req, res, next) => {
  return deleteDrink(req, res, next);
});

module.exports = router;