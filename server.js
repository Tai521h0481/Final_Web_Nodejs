const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const rootRouter = require('./routers');
const path = require('path');
const staticPath = path.join(__dirname, 'public');
app.use("/public", express.static(staticPath));
app.use(express.json());    
app.use('/api', rootRouter);

// demo send linkLogin
app.use(express.static(__dirname));
const {authenticationLinkLogin} = require('./middlewares/authentication/authentication');
const pageChangePassword = process.env.pageChangePassword;
app.get(pageChangePassword, authenticationLinkLogin, (req, res) => {
  const Email = req.user.Email;
  res.redirect(`/changePassword.html?Email=${Email}`);
})
//

const {MONGO_URL} = process.env;

mongoose.connect(MONGO_URL)
  .then(() => console.log('Connect to mongoDB successfully'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(PORT,async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});