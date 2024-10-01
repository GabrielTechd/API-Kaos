import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Cria uma nova instância do PrismaClient
const router = express.Router(); // Cria um novo roteador Express

// Define a rota POST para cadastro de usuários
router.post('/cadastro', async (req, res) => {
    try {
        const usuario = req.body; // Obtém os dados do usuário do corpo da requisição

        // Gera um salt para o hashing da senha
        const salt = await bcrypt.genSalt(10);
        // Faz o hashing da senha do usuário usando o salt gerado
        const hashPassword = await bcrypt.hash(usuario.password, salt); // Corrigido de user para usuario

        // Cria um novo usuário no banco de dados usando os dados fornecidos
        const userdb = await prisma.user.create({
            data: {
                name: usuario.name, // Corrigido de user para usuario
                email: usuario.email, // Corrigido de user para usuario
                password: hashPassword, // Armazena a senha hashed
            }
        });
        
        // Retorna uma resposta de sucesso com o usuário criado
        res.status(201).json(userdb); // Adicionando a resposta de sucesso
    } catch (error) {
        // Em caso de erro, retorna um status 500 e uma mensagem de erro
        return res.status(500).json({ message: "Erro ao criar usuário, tente novamente." });
    }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
