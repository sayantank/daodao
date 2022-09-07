export class LibError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LibError";
  }
}
