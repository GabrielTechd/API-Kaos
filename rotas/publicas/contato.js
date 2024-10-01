import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Cria uma nova instância do PrismaClient
const router = express.Router(); // Cria um novo roteador Express

// Define a rota POST para criar um novo contato
router.post('/contato', async (req, res) => {
    try {
        const contato = req.body; // Obtém os dados do contato do corpo da requisição

        // Validação básica para verificar se todos os campos estão presentes
        if (!contato.name || !contato.email || !contato.phone || !contato.message) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Valida o comprimento da mensagem
        if (contato.message.length > 500) {
            return res.status(400).json({ message: "A mensagem deve ter no máximo 500 caracteres." });
        }

        // Cria um novo contato no banco de dados usando os dados fornecidos
        const newContact = await prisma.contact.create({
            data: {
                name: contato.name,
                email: contato.email,
                phone: contato.phone,
                message: contato.message,
            }
        });
        
        // Retorna uma resposta de sucesso com o contato criado
        res.status(201).json(newContact); // Retorna os dados do contato criado
    } catch (error) {
        // Em caso de erro, retorna um status 500 e uma mensagem de erro
        console.error("Erro ao salvar contato:", error);
        return res.status(500).json({ message: "Falha ao salvar contato." });
    }
});

// Define a rota GET para listar todas as mensagens de contato
router.get('/mensagens', async (req, res) => {
    try {
        const mensagens = await prisma.contact.findMany(); // Obtém todas as mensagens de contato
        return res.status(200).json(mensagens); // Retorna as mensagens em formato JSON
    } catch (error) {
        console.error("Erro ao obter mensagens:", error);
        return res.status(500).json({ message: "Falha ao obter mensagens." });
    }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
