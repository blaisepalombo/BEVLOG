const { getDb } = require("../db/mongodb");
const { buildDrinkIdQuery } = require("../utils/drinkQueryBuilder");

const COLLECTION = "drinks";

async function requireOwnership(req, res, next) {
  try {
    const db = getDb();
    const drink = await db.collection(COLLECTION).findOne(buildDrinkIdQuery(req.params.id));

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    if (!drink.createdBy || String(drink.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ error: "You do not have permission to modify this drink" });
    }

    req.drink = drink;
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { requireOwnership };