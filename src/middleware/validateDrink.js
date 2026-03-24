function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function coerceNumberField(req, fieldName) {
  const value = req.body[fieldName];

  if (value === undefined || value === null || value === "") return;

  if (typeof value === "string") {
    const parsed = Number(value.trim());
    if (!Number.isNaN(parsed)) {
      req.body[fieldName] = parsed;
    }
  }
}

function isValidDateString(value) {
  if (typeof value !== "string") return false;
  return !Number.isNaN(new Date(value).getTime());
}

function validateDrink(req, res, next) {
  const body = req.body || {};

  coerceNumberField(req, "sizeOz");
  coerceNumberField(req, "caffeineMg");
  coerceNumberField(req, "sugarG");
  coerceNumberField(req, "rating");

  if (!isNonEmptyString(body.brand)) {
    return res.status(400).json({ error: "brand is required and must be a non-empty string" });
  }

  if (!isNonEmptyString(body.drinkName)) {
    return res.status(400).json({ error: "drinkName is required and must be a non-empty string" });
  }

  if (body.sizeOz === undefined || body.sizeOz === null) {
    return res.status(400).json({ error: "sizeOz is required" });
  }

  if (!Number.isFinite(body.sizeOz) || body.sizeOz <= 0) {
    return res.status(400).json({ error: "sizeOz must be a positive number" });
  }

  if (body.caffeineMg !== undefined && body.caffeineMg !== null) {
    if (!Number.isFinite(body.caffeineMg) || body.caffeineMg < 0) {
      return res.status(400).json({ error: "caffeineMg must be a number greater than or equal to 0" });
    }
  }

  if (body.sugarG !== undefined && body.sugarG !== null) {
    if (!Number.isFinite(body.sugarG) || body.sugarG < 0) {
      return res.status(400).json({ error: "sugarG must be a number greater than or equal to 0" });
    }
  }

  if (body.rating !== undefined && body.rating !== null) {
    if (!Number.isFinite(body.rating) || body.rating < 1 || body.rating > 10) {
      return res.status(400).json({ error: "rating must be a number between 1 and 10" });
    }
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== "string") {
      return res.status(400).json({ error: "notes must be a string" });
    }

    if (body.notes.length > 500) {
      return res.status(400).json({ error: "notes cannot exceed 500 characters" });
    }
  }

  if (body.purchasedAt !== undefined && body.purchasedAt !== null && body.purchasedAt !== "") {
    if (!isValidDateString(body.purchasedAt)) {
      return res.status(400).json({ error: "purchasedAt must be a valid date string or null" });
    }
  }

  return next();
}

module.exports = { validateDrink };