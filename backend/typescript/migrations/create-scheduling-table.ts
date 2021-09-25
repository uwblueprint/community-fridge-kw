import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("scheduling", {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    donor_id: {
      type: DataType.STRING,
      allowNull: false,
    },
    auth_id: {
      type: DataType.STRING,
      allowNull: false,
    },
    description: {
      type: DataType.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    start_time: {
      type: DataType.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataType.DATE,
      allowNull: false,
    },
    status: {
      type: DataType.ENUM("Rejected", "Approved", "Pending"),
      allowNull: false,
    },
    volunteer_needed: {
      type: DataType.BOOLEAN,
      allowNull: false,
    },
    volunteer_id: {
      type: DataType.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataType.TEXT,
      allowNull: true,
    }
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("scheduling");
};
