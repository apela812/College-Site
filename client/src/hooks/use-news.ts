import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type NewsInput } from "@shared/routes";

// Helper to log and parse safely
function parseWithLogging<T>(schema: any, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw result.error;
  }
  return result.data;
}

export function useNews() {
  return useQuery({
    queryKey: [api.news.list.path],
    queryFn: async () => {
      const res = await fetch(api.news.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch news");
      const data = await res.json();
      // Use the Zod schema from our API definition
      return parseWithLogging(api.news.list.responses[200], data, "news.list");
    },
  });
}

export function useNewsArticle(id: number) {
  return useQuery({
    queryKey: [api.news.get.path, id],
    queryFn: async () => {
      if (!id || isNaN(id)) return null;
      const url = buildUrl(api.news.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch news article");
      const data = await res.json();
      return parseWithLogging(api.news.get.responses[200], data, "news.get");
    },
    enabled: !!id,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: NewsInput) => {
      const validated = api.news.create.input.parse(data);
      const res = await fetch(api.news.create.path, {
        method: api.news.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation Error");
        }
        throw new Error("Failed to create news");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.news.create.responses[201], responseData, "news.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.news.list.path] });
    },
  });
}
