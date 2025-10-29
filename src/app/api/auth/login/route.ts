import { NextRequest, NextResponse } from "next/server";
import { verifyUser, generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = await verifyUser(username, password);
    if (!user) {
      return NextResponse.json(
        { error: "نام کاربری یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "خطا در ورود" }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout
  const response = NextResponse.json({ success: true });
  response.cookies.delete("auth-token");
  return response;
}
