const { ObjectId } = require("mongodb");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const ALLOWED_SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  rating_desc: { rating: -1, createdAt: -1 },
  rating_asc: { rating: 1, createdAt: -1 },
  caffeine_desc: { caffeineMg: -1, createdAt: -1 },
  caffeine_asc: { caffeineMg: 1, createdAt: -1 },
  brand_asc: { brand: 1, drinkName: 1 },
  brand_desc: { brand: -1, drinkName: 1 },
};

function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPositiveInteger(value, fallback) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
}

function toNumberOrNull(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function buildDrinkIdQuery(id) {
  const queries = [{ _id: id }];

  if (ObjectId.isValid(id)) {
    queries.push({ _id: new ObjectId(id) });
  }

  return { $or: queries };
}

function buildDrinkFilter(query = {}) {
  const clauses = [];

  if (query.brand) {
    clauses.push({
      brand: { $regex: escapeRegex(String(query.brand)), $options: "i" },
    });
  }

  if (query.search) {
    const regex = { $regex: escapeRegex(String(query.search)), $options: "i" };
    clauses.push({
      $or: [{ brand: regex }, { drinkName: regex }, { notes: regex }],
    });
  }

  const caffeineRange = {};
  const minCaffeine = toNumberOrNull(query.minCaffeine);
  const maxCaffeine = toNumberOrNull(query.maxCaffeine);

  if (minCaffeine !== null) caffeineRange.$gte = minCaffeine;
  if (maxCaffeine !== null) caffeineRange.$lte = maxCaffeine;
  if (Object.keys(caffeineRange).length > 0) {
    clauses.push({ caffeineMg: caffeineRange });
  }

  const ratingRange = {};
  const minRating = toNumberOrNull(query.minRating);
  const maxRating = toNumberOrNull(query.maxRating);

  if (minRating !== null) ratingRange.$gte = minRating;
  if (maxRating !== null) ratingRange.$lte = maxRating;
  if (Object.keys(ratingRange).length > 0) {
    clauses.push({ rating: ratingRange });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];

  return { $and: clauses };
}

function buildDrinkSort(sort = "newest") {
  return ALLOWED_SORTS[sort] || ALLOWED_SORTS.newest;
}

function getPagination(query = {}) {
  const page = toPositiveInteger(query.page, DEFAULT_PAGE);
  const requestedLimit = toPositiveInteger(query.limit, DEFAULT_LIMIT);
  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

module.exports = {
  ALLOWED_SORTS,
  buildDrinkFilter,
  buildDrinkIdQuery,
  buildDrinkSort,
  getPagination,
};