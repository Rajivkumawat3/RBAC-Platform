
const dotenv = require('dotenv');
dotenv.config({ path: './src/config/config.env' });

const { app, bootstrapDynamicModels, sequelize } = require('./app');
const { connectDatabase } = require('./config/database');

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

(async () => {
  try {
  
    const PORT = process.env.PORT || 3001;
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
     
    await connectDatabase();    
    await sequelize.sync();       
    await bootstrapDynamicModels();

    
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
})();
