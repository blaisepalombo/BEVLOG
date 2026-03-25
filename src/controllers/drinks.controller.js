const { getDb } = require("../db/mongodb");
const {
  buildDrinkFilter,
  buildDrinkIdQuery,
  buildDrinkSort,
  getPagination,
} = require("../utils/drinkQueryBuilder");
const { buildDrinkStatsPipeline } = require("../utils/drinkStats");

const COLLECTION = "drinks";

function nowIso() {
  return new Date().toISOString();
}

function normalizeOptionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return Number(value);
}

function normalizePurchasedAt(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return new Date(value).toISOString();
}

function buildDrinkPayload(body) {
  return {
    brand: body.brand.trim(),
    drinkName: body.drinkName.trim(),
    sizeOz: Number(body.sizeOz),
    caffeineMg: normalizeOptionalNumber(body.caffeineMg),
    sugarG: normalizeOptionalNumber(body.sugarG),
    rating: normalizeOptionalNumber(body.rating),
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
    purchasedAt: normalizePurchasedAt(body.purchasedAt),
  };
}

function buildOwnedDrinkFilter(req) {
  return {
    ...buildDrinkFilter(req.query),
    userId: String(req.user.id),
  };
}

function buildOwnedDrinkIdQuery(req) {
  return {
    $and: [
      buildDrinkIdQuery(req.params.id),
      { userId: String(req.user.id) },
    ],
  };
}

async function getAllDrinks(req, res) {
  try {
    const db = getDb();
    const filter = buildOwnedDrinkFilter(req);
    const sort = buildDrinkSort(req.query.sort);
    const { page, limit, skip } = getPagination(req.query);

    const collection = db.collection(COLLECTION);

    const [data, total] = await Promise.all([
      collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getDrinkById(req, res) {
  try {
    const db = getDb();
    const drink = await db.collection(COLLECTION).findOne(buildOwnedDrinkIdQuery(req));

    if (!drink) {
      return res.status(404).json({ error: "Drink not found" });
    }

    return res.status(200).json(drink);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function createDrink(req, res) {
  try {
    const db = getDb();
    const timestamp = nowIso();
    const payload = buildDrinkPayload(req.body);

    const doc = {
      ...payload,
      userId: String(req.user.id),
      userDisplayName: req.user.displayName || null,
      userEmail: req.user.email || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const result = await db.collection(COLLECTION).insertOne(doc);
    return res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function updateDrink(req, res) {
  try {
    const db = getDb();
    const payload = buildDrinkPayload(req.body);

    const result = await db.collection(COLLECTION).updateOne(
      buildOwnedDrinkIdQuery(req),
      {
        $set: {
          ...payload,
          updatedAt: nowIso(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Drink not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function deleteDrink(req, res) {
  try {
    const db = getDb();
    const result = await db.collection(COLLECTION).deleteOne(buildOwnedDrinkIdQuery(req));

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Drink not found" });
    }

    return res.status(200).json({ message: "Drink deleted" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function getDrinkStats(req, res) {
  try {
    const db = getDb();
    const filter = buildOwnedDrinkFilter(req);

    const [stats] = await db
      .collection(COLLECTION)
      .aggregate(buildDrinkStatsPipeline(filter))
      .toArray();

    const overview = stats?.overview?.[0] || {
      totalDrinks: 0,
      averageCaffeineMg: null,
      averageSugarG: null,
      averageRating: null,
      newestEntryAt: null,
    };

    return res.status(200).json({
      overview,
      topBrands: stats?.topBrands || [],
      topRated: stats?.topRated || [],
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllDrinks,
  getDrinkById,
  createDrink,
  updateDrink,
  deleteDrink,
  getDrinkStats,
};