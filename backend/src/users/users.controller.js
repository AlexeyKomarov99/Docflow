const prisma = require('../prisma');

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
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

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

async function getEmployees(req, res) {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'employee' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        middleName: true,
        position: true,
      },
    });

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
}

module.exports = { getAllUsers, getEmployees };