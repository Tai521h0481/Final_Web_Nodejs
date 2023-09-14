const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const rootRouter = require('./routers/index.router');

app.use(rootRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});