import { Prisma } from "@prisma/client";

export function serializeDecimal<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }

  if (value instanceof Prisma.Decimal) {
    return Number(value) as T;
  }

  if (value instanceof Date) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeDecimal(item)) as T;
  }

  if (typeof value === "object") {
    const serialized: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeDecimal(val);
    }

    return serialized as T;
  }

  return value;
}
