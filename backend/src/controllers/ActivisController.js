const User = require('../models/User');
const Activis = require('../models/Activis');

module.exports = {
  // Listar todas as atividades associadas a um usuário
  async index(req, res) {
    const { user_id } = req.params;

    try {
      const user = await User.findByPk(user_id, {
        include: { association: 'activities' },
      });

      if (!user) {
        return res.status(400).json({
          status: 400,
          message: 'Usuário não encontrado',
        });
      }

      return res.status(200).json(user.Activis);
    } catch (err) {
      return res.status(400).json({
        status: 0,
        error: err.message,
      });
    }
  },

  async store(req, res) {
    const { user_id } = req.params;
    const { name, description, status, date } = req.body;

    try {
      const user = await User.findByPk(user_id);

      if (!user) {
        return res.status(400).json({
          status: 0,
          message: 'Usuário não encontrado',
        });
      }

      const activis = await Activis.create({
        name,
        description,
        status,
        date,
        user_id,
      });

      return res.status(201).json({
        status: 1,
        message: 'Atividade cadastrada com sucesso',
        activis,
      });
    } catch (err) {
      return res.status(400).json({
        status: 0,
        error: err.message,
      });
    }
  },

  // Apagar uma atividade pelo ID
  async delete(req, res) {
    const { id } = req.params;

    try {
      const activis = await Activis.findByPk(id);

      if (activis) {
        await activis.destroy();

        return res.status(200).json({
          status: 1,
          message: 'Atividade apagada com sucesso',
        });
      } else {
        return res.status(400).json({
          status: 0,
          message: 'Atividade não encontrada',
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 0,
        error: err.message,
      });
    }
  },

  // Atualizar uma atividade pelo ID
  async update(req, res) {
    const { id } = req.params;
    const { name, description, status, date } = req.body;

    try {
      const activis = await Activis.findByPk(id);

      if (activis) {
        await activis.update({ name, description, status, date });

        return res.status(200).json({
          status: 1,
          message: 'Atividade atualizada com sucesso',
          activis,
        });
      } else {
        return res.status(400).json({
          status: 0,
          message: 'Atividade não encontrada',
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: 0,
        error: err.message,
      });
    }
  },
};
