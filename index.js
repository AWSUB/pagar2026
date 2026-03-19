require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

db.sequelize.authenticate()
  .then(() => console.log('✅ Database Connected...'))
  .catch(err => console.log('❌ Error: ' + err));

app.get('/', (req, res) => {
  res.json({ message: "Welcome to PAGAR API 2026" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});