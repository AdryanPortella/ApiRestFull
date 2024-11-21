// Configuração do banco de dados
const dbConfig = {
  host: "localhost",
  dialect: "mysql", 
  username: "root",
  password: "12345678",
  database: "expresse_sequelize",
  define: {
    timestamps: true,
    underscored: true,
  },
};

module.exports = dbConfig; // Exportando a configuração
