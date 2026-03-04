import { z } from 'zod';
import { insertNewsSchema, news } from './schema';

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
};

export const api = {
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
