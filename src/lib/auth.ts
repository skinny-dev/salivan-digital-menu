import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function verifyUser(username: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      username,
      isActive: true,
      password: { not: null },
    },
  });

  if (!user || !user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return { id: user.id, username: user.username!, role: user.role };
}

export function generateToken(user: {
  id: string;
  username: string;
  role: string;
}) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      role: string;
    };
  } catch {
    return null;
  }
}
