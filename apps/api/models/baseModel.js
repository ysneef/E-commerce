import { v4 } from "uuid"

const baseModel = (model) => ({
  generateStringId: () => v4().replace(/-/g, ""),
  create: (data) => {
    try {
      return model.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  findAll: (query = {}, fields = "") => {
    try {
      return model.find(query).select(fields);
    } catch (error) {
      throw new Error(error.message);
    }
  },


  findOneByCondition: (condition) => {
    try {
      return model.findOne(condition)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  findById: (id) => {
    try {
      return model.findById(id)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  updateById: (id, updateData) => {
    try {
      return model.findByIdAndUpdate(id, updateData, { new: true })
    } catch (error) {
      throw new Error(error.message)
    }
  },

  deleteById: (id) => {
    try {
      return model.findByIdAndDelete(id)
    } catch (error) {
      throw new Error(error.message)
    }
  },

  findWithPagination: async (condition, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc") => {
    try {
      const skip = (page - 1) * limit
      const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const results = await model.find(condition)
        .sort(sort)
        .skip(skip)
        .limit(limit)
      const total = await model.countDocuments(condition)

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        results,
      }
    } catch (error) {
      throw new Error(error.message)
    }
  },

  countDocuments: async (filter) => {
    return await model.countDocuments(filter);
  },


})

export default baseModel
