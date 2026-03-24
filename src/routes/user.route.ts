import { Router } from 'express';

import {
    createCategory,
    deleteCategory,
    getCategories,
    getProfile,
    updateCategory,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validator.middleware.js';
import {
    createCategorySchema,
    updateCategorySchema,
} from '../schemas/task.schema.js';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/categories', getCategories);
router.post('/categories', validate(createCategorySchema), createCategory);
router.put('/categories/:id', validate(updateCategorySchema), updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
