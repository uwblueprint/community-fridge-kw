import { resolve } from "path";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { dbURLTest, SQLOptions } from "../utilities/dbUtils";

const sequelizeOptions: SequelizeOptions = SQLOptions(
  [resolve(__dirname, "../models/*.model.{ts,js}")],
  true,
);

const testSql = new Sequelize(dbURLTest, sequelizeOptions);

export default testSql;
