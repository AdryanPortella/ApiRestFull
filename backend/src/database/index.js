const { Sequelize } = require("sequelize");
const User = require("../models/User");

const sequelize = new Sequelize("expresse_sequelize", "root", "12345678", {
  host: "localhost",
  dialect: "mysql",
});

User.init(sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("O Banco de dados está conectado IHULLLLLL.");
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
  });

module.exports = sequelize;
