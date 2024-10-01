import express from "express"; // Importa o módulo express para criar rotas
import { PrismaClient } from "@prisma/client"; // Importa o cliente Prisma para interagir com o banco de dados
import auth from "../../middleware/auth.js"; // Ajuste o caminho para o seu middleware de autenticação

const router = express.Router(); // Cria um novo roteador Express
const prisma = new PrismaClient(); // Instancia o PrismaClient corretamente

// Rota para obter as informações do usuário logado
router.get("/me", auth, async (req, res) => {
  try {
    const usuario = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Falha no servidor" });
  }
});

// Rota para editar as informações do usuário logado
router.put("/me", auth, async (req, res) => {
  const { name, email } = req.body; // Captura os dados do corpo da requisição

  try {
    const usuario = await prisma.user.update({
      where: { id: req.userId },
      data: { name, email }, // Atualiza o nome e o e-mail
    });

    res.status(200).json(usuario); // Retorna o usuário atualizado
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Falha ao atualizar usuário." });
  }
});

// Rota para excluir a conta do usuário logado
router.delete("/me", auth, async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.userId }, // Exclui o usuário pelo ID
    });

    res.status(204).send(); // Retorna um status 204 No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Falha ao excluir usuário." });
  }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
