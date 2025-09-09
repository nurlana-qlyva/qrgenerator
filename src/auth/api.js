import axios from "axios";

const API_BASE = "https://qrgenerates.com"; // base URL

export async function signIn(data) {
  const res = await axios.post(
    `${API_BASE}/api/Account/accounts/signin`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return res.data;
}

export async function continueWithGoogle({ idToken }) {
  try {
    const res = await axios.post(
      `${API_BASE}/api/Account/continue-with-google`,
      {
        idToken,
      },
       { headers: { 'Content-Type': 'application/json' } } 
    );
    return res.data;
  } catch (error) {
    console.error("Google login error:", error);
    throw new Error("Google login failed");
  }
}

