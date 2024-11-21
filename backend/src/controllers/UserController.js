const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 78300,
  });
}

module.exports = {
  
  async login(req, res) {
    const { password, email, islogged } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(400).send({
          status: 0,
          message: "E-mail ou senha incorreta",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send({
          status: 0,
          message: "Senha incorreta",
        });
      }

      if (user.islogged) {
        return res.status(400).send({
          status: 0,
          message: "Usuário já está logado",
        });
      }

      const user_id = user.id;

      
      await User.update(
        { islogged },
        {
          where: {
            id: user_id,
          },
        }
      );

      
      user.password = undefined;

      const token = generateToken({ id: user.id });

      
      const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      return res.status(200).send({
        status: 1,
        message: "Usuário logado com sucesso",
        user: userResponse,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: 0,
        message: "Erro interno do servidor. Tente novamente mais tarde.",
      });
    }
  },

 
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "createdAt"],
      });

      if (users.length === 0) {
        return res.status(200).send({ message: "Nenhum usuário encontrado" });
      }

      return res.status(200).send({ users });
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      return res.status(500).send({
        status: 0,
        error: "Erro ao buscar usuários",
        details: err.message,
      });
    }
  },


  async store(req, res) {
    const { name, password, email } = req.body;

    
    if (!name || !password || !email) {
      return res.status(400).send({
        status: 0,
        message: "Os campos 'name', 'password' e 'email' são obrigatórios.",
      });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).send({
          status: 0,
          message: "E-mail já está em uso.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({ name, password: hashedPassword, email });
      return res.status(201).send({
        status: 1,
        message: "Usuário cadastrado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).send({
        status: 0,
        error: "Erro ao cadastrar usuário",
        details: err.message,
      });
    }
  },

  
  async update(req, res) {
    const { name, password, email } = req.body;
    const { user_id } = req.params;

    if (!name || !password || !email) {
      return res.status(400).send({
        status: 0,
        message: "Os campos 'name', 'password' e 'email' são obrigatórios.",
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const [updatedRows] = await User.update(
        { name, password: hashedPassword, email },
        { where: { id: user_id } }
      );

      if (updatedRows === 0) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado ou sem alterações.",
        });
      }

      return res.status(200).send({
        status: 1,
        message: "Usuário atualizado com sucesso!",
      });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).send({
        status: 0,
        error: "Erro ao atualizar usuário.",
        details: err.message,
      });
    }
  },

 
  async delete(req, res) {
    const { user_id } = req.params;

    try {
      const deletedRows = await User.destroy({
        where: { id: user_id },
      });

      if (deletedRows === 0) {
        return res.status(404).send({
          status: 0,
          message: "Usuário não encontrado para exclusão.",
        });
      }

      return res.status(200).send({
        status: 1,
        message: "Usuário deletado com sucesso",
      });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).send({
        status: 0,
        error: "Erro ao deletar usuário",
        details: err.message,
      });
    }
  },
};
