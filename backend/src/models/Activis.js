const { Model, DataTypes } = require("sequelize");

class Activity extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        date: DataTypes.DATE,
      },
      {
        sequelize,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

module.exports = Activity;
