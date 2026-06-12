const API_BASE_URL = "https://lyrically-remix-rewrap.ngrok-free.dev";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(options.headers || {}),
    },
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
  getProductSales: () => request("/eda/product-sales"),
  getCategorySales: () => request("/eda/category-sales"),
  getTopProducts: (limit = 10) => request(`/eda/top-products?limit=${limit}`),

  getTopCustomers: (limit = 10) => request(`/eda/top-customers?limit=${limit}`),
  getCustomerProductAnalysis: (limit = 20) =>
    request(`/eda/customer-product-analysis?limit=${limit}`),
  getCustomerSummary: (customerKey) =>
    request(`/crm/customer-summary/${customerKey}`),

  getSalesByYear: () => request("/eda/sales-by-year"),

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