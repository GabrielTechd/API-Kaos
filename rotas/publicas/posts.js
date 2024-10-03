import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Rota para criar um novo post
router.post('/posts', async (req, res) => {
    const { title, photoLink, postName, description, coveredBy, eventDetails, eventLocation, message } = req.body;

    try {
        const newPost = await prisma.post.create({
            data: {
                title,
                photoLink,
                postName,
                description,
                coveredBy,
                eventDetails,
                eventLocation,
                message,
            },
        });

        res.status(201).json(newPost); // Retorna o post criado com status 201
    } catch (error) {
        console.error("Erro ao criar post:", error);
        res.status(500).json({ message: "Falha ao criar o post." });
    }
});

// Rota para listar todos os posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.status(200).json(posts); // Retorna os posts encontrados
    } catch (error) {
        console.error("Erro ao listar posts:", error);
        res.status(500).json({ message: "Falha ao listar posts." });
    }
});

// Rota para exibir um post pelo ID
router.get('/posts/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID da URL

    try {
        const post = await prisma.post.findUnique({
            where: { id: id },
        });

        if (!post) {
            return res.status(404).json({ message: "Post não encontrado." }); // Retorna 404 se o post não for encontrado
        }

        res.status(200).json(post); // Retorna o post encontrado
    } catch (error) {
        console.error("Erro ao buscar post:", error);
        res.status(500).json({ message: "Falha ao buscar o post." });
    }
});

// Rota para deletar um post pelo ID
router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID da URL

    try {
        await prisma.post.delete({
            where: { id: id },
        });
        res.status(204).send(); // Retorna status 204 No Content se a deleção for bem-sucedida
    } catch (error) {
        console.error("Erro ao deletar post:", error);
        if (error.code === 'P2025') {
            // Erro específico do Prisma para post não encontrado
            return res.status(404).json({ message: "Post não encontrado." });
        }
        res.status(500).json({ message: "Falha ao deletar o post." });
    }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
