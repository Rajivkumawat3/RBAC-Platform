
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./config/database');
const { readAllModelFiles } = require('./utils/modelWriter');
const { defineModel } = require('./utils/dynamicModelLoader');
const { registerRoutesForModel } = require('./routes/dynamicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoute');

const app = express();




app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// CORS (app.js)
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ must be true for cookies
  })
);

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);



async function bootstrapDynamicModels() {
  const modelDefs = await readAllModelFiles();
  for (const def of modelDefs) {
    defineModel(def);
    registerRoutesForModel(app, def.name);
  }
}

module.exports = { app, bootstrapDynamicModels, sequelize };
