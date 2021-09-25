import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("users", {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    first_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataType.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataType.STRING,
      allowNull: false,
    },
    firebase_uuid: {
      type: DataType.UUID,
      allowNull: false,
    },
    role: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("users");
};
