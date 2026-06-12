from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_sales_regressor_model_exists():
    model_path = Path("app/ml/sales_regressor.pkl")

    assert model_path.exists()


def test_buy_classifier_model_exists():
    model_path = Path("app/ml/buy_classifier.pkl")

    assert model_path.exists()


def test_predict_sales():
    request_data = {
        "order_quantity": 2,
        "unit_price": 1000,
        "product_key": 310,
        "sales_territory_key": 1,
        "month_key": 202001,
    }

    response = client.post("/predict/sales", json=request_data)

    assert response.status_code == 200

    data = response.json()

    assert "predicted_sales_amount" in data
    assert isinstance(data["predicted_sales_amount"], float)
    assert data["predicted_sales_amount"] > 0


def test_predict_sales_scenarios():
    request_data = {
        "scenarios": [
            {
                "order_quantity": 1,
                "unit_price": 1000,
                "product_key": 310,
                "sales_territory_key": 1,
                "month_key": 202001,
            },
            {
                "order_quantity": 2,
                "unit_price": 1000,
                "product_key": 310,
                "sales_territory_key": 1,
                "month_key": 202001,
            },
        ]
    }

    response = client.post("/predict/scenario", json=request_data)

    assert response.status_code == 200

    data = response.json()

    assert "results" in data
    assert isinstance(data["results"], list)
    assert len(data["results"]) == 2

    first_result = data["results"][0]
    second_result = data["results"][1]

    assert first_result["scenario_id"] == 1
    assert second_result["scenario_id"] == 2

    assert isinstance(first_result["predicted_sales_amount"], float)
    assert isinstance(second_result["predicted_sales_amount"], float)

    assert first_result["predicted_sales_amount"] > 0
    assert second_result["predicted_sales_amount"] > 0


def test_predict_buy():
    request_data = {
        "customer_key": 11000,
        "product_key": 310,
        "sales_territory_key": 1,
        "month_key": 202001,
        "unit_price": 1000,
    }

    response = client.post("/predict/buy", json=request_data)

    assert response.status_code == 200

    data = response.json()

    assert "will_buy" in data
    assert "prediction_label" in data
    assert "buy_probability" in data

    assert isinstance(data["will_buy"], bool)
    assert data["prediction_label"] in ["Buy", "Not Buy"]
    assert isinstance(data["buy_probability"], float)
    assert 0 <= data["buy_probability"] <= 1