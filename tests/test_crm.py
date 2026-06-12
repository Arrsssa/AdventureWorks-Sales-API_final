from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_customer_summary():
    response = client.get("/crm/customer-summary/12301")

    assert response.status_code == 200

    data = response.json()

    assert data["customer_key"] == 12301
    assert "total_sales_amount" in data
    assert "total_order_quantity" in data
    assert "unique_products" in data
    assert "top_category" in data

    assert data["total_sales_amount"] > 0
    assert data["total_order_quantity"] > 0
    assert data["unique_products"] > 0
    assert isinstance(data["top_category"], str)


def test_customer_summary_not_found():
    response = client.get("/crm/customer-summary/999999999")

    assert response.status_code == 404