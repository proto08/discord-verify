import { NextResponse } from "next/server";
import { HttpError } from "@/entities/errors";

type RouteHandler = (...args: never[]) => Response | Promise<Response>;

export function withExceptionHandler<T extends RouteHandler>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof HttpError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode },
        );
      }

      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }) as T;
}
