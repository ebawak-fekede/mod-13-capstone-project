import { Router } from 'express';

import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask,
} from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import {
    createTaskSchema,
    taskQuerySchema,
    updateTaskSchema,
} from '../schemas/task.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(taskQuerySchema), getAllTasks);
router.get('/:id', getTaskById);
router.post('/', validate(createTaskSchema), createTask);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
