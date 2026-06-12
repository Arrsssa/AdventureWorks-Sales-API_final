from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from app.ml.preprocessing import (
    prepare_classification_data,
    prepare_regression_data,
)
from app.services.data_service import DataService


SALES_REGRESSOR_PATH = Path(__file__).resolve().parent / "sales_regressor.pkl"
BUY_CLASSIFIER_PATH = Path(__file__).resolve().parent / "buy_classifier.pkl"


def train_sales_regressor() -> None:
    data_service = DataService()
    df = data_service.get_sales_dataset()

    X, y = prepare_regression_data(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)

    joblib.dump(model, SALES_REGRESSOR_PATH)

    print("Sales regressor trained successfully")
    print(f"Model saved to: {SALES_REGRESSOR_PATH}")
    print(f"MAE: {mae:.2f}")
    print(f"R2 Score: {r2:.4f}")


def train_buy_classifier() -> None:
    data_service = DataService()
    df = data_service.get_sales_dataset()

    X, y = prepare_classification_data(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    joblib.dump(model, BUY_CLASSIFIER_PATH)

    print("Buy classifier trained successfully")
    print(f"Model saved to: {BUY_CLASSIFIER_PATH}")
    print(f"Accuracy: {accuracy:.4f}")


def train_models() -> None:
    print("Training sales regressor...")
    train_sales_regressor()

    print()
    print("Training buy classifier...")
    train_buy_classifier()

    print()
    print("All models trained successfully")


if __name__ == "__main__":
    train_models()