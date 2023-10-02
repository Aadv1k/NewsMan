export enum ErrorStatus {
    badInput = "BAD_INPUT",
    notFound = "NOT_FOUND",
    internalError = "INTERNAL_ERROR",
    unauthorized = "UNAUTHORIZED",
    conflict = "CONFLICT"
}


interface ErrorResponse {
  status: "error";
  error: {
    code: number;
    message: string;
    status: ErrorStatus;
    details: any;
  };
}

interface SuccessResponse {
  status: "success";
  message: string;
  data: any;
}

export class ErrorResponseBuilder {
  private error: {
    code: number;
    message: string;
    status: ErrorStatus;
    details: any;
  } = {
    code: 0,
    message: "",
    status: ErrorStatus.badInput,
    details: null,
  };

  withCode(code: number): this {
    this.error.code = code;
    return this;
  }

  withMessage(message: string): this {
    this.error.message = message;
    return this;
  }

  withStatus(status: ErrorStatus): this {
    this.error.status = status;
    return this;
  }

  withDetails(details: any): this {
    this.error.details = details;
    return this;
  }

  build(): ErrorResponse {
    return {
      status: "error",
      error: this.error,
    };
  }
}

export class SuccessResponseBuilder {
  private response: SuccessResponse = {
    status: "success",
    message: "",
    data: null,
  };

  withMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  withData(data: any): this {
    this.response.data = data;
    return this;
  }

  build(): SuccessResponse {
    return this.response;
  }
}
