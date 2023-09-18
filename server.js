const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const rootRouter = require('./routers');
const {sequelize} = require("./models");
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

app.listen(PORT,async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});