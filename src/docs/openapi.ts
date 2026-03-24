const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'REST API for user auth, tasks, and categories',
  },
  servers: [{ url: '/' }],
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': { description: 'Service is healthy' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Register user',
        responses: {
          '201': { description: 'User created' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'List tasks',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Task list with pagination' },
        },
      },
      post: {
        summary: 'Create task',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Task created' },
        },
      },
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by id',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Task details' },
          '404': { description: 'Task not found' },
        },
      },
      put: {
        summary: 'Update task',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Task updated' },
          '404': { description: 'Task not found' },
        },
      },
      delete: {
        summary: 'Delete task',
        security: [{ bearerAuth: [] }],
        responses: {
          '204': { description: 'Task deleted' },
          '404': { description: 'Task not found' },
        },
      },
    },
    '/users/profile': {
      get: {
        summary: 'Get profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Profile data' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default openApiSpec;
