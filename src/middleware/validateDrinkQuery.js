const { ALLOWED_SORTS } = require("../utils/drinkQueryBuilder");

function isPositiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0;
}

function isValidNumber(value) {
  const parsed = Number(value);
  return !Number.isNaN(parsed);
}

function validateDrinkQuery(req, res, next) {
  const {
    page,
    limit,
    sort,
    minCaffeine,
    maxCaffeine,
    minRating,
    maxRating,
  } = req.query;

  if (page !== undefined && !isPositiveInteger(page)) {
    return res.status(400).json({ error: "page must be a positive integer" });
  }

  if (limit !== undefined && !isPositiveInteger(limit)) {
    return res.status(400).json({ error: "limit must be a positive integer" });
  }

  if (sort !== undefined && !ALLOWED_SORTS[sort]) {
    return res.status(400).json({
      error: `sort must be one of: ${Object.keys(ALLOWED_SORTS).join(", ")}`,
    });
  }

  if (minCaffeine !== undefined && !isValidNumber(minCaffeine)) {
    return res.status(400).json({ error: "minCaffeine must be a valid number" });
  }

  if (maxCaffeine !== undefined && !isValidNumber(maxCaffeine)) {
    return res.status(400).json({ error: "maxCaffeine must be a valid number" });
  }

  if (minRating !== undefined && !isValidNumber(minRating)) {
    return res.status(400).json({ error: "minRating must be a valid number" });
  }

  if (maxRating !== undefined && !isValidNumber(maxRating)) {
    return res.status(400).json({ error: "maxRating must be a valid number" });
  }

  if (
    minCaffeine !== undefined &&
    maxCaffeine !== undefined &&
    Number(minCaffeine) > Number(maxCaffeine)
  ) {
    return res.status(400).json({ error: "minCaffeine cannot be greater than maxCaffeine" });
  }

  if (
    minRating !== undefined &&
    maxRating !== undefined &&
    Number(minRating) > Number(maxRating)
  ) {
    return res.status(400).json({ error: "minRating cannot be greater than maxRating" });
  }

  return next();
}

module.exports = { validateDrinkQuery };