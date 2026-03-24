import { API_BASE, getCurrentUser, logoutUser } from "./api.js";

export async function loadUserStatus(targetElement) {
  try {
    const data = await getCurrentUser();

    if (targetElement) {
      const name = data.user?.displayName || "Logged in user";
      const email = data.user?.email ? ` (${data.user.email})` : "";
      targetElement.textContent = `Signed in as ${name}${email}`;
    }

    return data.user;
  } catch (error) {
    if (targetElement) {
      targetElement.innerHTML = `You are not logged in. <a href="${API_BASE}/auth/google">Sign in with Google</a>`;
    }

    return null;
  }
}

export async function handleLogout(redirectTo = "index.html") {
  await logoutUser();
  window.location.href = redirectTo;
}