export type ApiResponse<T = Record<string, unknown>> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
