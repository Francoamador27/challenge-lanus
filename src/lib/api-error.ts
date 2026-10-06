/** Error for non-OK API responses, carrying the HTTP status and the problem title. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, title: string) {
    super(title);
    this.name = "ApiError";
    this.status = status;
  }
}
