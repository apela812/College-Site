import { z } from 'zod';
import { insertNewsSchema, news, loginSchema, insertUserSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: loginSchema,
      responses: {
        200: z.object({
          token: z.string(),
          user: z.object({
            id: z.number(),
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.string(),
            groupId: z.number().optional(),
          }),
        }),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.object({
          token: z.string(),
          user: z.object({
            id: z.number(),
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            role: z.string(),
            groupId: z.number().optional(),
          }),
        }),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.object({
          id: z.number(),
          email: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          role: z.string(),
          groupId: z.number().optional(),
        }),
        401: errorSchemas.unauthorized,
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news' as const,
      responses: {
        200: z.array(z.custom<typeof news.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/news/:id' as const,
      responses: {
        200: z.custom<typeof news.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/news' as const,
      input: insertNewsSchema,
      responses: {
        201: z.custom<typeof news.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type NewsInput = z.infer<typeof api.news.create.input>;
export type NewsResponse = z.infer<typeof api.news.create.responses[201]>;
export type NewsListResponse = z.infer<typeof api.news.list.responses[200]>;
