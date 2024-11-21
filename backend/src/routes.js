const express = require("express");

const UserController = require("./controllers/UserController");

const authMiddlewares = require("../src/middlewares/auth");
const ActivisController = require("./controllers/ActivisController");

const router = express.Router();

// Users routes
router.get("/users", authMiddlewares, UserController.index);

router.post("/user", UserController.store);

router.put("/user/:user_id", UserController.update);

router.delete("/user/:user_id", authMiddlewares, UserController.delete);

router.post("/users/login", UserController.login);



router.get("/allActivis", authMiddlewares, ActivisController.index);

router.post("/activis", authMiddlewares, ActivisController.store);

router.put("/activis/:activis_id", authMiddlewares, ActivisController.update);

router.delete("/activis/:activis_id", authMiddlewares, ActivisController.delete);

module.exports = router;
