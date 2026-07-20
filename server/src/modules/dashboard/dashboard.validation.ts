// dashboard.validation.ts

import { z } from "zod";

export const getDashboardSchema = z.object({});

export type GetDashboardInput = z.infer<typeof getDashboardSchema>;
