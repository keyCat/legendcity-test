import { TaskService } from '../../../../database/services/task.service';
import { app } from '../../../../core/server';
import supertest, { SuperTest, Test, Response } from 'supertest';
import { CONFLICT, CREATED, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import alasql from 'alasql';

jest.mock('../../../../database/services/task.service');

function resetDb() {
    alasql('DELETE FROM tasks;');
}

describe('TaskController', () => {
    const path = {
        create: '/api/1/task',
        destroy: '/api/1/task/:taskId',
        get: '/api/1/task',
    };

    let agent: SuperTest<Test>;

    beforeAll((done: () => void) => {
        agent = supertest(app.getExpressApp());
        done();
    });

    afterEach((done: () => void) => {
        resetDb();
        done();
    });

    describe(`POST ${path.create}`, () => {
        it('should insert new Task into a database', (done: () => void) => {
            const dto = { title: 'Test1', priority: 0 };
            agent.post(path.create).type('application/json').send(dto)
                .end((err: Error, res: Response) => {
                    expect(err).toBeNull();
                    expect(res.status).toBe(CREATED);
                    expect(res.body.title).toEqual(dto.title);
                    expect(res.body.priority).toEqual(dto.priority);

                    done();
                });
        });

        it('should not allow to insert a Task with same priority as existing one', (done: () => void) => {
            const dto = { title: 'Test2', priority: 0 };
            agent.post(path.create).type('application/json').send(dto)
                .end(() => {
                    agent.post(path.create).type('application/json').send(dto)
                        .end((err: Error, res: Response) => {
                            expect(err).toBeNull();
                            expect(res.status).toBe(CONFLICT);
                            expect(res.body.statusCode).toBe(CONFLICT);
                            expect(res.body.error).toBe('Conflict');
                            expect(res.body.message).toBe(`Task with priority(${dto.priority}) already exists.`);

                            done();
                        });
                });
        });
    });

    describe(`GET ${path.get}`, () => {
        it('should get task with highest priority', (done: () => void) => {
            const dto1 = { title: 'Test', priority: 100 };
            const dto2 = { title: 'Test', priority: 0 };
            agent.post(path.create).type('application/json').send(dto1)
                .end(() => {
                    agent.get(path.get).send()
                        .end((err: Error, res: Response) => {
                            expect(err).toBeNull();
                            expect(res.status).toBe(OK);
                            expect(res.body.title).toBe(dto1.title);
                            expect(res.body.priority).toBe(dto1.priority);

                            agent.post(path.create).type('application/json').send(dto2)
                                .end(() => {
                                    agent.get(path.get).send()
                                        // tslint:disable-next-line:no-shadowed-variable
                                        .end((err: Error, res: Response) => {
                                            expect(err).toBeNull();
                                            expect(res.status).toBe(OK);
                                            expect(res.body.title).toBe(dto2.title);
                                            expect(res.body.priority).toBe(dto2.priority);
                                            done();
                                        });
                                });
                        });
                });
        });

        it('should return 404 if database is empty', (done: () => void) => {
            agent.get(path.get).send()
                .end((err: Error, res: Response) => {
                    expect(err).toBeNull();
                    expect(res.status).toBe(NOT_FOUND);
                    expect(res.body.statusCode).toBe(NOT_FOUND);
                    expect(res.body.error).toBe('Not Found');
                    expect(res.body.message).toBe('No Tasks exist.');
                    done();
                });
        });
    });

    describe(`DELETE ${path.destroy}`, () => {
        it('should delete Task from database', (done: () => void) => {
            const dto = { title: 'Test3', priority: 1 };
            agent.post(path.create).type('application/json').send(dto)
                .end((err: Error, res: Response) => {
                    const task = res.body;

                    agent.delete(path.destroy.replace(':taskId', task.id)).send()
                        // tslint:disable-next-line:no-shadowed-variable
                        .end((err: Error, res: Response) => {
                            expect(err).toBeNull();
                            expect(res.status).toBe(OK);
                            expect(res.body.id).toBe(task.id);
                            expect(res.body.title).toBe(task.title);
                            expect(res.body.priority).toBe(task.priority);
                            done();
                        });
                });
        });

        it('should check if Task exists', (done: () => void) => {
            agent.delete(path.destroy.replace(':taskId', 0)).send()
                .end((err: Error, res: Response) => {
                    expect(err).toBeNull();
                    expect(res.status).toEqual(NOT_FOUND);
                    expect(res.body.statusCode).toBe(NOT_FOUND);
                    expect(res.body.error).toBe('Not Found');
                    expect(res.body.message).toBe('Task with id(0) does not exist.');
                    done();
                });
        });
    });
});
