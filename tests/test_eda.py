from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_overview():
    response = client.get("/eda/overview")

    assert response.status_code == 200

    data = response.json()

    assert "total_sales_amount" in data
    assert "average_sales_amount" in data
    assert "total_orders" in data
    assert "total_customers" in data
    assert "total_products" in data
    assert "total_regions" in data

    assert data["total_sales_amount"] > 0
    assert data["average_sales_amount"] > 0
    assert data["total_orders"] > 0
    assert data["total_customers"] > 0
    assert data["total_products"] > 0
    assert data["total_regions"] > 0


def test_sales_by_year():
    response = client.get("/eda/sales-by-year")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    first_item = data[0]

    assert "Fiscal Year" in first_item
    assert "Sales Amount" in first_item
    assert first_item["Sales Amount"] > 0


def test_monthly_sales():
    response = client.get("/eda/monthly-sales")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    first_item = data[0]

    assert "Fiscal Year" in first_item
    assert "MonthKey" in first_item
    assert "Month" in first_item
    assert "Sales Amount" in first_item


def test_region_sales():
    response = client.get("/eda/region-sales")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) > 0

    first_item = data[0]

    assert "Region" in first_item
    assert "Sales Amount" in first_item


def test_top_products_limit():
    response = client.get("/eda/top-products?limit=5")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 5

    first_item = data[0]

    assert "Product" in first_item
    assert "Sales Amount" in first_item


def test_top_customers_limit():
    response = client.get("/eda/top-customers?limit=5")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 5

    first_item = data[0]

    assert "CustomerKey" in first_item
    assert "Sales Amount" in first_item

    customer_keys = [item["CustomerKey"] for item in data]

    assert -1 not in customer_keys


def test_customer_product_analysis_limit():
    response = client.get("/eda/customer-product-analysis?limit=5")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) == 5

    first_item = data[0]

    assert "CustomerKey" in first_item
    assert "Product" in first_item
    assert "Category" in first_item
    assert "Order Quantity" in first_item
    assert "Sales Amount" in first_item

    customer_keys = [item["CustomerKey"] for item in data]

    assert -1 not in customer_keys