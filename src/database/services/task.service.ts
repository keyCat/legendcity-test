import { TaskModel } from '@database';
import { FindOptions } from 'sequelize';

export interface ITaskCreate {
    title: string;
    priority: number;
}

export interface ITaskUpdate {
    title?: string;
    priority?: number;
}

export class TaskService {
    private static instance: TaskService;
    private readonly Task: typeof TaskModel;

    constructor() {
        if (TaskService.instance) { return TaskService.instance; }
        this.Task = TaskModel;
        TaskService.instance = this;
    }

    /**
     * Searches for a single Task by criteria
     * @param {FindOptions} options - Sequelize criteria
     * @return {TaskModel|null} task
     * */
    public findOne(options: FindOptions): Promise<TaskModel | null> {
        return this.Task.findOne(options);
    }

    /**
     * Searches for a single Task by id
     * @param {number|string} taskId - Task unique id
     * @return {TaskModel|null} task
     * */
    public findById(taskId: number | string): Promise<TaskModel | null> {
        return this.Task.findByPk(taskId);
    }

    /**
     * Gets a single task with highest priority
     * @return {TaskModel|null} task
     * */
    public getOneOfHighestPriority(): Promise<TaskModel | null> {
        return this.findOne({
            order: [['priority', 'ASC']],
        });
    }

    /**
     * Creates a task with given data
     * @param {ITaskCreate} createDto - Create data
     * @return {TaskModel|null} task
     * */
    public create(createDto: ITaskCreate): Promise<TaskModel> {
        return this.Task.create({ ...createDto });
    }

    /**
     * Updates existing Task with data. Null is returned if task doesn't exist
     * @param {number|string} taskId - Unique Task id
     * @param {ITaskUpdate} updateDto - Update data
     * @return {TaskModel|null} task
     * */
    public async update(taskId: number | string, updateDto: ITaskUpdate): Promise<TaskModel | null> {
        const task = await this.findById(taskId);
        if (!task) { return null; }
        await task.update({ ...updateDto });
        return task;
    }

    /**
     * Deletes a single Task by given id.
     * @param {number|string} taskId - Unique Task id
     * @returns {boolean} wasDeleted
     * */
    public async delete(taskId: number | string): Promise<boolean> {
        const count = await this.Task.destroy({ where: { id: taskId } });
        return count === 1;
    }
}
