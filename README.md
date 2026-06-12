# AdventureWorks Sales API

## 1. Project Overview

This project is a backend API service built with FastAPI.

The service loads sales data from the Excel file `AdventureWorks Sales.xlsx`, performs EDA analysis, and provides a simple machine learning prediction API for sales amount forecasting.

The project uses an MVC-like structure:

* controllers: API endpoints
* services: business logic
* repositories: data loading from Excel
* models: Pydantic request and response schemas
* ml: preprocessing, model training, and saved model file

## 2. Main Features

* Load sales data from Excel
* Analyze sales data
* Return EDA results as JSON
* Train a machine learning model
* Predict sales amount using a REST API
* Provide Swagger documentation
* Run automated tests with pytest

## 3. Project Structure

```text
app/
├── main.py
├── controllers/
│   ├── eda_controller.py
│   └── predict_controller.py
├── services/
│   ├── data_service.py
│   ├── eda_service.py
│   └── predict_service.py
├── repositories/
│   └── data_repository.py
├── models/
│   └── schemas.py
├── ml/
│   ├── preprocessing.py
│   ├── train_model.py
│   └── model.pkl
├── data/
│   └── AdventureWorks Sales.xlsx
tests/
├── test_health.py
├── test_eda.py
└── test_predict.py
requirements.txt
README.md
pytest.ini
```

## 4. Technologies

* Python 3.10+
* FastAPI
* pandas
* scikit-learn
* joblib
* Pydantic
* pytest
* Swagger UI

## 5. Installation

Create and activate a virtual environment:

```powershell
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

## 6. Data File

Place the Excel file here:

```text
app/data/AdventureWorks Sales.xlsx
```

The project reads several sheets from this Excel file:

* Sales_data
* Date_data
* Product_data
* Sales Territory_data
* Customer_data
* Reseller_data
* Sales Order_data

## 7. Run the API Server

```powershell
uvicorn app.main:app --reload
```

Open Swagger UI:

```text
http://127.0.0.1:8000/docs
```

## 8. API Endpoints

### Health Check

```http
GET /health
```

Checks whether the API server is running.

### Data Summary

```http
GET /data/summary
```

Returns basic information about the loaded Excel sheets.

### Monthly Sales

```http
GET /eda/monthly-sales
```

Returns sales amount grouped by fiscal year and month.

### Region Sales

```http
GET /eda/region-sales
```

Returns sales amount grouped by region.

### Product Sales

```http
GET /eda/product-sales
```

Returns sales amount grouped by product.

### Category Sales

```http
GET /eda/category-sales
```

Returns sales amount grouped by product category.

### Top Products

```http
GET /eda/top-products?limit=10
```

Returns top products by sales amount.

### Sales Prediction

```http
POST /predict/sales
```

Example request:

```json
{
  "order_quantity": 2,
  "unit_price": 1000,
  "product_key": 310,
  "sales_territory_key": 1,
  "month_key": 202001
}
```

Example response:

```json
{
  "predicted_sales_amount": 1998.75
}
```

## 9. Train the Machine Learning Model

```powershell
python -m app.ml.train_model
```

After training, the model is saved as:

```text
app/ml/model.pkl
```

The model predicts `Sales Amount`.

Input features:

* Order Quantity
* Unit Price
* ProductKey
* SalesTerritoryKey
* MonthKey

Model:

```text
RandomForestRegressor
```

## 10. Run Tests

```powershell
python -m pytest
```

Current test result:

```text
6 passed
```

The tests check:

* health check endpoint
* EDA endpoints
* prediction endpoint
* model file existence

## 11. Why No Database Is Used

This project uses an Excel file as the data source.

A database is not required because the main purpose of the project is sales data analysis and prediction, not data storage or transaction management.

For a larger production system, the Excel data could be migrated to a relational database such as PostgreSQL or MySQL.

## 12. Limitations

* The model is a simple baseline model.
* The API reads data from an Excel file.
* The prediction model does not include advanced time-series forecasting.
* Category keys are used as numeric features without advanced encoding.

## 13. Possible Improvements

* Add database integration
* Add authentication
* Add Docker support
* Add more advanced feature engineering
* Use time-series forecasting models
* Add charts or dashboard integration
* Improve model evaluation and monitoring
