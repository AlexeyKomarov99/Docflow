const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const nodeCrypto = require('crypto');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        role: user.role,
        position: user.position,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        middleName: true,
        role: true,
        position: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Запрос на сброс пароля
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email обязателен' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь с таким email не найден' });
    }

    // Генерируем токен
    const resetToken = nodeCrypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 3600000); // 1 час

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // Выводим ссылку в консоль (вместо отправки на почту)
    console.log('========================================');
    console.log('Ссылка для сброса пароля:');
    console.log(`http://localhost:3000/reset-password?token=${resetToken}`);
    console.log('========================================');

    res.json({ message: 'Заявка на сброс пароля отправлена на почту' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Проверка токена
async function verifyResetToken(req, res) {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Токен недействителен или истек' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

// Сброс пароля
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен быть не менее 6 символов' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Токен недействителен или истек' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    res.json({ message: 'Пароль успешно обновлен' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { 
  login, 
  me, 
  forgotPassword, 
  verifyResetToken, 
  resetPassword 
};