import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

interface UserPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: UserPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
};

export const verifyToken = (token: string): UserPayload | null => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", (error as Error).message);
    return null; // Token is invalid or expired
  }
};

// Custom type to augment NextRequest with user property
interface AuthenticatedRequest extends NextRequest {
  user?: UserPayload;
}

// Middleware for API routes
export const authMiddleware = (
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) => {
  return async (req: AuthenticatedRequest): Promise<NextResponse> => {
    const token =
      req.cookies.get("token")?.value ||
      req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token, authorization denied" },
        { status: 401 }
      );
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { message: "Token is not valid" },
          { status: 401 }
        );
      }
      req.user = decoded; // Attach user payload to request
      return handler(req);
    } catch (error) {
      console.error("Something went wrong with auth middleware", error);
      return NextResponse.json({ message: "Server Error" }, { status: 500 });
    }
  };
};
