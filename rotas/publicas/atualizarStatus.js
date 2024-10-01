import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Define a rota PUT para atualizar o status da mensagem
router.put('/mensagem/:id/status', async (req, res) => {
    const { id } = req.params; // Obtém o ID da mensagem a partir da URL
    const { status } = req.body; // Obtém o novo status do corpo da requisição

    // Validação do status
    const validStatuses = ["pendente", "em atendimento", "atendido", "sem sucesso", "serviço fechado"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Status inválido." });
    }

    try {
        // Atualiza o status da mensagem no banco de dados
        const updatedMessage = await prisma.message.update({
            where: { id: parseInt(id) }, // Converte o ID para inteiro
            data: { status: status },
        });

        // Retorna a mensagem atualizada
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.error("Erro ao atualizar status da mensagem:", error);
        return res.status(500).json({ message: "Falha ao atualizar status da mensagem." });
    }
});

export default router;
