const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API error: ${response.status} ${response.statusText}. ${errorText}`
    );
  }

  return response.json();
}

export const api = {
  health: () => request("/health"),

  getOverview: () => request("/eda/overview"),
  getMonthlySales: () => request("/eda/monthly-sales"),
  getRegionSales: () => request("/eda/region-sales"),
  getCategorySales: () => request("/eda/category-sales"),
  getTopProducts: (limit = 10) => request(`/eda/top-products?limit=${limit}`),
  getTopCustomers: (limit = 10) => request(`/eda/top-customers?limit=${limit}`),
  getCustomerProductAnalysis: (limit = 20) =>
    request(`/eda/customer-product-analysis?limit=${limit}`),

  getSalesByYear: () => request("/eda/sales-by-year"),

  getCustomerSummary: (customerKey) =>
    request(`/crm/customer-summary/${customerKey}`),

  predictSales: (payload) =>
    request("/predict/sales", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  predictBuy: (payload) =>
    request("/predict/buy", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  predictScenario: (payload) =>
    request("/predict/scenario", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};