import { Integer, JsonSchema, Maximum, MaxLength, Minimum, MinLength, Required, Schema } from '@decorators';
import { IReqSchema } from '@core';

@Schema()
class TaskCreateBodySchema extends JsonSchema {
    @Required()
    @MinLength(1)
    @MaxLength(255)
    title: string;

    @Required()
    @Integer()
    @Minimum(0)
    @Maximum(100)
    priority: number;
}

@Schema()
export class TaskCreateSchema extends JsonSchema implements IReqSchema {
    @Required()
    body: TaskCreateBodySchema;
}
