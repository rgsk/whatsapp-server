import { ApolloError } from "apollo-server-errors";

export class CustomError extends ApolloError {
  constructor(
    message: string,
    code: string = "",
    extensions?: Record<string, any> | undefined
  ) {
    super(message, code, { ...extensions, custom: true });
  }
}

export class NotFoundError extends ApolloError {
  constructor(message: string, extensions?: Record<string, any> | undefined) {
    super(message, "NOT_FOUND", { ...extensions, custom: true });
  }
}
