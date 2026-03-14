import baseModel from "../models/baseModel";

const baseService = {
  create: async (data) => baseModel.create(data),
  getById: async (id) => baseModel.findById(id),
  getByEmail: async (email) => baseModel.findOne({ email }),
  getAll: async () => baseModel.findAll(),
  updateById: async (id, data) => baseModel.updateById(id, data),
  deleteById: async (id) => baseModel.deleteById(id),
};

export default baseService;
