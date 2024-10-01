import jwt from "jsonwebtoken"; // Importa o módulo jsonwebtoken para manipulação de tokens JWT

const JWT_SECRET = process.env.JWT_SECRET; // Obtém a chave secreta do JWT a partir das variáveis de ambiente

const auth = (req, res, next) => {
    // Obtém o token do cabeçalho de autorização
    const token = req.headers.authorization;

    // Verifica se o token foi fornecido
    if (!token) {
        return res.status(401).json({ message: "Acesso negado" }); // Retorna erro 401 se o token não estiver presente
    }

    try {
        // Verifica e decodifica o token usando a chave secreta
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
        
        // Se o token for válido, armazena o ID do usuário no objeto de requisição
        req.userId = decoded.id;

        next(); // Passa para o próximo middleware ou rota
    } catch (err) {
        // Captura erros de decodificação e retorna um erro genérico
        console.error("Erro ao verificar o token:", err.message); // Loga o erro de forma controlada
        return res.status(401).json({ message: "Token inválido" }); // Retorna erro 401 se o token não for válido
    }
};

export default auth; // Exporta o middleware para ser usado em outras partes da aplicação
