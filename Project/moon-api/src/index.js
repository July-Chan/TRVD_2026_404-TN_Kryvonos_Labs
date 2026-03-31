import express from 'express';
import cors from 'cors';
import { db } from './firebase.js';
import watchlistRoutes from './controllers/watchlistController.js';
import authRoutes from './controllers/AuthController.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Moon API",
        version: "1.0.0",
        description: "API для збереження фільмів у додатку Moon. Лабораторні роботи №3 та №4."
    },
    servers: [{ url: "http://localhost:3000" }],
    // === БЛОК ДОДАЄ КНОПКУ AUTHORIZE ===
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        }
    },
    security: [{ bearerAuth: [] }],

    paths: {
        "/api/watchlist/{userId}": {
            get: {
                summary: "Отримати список фільмів користувача",
                parameters: [{ name: "userId", in: "path", required: true, description: "ID користувача", schema: { type: "string" } }],
                responses: { "200": { description: "Успішне отримання списку (DTO)" } }
            }
        },
        "/api/watchlist": {
            post: {
                summary: "Додати фільм у список",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    userId: { type: "string", example: "user123" },
                                    movieId: { type: "integer", example: 550 },
                                    title: { type: "string", example: "Бійцівський клуб" },
                                    posterPath: { type: "string", example: "/pB8O4LaSqruRUz.jpg" }
                                }
                            }
                        }
                    }
                },
                responses: { "201": { description: "Фільм успішно додано" } }
            }
        },
        "/api/watchlist/{id}": {
            delete: {
                summary: "Видалити фільм зі списку",
                parameters: [{ name: "id", in: "path", required: true, description: "ID документа в базі", schema: { type: "string" } }],
                responses: { "200": { description: "Фільм видалено" } }
            }
        },
        // === НОВИЙ МАРШРУТ ДЛЯ АДМІНІВ ===
        "/api/watchlist/admin/secret": {
            get: {
                summary: "Секретна адмін-панель (тільки для admin)",
                responses: {
                    "200": { description: "Доступ дозволено" },
                    "403": { description: "Доступ заборонено (тільки для адмінів)" }
                }
            }
        },
        // =================================
        "/api/auth/register": {
            post: {
                summary: "Реєстрація нового користувача",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "test@moon.com" },
                                    password: { type: "string", example: "superSecret123" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Користувача успішно зареєстровано (пароль захешовано)" },
                    "400": { description: "Помилка (наприклад, такий email вже існує)" }
                }
            }
        },
        "/api/auth/login": {
            post: {
                summary: "Вхід користувача (отримання JWT токена)",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    email: { type: "string", example: "test@moon.com" },
                                    password: { type: "string", example: "superSecret123" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": { description: "Успішний вхід (повертає токен)" },
                    "401": { description: "Неправильний email або пароль" }
                }
            }
        },
        "/api/auth/google": {
            post: {
                summary: "Вхід через Google",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { type: "object", properties: { email: { type: "string" } } } } }
                },
                responses: { "200": { description: "Успішний вхід" } }
            }
        }

    }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/watchlist', watchlistRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API для додатку Moon успішно працює!' });
});

app.listen(PORT, () => {
    console.log(`Сервер Moon API запущено на http://localhost:${PORT}`);
    console.log(`Swagger документація: http://localhost:${PORT}/api-docs`);
});