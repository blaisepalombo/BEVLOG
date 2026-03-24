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

router.get("/", validateDrinkQuery, (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Get drink logs with filtering, sorting, and pagination'
  // #swagger.description = 'Returns drink entries with optional filtering by brand, search term, caffeine range, rating range, sorting, and pagination.'
  // #swagger.parameters['brand'] = { in: 'query', description: 'Filter by brand name', type: 'string' }
  // #swagger.parameters['search'] = { in: 'query', description: 'Search by brand, drink name, or notes', type: 'string' }
  // #swagger.parameters['minCaffeine'] = { in: 'query', description: 'Minimum caffeine in mg', type: 'number' }
  // #swagger.parameters['maxCaffeine'] = { in: 'query', description: 'Maximum caffeine in mg', type: 'number' }
  // #swagger.parameters['minRating'] = { in: 'query', description: 'Minimum rating', type: 'number' }
  // #swagger.parameters['maxRating'] = { in: 'query', description: 'Maximum rating', type: 'number' }
  // #swagger.parameters['sort'] = {
  // #swagger.in = 'query',
  // #swagger.description = 'Sort option',
  // #swagger.type = 'string',
  // #swagger.enum = ['newest', 'oldest', 'rating_desc', 'rating_asc', 'caffeine_desc', 'caffeine_asc', 'brand_asc', 'brand_desc']
  // #swagger.parameters['page'] = { in: 'query', description: 'Page number', type: 'number' }
  // #swagger.parameters['limit'] = { in: 'query', description: 'Number of results per page', type: 'number' }
  return getAllDrinks(req, res, next);
});

router.get("/stats", validateDrinkQuery, (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Get aggregated drink stats'
  // #swagger.description = 'Returns overall drink statistics, top brands, and top rated entries.'
  // #swagger.parameters['brand'] = { in: 'query', description: 'Filter stats by brand name', type: 'string' }
  // #swagger.parameters['search'] = { in: 'query', description: 'Search by brand, drink name, or notes', type: 'string' }
  // #swagger.parameters['minCaffeine'] = { in: 'query', description: 'Minimum caffeine in mg', type: 'number' }
  // #swagger.parameters['maxCaffeine'] = { in: 'query', description: 'Maximum caffeine in mg', type: 'number' }
  // #swagger.parameters['minRating'] = { in: 'query', description: 'Minimum rating', type: 'number' }
  // #swagger.parameters['maxRating'] = { in: 'query', description: 'Maximum rating', type: 'number' }
  return getDrinkStats(req, res, next);
});

router.get("/:id", (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Get a drink log by ID'
  // #swagger.parameters['id'] = { in: 'path', description: 'Drink ID', required: true, type: 'string' }
  return getDrinkById(req, res, next);
});

router.post("/", requireAuth, validateDrink, (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Create a new drink log'
  // #swagger.description = 'Requires login. Creates a new drink entry associated with the authenticated user.'
  // #swagger.security = [{ "cookieAuth": [] }]
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Drink to create',
        required: true,
        schema: {
          type: 'object',
          required: ['brand', 'drinkName', 'sizeOz'],
          properties: {
            brand: { type: 'string', example: 'Ghost' },
            drinkName: { type: 'string', example: 'Blue Raspberry' },
            sizeOz: { type: 'number', example: 16 },
            caffeineMg: { type: 'number', example: 200 },
            sugarG: { type: 'number', example: 0 },
            rating: { type: 'number', example: 8 },
            notes: { type: 'string', example: 'Testing the upgraded API' },
            purchasedAt: { type: 'string', example: '2026-03-24T18:00:00.000Z' }
          }
        }
      }
  */
  return createDrink(req, res, next);
});

router.put("/:id", requireAuth, requireOwnership, validateDrink, (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Update a drink log by ID'
  // #swagger.description = 'Requires login and ownership. Only the user who created the entry can update it.'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', description: 'Drink ID', required: true, type: 'string' }
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Updated drink data',
        required: true,
        schema: {
          type: 'object',
          required: ['brand', 'drinkName', 'sizeOz'],
          properties: {
            brand: { type: 'string', example: 'Ghost' },
            drinkName: { type: 'string', example: 'Blue Raspberry' },
            sizeOz: { type: 'number', example: 16 },
            caffeineMg: { type: 'number', example: 200 },
            sugarG: { type: 'number', example: 0 },
            rating: { type: 'number', example: 9 },
            notes: { type: 'string', example: 'Updated review after trying it again' },
            purchasedAt: { type: 'string', example: '2026-03-24T18:00:00.000Z' }
          }
        }
      }
  */
  return updateDrink(req, res, next);
});

router.delete("/:id", requireAuth, requireOwnership, (req, res, next) => {
  // #swagger.tags = ['Drinks']
  // #swagger.summary = 'Delete a drink log by ID'
  // #swagger.description = 'Requires login and ownership. Only the user who created the entry can delete it.'
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['id'] = { in: 'path', description: 'Drink ID', required: true, type: 'string' }
  return deleteDrink(req, res, next);
});

module.exports = router;