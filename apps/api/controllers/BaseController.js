const BaseController = {
  getDataByPayload:
    (model, config = {}) =>
    async (req, res) => {
      try {
        const {
          page = 1,
          pageSize = 10,
          sortBy = "createdAt",
          sortOrder = "desc",
          freeText,
          ...filters
        } = req.query;
        const limit = parseInt(pageSize, 10);
        const pageNum = parseInt(page, 10);

        // const query = {};
        const query = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) =>
              value !== "" && value !== null && value !== undefined
          )
        );

        if (freeText?.trim()) {
          if (config.searchFields && config.searchFields.length > 0) {
            query.$or = config.searchFields.map((field) => ({
              [field]: { $regex: freeText.trim(), $options: "i" },
            }));
          } else {
            query.name = { $regex: freeText.trim(), $options: "i" };
          }
        }

        if (config.filters && typeof config.filters === "function") {
          await config.filters(query, { ...filters, freeText });
        }

        console.log("Query:", query);

        const { total, results } = await model.findWithPagination(
          query,
          pageNum,
          limit,
          sortBy,
          sortOrder
        );

        let additionalData = {};
        if (config.extraProcessing) {
          additionalData = await config.extraProcessing(results);
        }

        res.status(200).json({
          success: true,
          data: results,
          totalPages: Math.ceil(total / limit),
          currentPage: pageNum,
          totalItems: total,
          ...additionalData,
        });
      } catch (error) {
        console.error(error);
        res.status(200).json({
          success: false,
          message: "Error",
          error: error.message,
        });
      }
    },
};

export default BaseController;
