"use server";

import { cookies } from "next/headers";

export async function loginUser(formData) {
  const { email, password } = formData;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed" };
    }

    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true };
  } catch (err) {
    return { error: "Something went wrong. Please try again." };
  }
}
