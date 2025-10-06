import "express-async-errors";
import express from "express";
import { z } from "zod";
import { gameRouter } from "./routes/game.routes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Schema do Zod atualizado
export const createGameSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(3, { message: "O título precisa ter pelo menos 3 caracteres." }),
    platform: z
      .string()
      .min(1, { message: "A plataforma é obrigatória." }),
  }),
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Games",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use(gameRouter);

// Middleware de Erros
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor rodando com sucesso em rede local. URL: http://localhost:${port}`);
});

export default app;