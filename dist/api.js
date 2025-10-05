"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("./generated/prisma");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const prisma = new prisma_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3000;
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Locação de Jogos',
            version: '1.0.0',
            description: 'Documentação da API para o serviço de locação de jogos',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    },
    apis: ['./src/api.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// --- ROTAS DE JOGOS (GAMES) ---
// BUSCA TODA A LISTA
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Retorna uma lista de todos os jogos
 *     description: Obtém todos os jogos da base de dados.
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna uma lista de jogos.
 */
app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany();
    res.json(games);
});
// BUSCA POR ID
/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Retorna um jogo específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do jogo.
 *     responses:
 *       '200':
 *         description: Sucesso. Retorna os dados do jogo.
 *       '404':
 *         description: Jogo não encontrado.
 */
app.get('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const game = await prisma.game.findUniqueOrThrow({
            where: { id: Number(id) },
        });
        res.json(game);
    }
    catch (error) {
        res.status(404).json({ error: 'Jogo não encontrado' });
    }
});
// CRIA UM NOVO JOGO
/**
 * @swagger
 * /games:
 *   post:
 *     summary: Cria um novo jogo
 *     description: Adiciona um novo jogo à base de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               platform:
 *                 type: string
 *             example:
 *               title: "The Witcher 3"
 *               platform: "PC"
 *     responses:
 *       '201':
 *         description: Jogo criado com sucesso.
 */
app.post('/games', async (req, res) => {
    const { title, platform } = req.body;
    const newGame = await prisma.game.create({
        data: {
            title: title,
            platform: platform,
        },
    });
    res.status(201).json(newGame);
});
//ATUALIZA UM JOGO
/**
 * @swagger
 * /games/{id}:
 *   put:
 *     summary: Atualiza um jogo existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do jogo a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               platform:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Jogo atualizado com sucesso.
 *       '404':
 *         description: Jogo não encontrado.
 */
app.put('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, platform } = req.body;
        const updatedGame = await prisma.game.update({
            where: {
                id: Number(id),
            },
            data: {
                title: title,
                platform: platform,
            },
        });
        res.json(updatedGame);
    }
    catch (error) {
        res.status(404).json({ error: 'Jogo não encontrado' });
    }
});
// APAGA UM JOGO
/**
 * @swagger
 * /games/{id}:
 *   delete:
 *     summary: Apaga um jogo específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do jogo a ser apagado.
 *     responses:
 *       '204':
 *         description: Jogo apagado com sucesso.
 *       '404':
 *         description: Jogo não encontrado.
 */
app.delete('/games/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.game.delete({
            where: {
                id: Number(id),
            },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: 'Jogo não encontrado' });
    }
});
app.listen(port, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${port}`);
});
