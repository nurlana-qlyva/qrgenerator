import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function signIn(data) {
  const res = await axios.post(`${API_BASE}/Account/accounts/signin`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export async function signUp(data) {
  const res = await axios.post(`${API_BASE}/Account/signup`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
}

export const refreshAccessToken = async (refreshToken) => {
  try {
    const res = await axios.post("${API_BASE}/Account/refresh-signin", {
      refreshToken,
    });

    return res.data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};

export async function continueWithGoogle({ idToken }) {
  try {
    const res = await axios.post(
      `${API_BASE}/Account/continue-with-google`,
      {
        idToken,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (error) {
    console.error("Google login error:", error);
    throw new Error("Google login failed");
  }
}
