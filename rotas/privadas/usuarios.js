import express from "express"; // Importa o módulo express para criar rotas
import { PrismaClient } from "@prisma/client"; // Importa o cliente Prisma para interagir com o banco de dados

const router = express.Router(); // Cria um novo roteador Express
const prisma = new PrismaClient(); // Instancia o PrismaClient corretamente

// Função para enviar resposta de sucesso
const sendSuccessResponse = (res, data) => {
  res.status(200).json(data);
};

// Função para enviar resposta de erro
const sendErrorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ message });
};

// Rota para obter todos os usuários
router.get("/usuarios", async (req, res) => {
  try {
    // Busca todos os usuários, omitindo a senha
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // Adicione outros campos necessários aqui, omitindo a senha
      },
    });

    sendSuccessResponse(res, users); // Envia a lista de usuários como resposta
  } catch (err) {
    console.error("Erro ao buscar usuários:", err); // Log do erro para depuração
    sendErrorResponse(res, "Falha ao buscar usuários."); // Retorna uma mensagem de erro
  } finally {
    await prisma.$disconnect(); // Fecha a conexão com o banco de dados
  }
});

// Rota para deletar um usuário pelo ID
router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params; // Obtém o ID do usuário a ser deletado dos parâmetros da rota

  try {
    // Tenta excluir o usuário
    const usuario = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    // Se a exclusão for bem-sucedida, envia a resposta de sucesso
    sendSuccessResponse(res, { message: 'Usuário excluído com sucesso.', usuario });
  } catch (err) {
    // Verifica se o erro é relacionado à não existência do usuário
    if (err.code === 'P2025') {
      sendErrorResponse(res, 'Usuário não encontrado.', 404);
    } else {
      console.error("Erro ao excluir usuário:", err); // Log do erro para depuração
      sendErrorResponse(res, "Falha ao excluir usuário."); // Retorna uma mensagem de erro
    }
  } finally {
    await prisma.$disconnect(); // Fecha a conexão com o banco de dados
  }
});

export default router; // Exporta o roteador para ser usado em outros arquivos
