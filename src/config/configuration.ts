export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DATABASE_HOST || 'localhost', // Добавьте значение по умолчанию
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      name: process.env.POSTGRES_DB,
    },
    jwt: {
      secret: process.env.SECRET_JWT || 'defaultSecret',
      expiresIn: process.env.EXPIRE_JWT || '2h',
    },
    mailService: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10) || 465,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM,
    },
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    appUrlFront: process.env.APP_URL_FRONT || 'http://localhost:5173',
  });
  