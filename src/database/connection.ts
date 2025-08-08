import { Sequelize } from "sequelize-typescript";
import { dBConfig } from "../config/config";

const sequelize = new Sequelize({
  database: dBConfig.databaseName, //dB name
  dialect: dBConfig.dialect, //which dB are you using
  username: dBConfig.username, //default username
  password: dBConfig.password, //default password for mySQL
  host: dBConfig.host, //db location,
  port: dBConfig.port, //default port number
  models: [__dirname + "/models"], //curent location + '/models
});

sequelize
  .authenticate()
  .then(() => {
    console.log(".....connected to the mySQL DB successfully.....");
  })
  .catch((err) => {
    console.log("Error occured in connection to DB", err);
  });

//migrate
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Migrated sucessfully new changes");
  })
  .catch((err) => {
    console.log("Error occured in migrating", err);
  });
export default sequelize;
