import { DataType } from "sequelize-typescript";

import { Migration } from "../umzug";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("scheduling", {
    id: {
      type: DataType.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    donor_id: {
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
    volunteers_needed: {
      type: DataType.INTEGER,
      allowNull: false,
    },
    volunteer_ids: {
      type: DataType.ARRAY(DataType.INTEGER),
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
