export const generateCustomId = async (
  modelName: string,
  prefix: string,
  sequelize: any,
) => {
  const lastRecord = await sequelize.model(modelName).findOne({
    order: [["createdAt", "DESC"]],
    attributes: ["id"],
  });

  const lastId = lastRecord?.id || `${prefix}000`; // Default to prefix + '000' if no record exists
  const numericPart = parseInt(lastId.slice(1), 10); // Remove prefix and convert to number
  const newId = `${prefix}${(numericPart + 1).toString().padStart(3, "0")}`; // Increment by 1 and pad with leading zeros

  return newId;
};
