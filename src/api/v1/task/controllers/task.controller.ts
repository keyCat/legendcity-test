// Task:
// - id
// - title (255)
// - priority (0-100)
import { Controller, Delete, Get, Post, Validate } from '@decorators';
import { Request, Response } from 'express';
import { TaskService } from '@database';
import { ConflictException, InternalServerErrorException, NotFoundException } from '@core';
import { TaskCreateSchema, TaskDestroySchema } from '../schema';
import { CREATED } from 'http-status-codes';

@Controller('/api/1/task')
export class TaskController {
    private readonly taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    @Get()
    public async get(req: Request, res: Response) {
        const task = await this.taskService.getOneOfHighestPriority();
        if (!task) {
            throw new NotFoundException('No Tasks exist.');
        }
        return task;
    }

    @Post()
    @Validate(TaskCreateSchema)
    public async create(req: Request, res: Response) {
        const createDto = req.body;
        // find if any task with given priority exists
        const existing = await this.taskService.findOne({ where: { priority: createDto.priority } });
        if (existing) {
            throw new ConflictException(`Task with priority(${createDto.priority}) already exists.`);
        }
        // create task
        const task = await this.taskService.create({ title: createDto.title, priority: createDto.priority });
        // set status to created
        res.status(CREATED);
        return task;
    }

    @Delete('/:taskId')
    @Validate(TaskDestroySchema)
    public async destroy(req: Request, res: Response) {
        const { taskId } = req.params;
        // find existing task
        const existing = await this.taskService.findById(taskId);
        if (!existing) {
            // task with given id doesn't exist
            throw new NotFoundException(`Task with id(${taskId}) does not exist.`);
        }
        // delete task
        const wasDeleted = await this.taskService.delete(taskId);
        if (!wasDeleted) {
            // unexpected / unhandled case
            throw new InternalServerErrorException(`Unable to delete Task with id(${taskId})`);
        }
        return existing;
    }
}
