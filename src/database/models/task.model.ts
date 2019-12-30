import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'tasks', paranoid: false, timestamps: false })
export class TaskModel extends Model<TaskModel> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;
    @Column({ type: DataType.STRING(255), allowNull: false })
    title: string;
    @Column({ type: DataType.SMALLINT, allowNull: false, unique: true })
    priority: number;
}
