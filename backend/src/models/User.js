const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        islogged: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        hooks: {
          beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Activity, { foreignKey: "userId", as: "activities" });
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = User;
