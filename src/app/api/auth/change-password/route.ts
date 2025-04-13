import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/utils";
import User from "@/lib/models/user";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Add request body parsing
    const { currentPassword, newPassword } = await req.json();
    
    await dbConnect().catch(err => {
      console.error('Database connection error:', err);
      return NextResponse.json(
        { error: "Database connection failed" }, 
        { status: 500 }
      );
    });

    const user = await User.findById(auth.userId).select('+password');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}