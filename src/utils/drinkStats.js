function buildDrinkStatsPipeline(filter = {}) {
  return [
    {
      $facet: {
        overview: [
          { $match: filter },
          {
            $group: {
              _id: null,
              totalDrinks: { $sum: 1 },
              averageCaffeineMg: { $avg: "$caffeineMg" },
              averageSugarG: { $avg: "$sugarG" },
              averageRating: { $avg: "$rating" },
              newestEntryAt: { $max: "$createdAt" },
            },
          },
        ],
        topBrands: [
          { $match: filter },
          { $group: { _id: "$brand", count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } },
          { $limit: 5 },
          { $project: { _id: 0, brand: "$_id", count: 1 } },
        ],
        topRated: [
          { $match: { ...filter, rating: { $ne: null } } },
          { $sort: { rating: -1, createdAt: -1 } },
          { $limit: 3 },
          {
            $project: {
              _id: 1,
              brand: 1,
              drinkName: 1,
              rating: 1,
              caffeineMg: 1,
            },
          },
        ],
      },
    },
  ];
}

module.exports = { buildDrinkStatsPipeline };