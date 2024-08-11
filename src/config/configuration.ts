export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
   
      db_host: process.env.DATABASE_HOST || 'localhost', // Добавьте значение по умолчанию
      db_port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      db_user: process.env.POSTGRES_USER,
      db_password: process.env.POSTGRES_PASSWORD,
      db_name: process.env.POSTGRES_DB,
    
    
      secret: process.env.SECRET_JWT || 'defaultSecret',
      expiresIn: process.env.EXPIRE_JWT || '2h',
    
    
      mailHost: process.env.MAIL_HOST,
      mailPort: parseInt(process.env.MAIL_PORT, 10) || 465,
      mailUser: process.env.MAIL_USER,
      mailPassword: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM,
    
      mailUrl: process.env.APP_URL || 'http://localhost:3000',
      mailUrlFront: process.env.APP_URL_FRONT || 'http://localhost:5173',
  });
  