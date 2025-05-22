import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  status: "success" | "false";
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
};

export class ApiResponseHandler {
  static success<T>(
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ) {
    return NextResponse.json<ApiResponse<T>>(
      {
        status: "success",
        statusCode,
        message,
        data,
      },
      { status: statusCode }
    );
  }

  static error(message: string, statusCode: number = 400, error?: string) {
    return NextResponse.json<ApiResponse<null>>(
      {
        status: "false",
        statusCode,
        message,
        error,
      },
      { status: statusCode }
    );
  }
}
