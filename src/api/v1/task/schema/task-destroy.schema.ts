import { JsonSchema, MinLength, Pattern, Required } from '@decorators';
import { IReqSchema } from '@core';

class TaskDestroyParamSchema extends JsonSchema {
    @Required()
    @Pattern('^[0-9]+$')
    taskId: string;
}

export class TaskDestroySchema extends JsonSchema implements IReqSchema {
    @Required()
    params: TaskDestroyParamSchema;
}
