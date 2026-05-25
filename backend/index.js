const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const { initSocket, getIO } = require('./src/websocket/socket');

// Маршруты
const authController = require('./src/auth/auth.controller');
const authMiddleware = require('./src/middleware/auth');
const usersController = require('./src/users/users.controller');
const documentsController = require('./src/documents/documents.controller');
const documentsActions = require('./src/documents/documents.actions');
const randomizerController = require('./src/randomizer/randomizer.controller');
const filesController = require('./src/files/files.controller');

// Загрузка переменных окружения
dotenv.config();

const app = express();
const server = http.createServer(app);

// Настройка CORS и Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Парсинг JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Базовый маршрут для проверки
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth маршруты
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, authController.me);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.get('/api/auth/reset-token/:token', authController.verifyResetToken);
app.post('/api/auth/reset-password', authController.resetPassword);

// Users маршруты
app.get('/api/users', authMiddleware, usersController.getAllUsers);
app.get('/api/users/employees', authMiddleware, usersController.getEmployees);

// Documents маршруты
app.get('/api/documents', authMiddleware, documentsController.getAllDocuments);
app.get('/api/documents/incoming/queue', authMiddleware, documentsController.getRegistrationQueue);
app.get('/api/documents/pending', authMiddleware, documentsController.getPendingReview);
app.get('/api/documents/my-tasks', authMiddleware, documentsController.getMyTasks);
app.get('/api/documents/archive', authMiddleware, documentsController.getArchive);
app.get('/api/documents/secretary', authMiddleware, documentsController.getSecretaryDocuments);
app.get('/api/documents/:id', authMiddleware, documentsController.getDocumentById);

// Documents actions
app.get('/api/documents/secretary', authMiddleware, documentsController.getSecretaryDocuments);
app.patch('/api/documents/:id/register', authMiddleware, documentsActions.registerDocument);
app.post('/api/documents/:id/approve', authMiddleware, documentsActions.approveDocument);
app.patch('/api/documents/:id/execute', authMiddleware, documentsActions.executeDocument);
app.post('/api/documents/:id/sign', authMiddleware, documentsActions.signDocument);
app.patch('/api/documents/:id/outgoing', authMiddleware, documentsActions.sendDocument);

// Randomizer
app.post('/api/documents/incoming/generate', authMiddleware, randomizerController.generateDocument);

// Files
app.post('/api/documents/:id/files', authMiddleware, filesController.uploadFile);
app.get('/api/files/:id/download', authMiddleware, filesController.downloadFile);

// WebSocket
initSocket(server);

// Запуск сервера
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});