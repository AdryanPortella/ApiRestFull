const { request, response } = require("express");
const express = require("express");
const routes = require("./routes");
const cors = require ("cors"); 

require("./database");

const app = express();

app.use(cors()); 

app.use(express.json());
app.use(routes);

const PORT = 2000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
