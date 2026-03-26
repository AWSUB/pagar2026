require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const sppgRoutes = require('./routes/sppgRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const publicRoutes = require('./routes/publicRoutes');

db.sequelize.sync()
  .then(() => console.log('Database Connected & Synced'))
  .catch(err => console.log('Error: ' + err));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to PAGAR API 2026" });
});

app.use('/pagar/v1/auth', authRoutes);
app.use('/pagar/v1/admin', adminRoutes);
app.use('/pagar/v1/sppg', sppgRoutes);
app.use('/pagar/v1/school', schoolRoutes);
app.use('/pagar/v1/public', publicRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Your prefix API: http://localhost:${PORT}/pagar/v1`);
});