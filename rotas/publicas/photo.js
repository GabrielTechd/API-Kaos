import express from 'express';
import { PrismaClient } from '@prisma/client';
import auth from '../../middleware/auth.js'; // Certifique-se de usar o caminho correto para o seu middleware

const prisma = new PrismaClient();
const router = express.Router();

// Rota para criar uma nova foto
router.post('/fotos', async (req, res) => {
  const { title, photoLink, photoName } = req.body;

  if (!title || !photoLink || !photoName) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const newPhoto = await prisma.photo.create({
      data: {
        title,
        photoLink,
        photoName, // Altere para `PhotoName` se o modelo Prisma usar esse nome
      },
    });
    return res.status(201).json(newPhoto);
  } catch (error) {
    console.error("Erro ao criar foto:", error);
    return res.status(500).json({ message: "Erro ao criar foto." });
  }
});

// Rota para listar todas as fotos
router.get('/fotos', async (req, res) => {
  try {
    const photos = await prisma.photo.findMany();
    return res.status(200).json(photos);
  } catch (error) {
    console.error("Erro ao listar fotos:", error);
    return res.status(500).json({ message: "Falha ao listar fotos." });
  }
});

// Rota para deletar uma foto pelo ID
router.delete('/fotos/:id', async (req, res) => {
  const { id } = req.params; // Obtém o ID da URL

  try {
      await prisma.photo.delete({ // Verifique se está usando o nome correto aqui
          where: { id: id }, // O nome do campo deve corresponder ao que está no seu banco de dados
      });
      res.status(204).send(); // Retorna status 204 No Content se a deleção for bem-sucedida
  } catch (error) {
      console.error("Erro ao deletar foto:", error);
      if (error.code === 'P2025') {
          return res.status(404).json({ message: "Foto não encontrada." });
      }
      res.status(500).json({ message: "Falha ao deletar a foto." });
  }
});

export default router;
