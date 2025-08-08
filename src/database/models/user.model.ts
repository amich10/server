import { Table, Column, Model, DataType } from "sequelize-typescript";
import { UserRole } from "../../interfaces/interfaces";

@Table({
  tableName: "users", // gui(phpMyAdmin) ma dekhne table name
  modelName: "User", //project bhitra table lai access garne name
  timestamps: true,
})
class User extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, //database level validation
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
  })
  declare password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  declare email: string;
  @Column({
    type: DataType.ENUM("teacher", "institute", "super-admin", "student"),
    defaultValue: "student",
  })
  declare role: UserRole;
  @Column({
    type: DataType.STRING,
  })
  declare currentInstituteNumber: string;
}

export default User;
