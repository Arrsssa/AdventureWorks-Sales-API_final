from pathlib import Path

import joblib

from app.ml.preprocessing import (
    prepare_buy_prediction_input,
    prepare_prediction_input,
)
from app.models.schemas import (
    BuyPredictionRequest,
    SalesPredictionRequest,
    SalesScenarioPredictionRequest,
)


class PredictService:
    def __init__(self) -> None:
        self.sales_regressor_path = (
            Path(__file__).resolve().parents[1] / "ml" / "sales_regressor.pkl"
        )
        self.buy_classifier_path = (
            Path(__file__).resolve().parents[1] / "ml" / "buy_classifier.pkl"
        )

        if not self.sales_regressor_path.exists():
            raise FileNotFoundError(
                "Sales regressor model not found. Please train the model first: "
                "python -m app.ml.train_model"
            )

        if not self.buy_classifier_path.exists():
            raise FileNotFoundError(
                "Buy classifier model not found. Please train the model first: "
                "python -m app.ml.train_model"
            )

        self.sales_regressor = joblib.load(self.sales_regressor_path)
        self.buy_classifier = joblib.load(self.buy_classifier_path)

    def predict_sales(self, request: SalesPredictionRequest) -> dict:
        input_df = prepare_prediction_input(
            order_quantity=request.order_quantity,
            unit_price=request.unit_price,
            product_key=request.product_key,
            sales_territory_key=request.sales_territory_key,
            month_key=request.month_key,
        )

        prediction = self.sales_regressor.predict(input_df)[0]

        return {
            "predicted_sales_amount": round(float(prediction), 2),
        }

    def predict_sales_scenarios(
        self,
        request: SalesScenarioPredictionRequest,
    ) -> dict:
        results = []

        for index, scenario in enumerate(request.scenarios, start=1):
            prediction_result = self.predict_sales(scenario)

            results.append(
                {
                    "scenario_id": index,
                    "predicted_sales_amount": prediction_result[
                        "predicted_sales_amount"
                    ],
                }
            )

        return {
            "results": results,
        }

    def predict_buy(self, request: BuyPredictionRequest) -> dict:
        input_df = prepare_buy_prediction_input(
            customer_key=request.customer_key,
            product_key=request.product_key,
            sales_territory_key=request.sales_territory_key,
            month_key=request.month_key,
            unit_price=request.unit_price,
        )

        prediction = self.buy_classifier.predict(input_df)[0]
        probabilities = self.buy_classifier.predict_proba(input_df)[0]

        buy_probability = float(probabilities[1])

        will_buy = bool(prediction == 1)

        return {
            "will_buy": will_buy,
            "prediction_label": "Buy" if will_buy else "Not Buy",
            "buy_probability": round(buy_probability, 4),
        }