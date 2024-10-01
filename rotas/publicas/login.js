import express from "express"; // Importa o módulo express para criar rotas
import bcrypt from "bcrypt"; // Importa o bcrypt para hashing de senhas
import { PrismaClient } from "@prisma/client"; // Importa o cliente Prisma para interagir com o banco de dados
import jwt from "jsonwebtoken"; // Importa o módulo jsonwebtoken para gerar tokens JWT

const prisma = new PrismaClient(); // Cria uma nova instância do PrismaClient
const router = express.Router(); // Cria um novo roteador Express

const JWT_SECRET = process.env.JWT_SECRET; // Obtém a chave secreta do JWT do ambiente

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Obtém e-mail e senha do corpo da requisição

    // Verifica se o e-mail e a senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    // Busca o usuário pelo e-mail
    const usuario = await prisma.user.findUnique({
      where: { email },
    });

    // Verifica se o usuário existe
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    // Compara a senha fornecida com a senha armazenada
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha ou e-mail inválido." });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1d' });

    // Retorna o token ao usuário
    return res.status(200).json({ token }); // Envia o token como resposta
  } catch (error) {
    console.error("Erro no login:", error); // Log do erro para depuração
    return res.status(500).json({ message: "Erro ao logar, tente novamente." });
  }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
