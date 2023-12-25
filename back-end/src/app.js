const express = require('express');
const userRoutes = require('./routes/recipeRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 1212;

app.use(cors()); // Nodig om beveiliging te omzeilen
app.use(bodyParser.json());
app.use('/api', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
})
