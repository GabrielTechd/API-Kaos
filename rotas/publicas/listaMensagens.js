// listaMensagens.js

import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Cria uma nova instância do PrismaClient
const router = express.Router(); // Cria um novo roteador Express

// Define a rota GET para listar todos os contatos
router.get('/listarmensagens', async (req, res) => {
    try {
        // Busca todos os contatos no banco de dados
        const contatos = await prisma.contact.findMany(); 
        
        // Retorna os contatos encontrados
        res.status(200).json(contatos);
    } catch (error) {
        // Em caso de erro, retorna um status 500 e uma mensagem de erro
        console.error("Erro ao buscar contatos:", error);
        return res.status(500).json({ message: "Falha ao buscar contatos." });
    }
});

// Define a rota DELETE para deletar uma mensagem
router.delete('/deletarmensagem/:id', async (req, res) => {
    const { id } = req.params; // Obtém o ID da mensagem a ser deletada

    try {
        // Deleta o contato no banco de dados pelo ID
        const deletedContact = await prisma.contact.delete({
            where: { id: id }
        });
        
        // Retorna o contato deletado
        res.status(200).json(deletedContact);
    } catch (error) {
        console.error("Erro ao deletar contato:", error);
        return res.status(500).json({ message: "Falha ao deletar contato." });
    }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
