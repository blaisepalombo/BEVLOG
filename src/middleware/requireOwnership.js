const { getDb } = require("../db/mongodb");
const { buildDrinkIdQuery } = require("../utils/drinkQueryBuilder");

const COLLECTION = "drinks";

async function requireOwnership(req, res, next) {
  try {
    const db = getDb();
    const drink = await db.collection(COLLECTION).findOne({
      $and: [
        buildDrinkIdQuery(req.params.id),
        { userId: String(req.user.id) },
      ],
    });

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    req.drink = drink;
    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { requireOwnership };