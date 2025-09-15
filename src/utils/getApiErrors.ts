import type { AxiosError } from "axios";

export function getApiErrors(err: unknown) {
  const ax = err as AxiosError<any>;
  const data = ax?.response?.data;

  if (Array.isArray(data?.errors)) {
    const fields: Record<string, string[]> = {};
    for (const it of data.errors) {
      if (!it?.field) continue;
      if (!fields[it.field]) fields[it.field] = [];
      fields[it.field].push(it.message || "Invalid value");
    }
    return { global: data?.message ?? "Validation failed", fields };
  }

  if (data?.errors && typeof data.errors === "object") {
    return {
      global: data?.message ?? "Validation failed",
      fields: data.errors as Record<string, string[]>,
    };
  }
  4;
  if (typeof data?.message === "string") {
    return { global: data.message, fields: {} };
  }

  return { global: ax?.message || "Unable to reach server", fields: {} };
}
