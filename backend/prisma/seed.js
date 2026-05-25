const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'secretary@docflow.ru' },
      update: {},
      create: {
        email: 'secretary@docflow.ru',
        password: password,
        firstName: 'Анна',
        lastName: 'Петрова',
        middleName: 'Ивановна',
        role: 'secretary',
        position: 'Секретарь',
      },
    }),
    prisma.user.upsert({
      where: { email: 'chief@docflow.ru' },
      update: {},
      create: {
        email: 'chief@docflow.ru',
        password: password,
        firstName: 'Владимир',
        lastName: 'Соколов',
        middleName: 'Николаевич',
        role: 'chief',
        position: 'Генеральный директор',
      },
    }),
    prisma.user.upsert({
      where: { email: 'employee@docflow.ru' },
      update: {},
      create: {
        email: 'employee@docflow.ru',
        password: password,
        firstName: 'Дмитрий',
        lastName: 'Кузнецов',
        middleName: 'Сергеевич',
        role: 'employee',
        position: 'Менеджер',
      },
    }),
    prisma.user.upsert({
      where: { email: 'smirnova@docflow.ru' },
      update: {},
      create: {
        email: 'smirnova@docflow.ru',
        password: password,
        firstName: 'Елена',
        lastName: 'Смирнова',
        middleName: 'Александровна',
        role: 'employee',
        position: 'Бухгалтер',
      },
    }),
    prisma.user.upsert({
      where: { email: 'popov@docflow.ru' },
      update: {},
      create: {
        email: 'popov@docflow.ru',
        password: password,
        firstName: 'Алексей',
        lastName: 'Попов',
        middleName: 'Игоревич',
        role: 'employee',
        position: 'Юрист',
      },
    }),
    prisma.user.upsert({
      where: { email: 'vasileva@docflow.ru' },
      update: {},
      create: {
        email: 'vasileva@docflow.ru',
        password: password,
        firstName: 'Марина',
        lastName: 'Васильева',
        middleName: 'Сергеевна',
        role: 'employee',
        position: 'Аналитик',
      },
    }),
    prisma.user.upsert({
      where: { email: 'novikov@docflow.ru' },
      update: {},
      create: {
        email: 'novikov@docflow.ru',
        password: password,
        firstName: 'Олег',
        lastName: 'Новиков',
        middleName: 'Дмитриевич',
        role: 'employee',
        position: 'Специалист',
      },
    }),
  ]);

  console.log('Created users:', users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });