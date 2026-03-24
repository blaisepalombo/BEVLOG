export const API_BASE = "";

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

export function getCurrentUser() {
  return apiFetch("/auth/me");
}

export function logoutUser() {
  return apiFetch("/auth/logout", {
    method: "POST",
  });
}

export function getDrinks(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return apiFetch(`/drinks${query ? `?${query}` : ""}`);
}

export function getDrinkStats(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return apiFetch(`/drinks/stats${query ? `?${query}` : ""}`);
}

export function getDrinkById(id) {
  return apiFetch(`/drinks/${id}`);
}

export function createDrink(payload) {
  return apiFetch("/drinks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDrink(id, payload) {
  return apiFetch(`/drinks/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteDrink(id) {
  return apiFetch(`/drinks/${id}`, {
    method: "DELETE",
  });
}