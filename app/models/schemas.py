from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    message: str


class DataTableSummary(BaseModel):
    rows: int
    columns: list[str]
    missing_values: int


class OverviewResponse(BaseModel):
    total_sales_amount: float
    average_sales_amount: float
    total_orders: int
    total_customers: int
    total_products: int
    total_regions: int


class YearlySalesResponse(BaseModel):
    fiscal_year: str = Field(alias="Fiscal Year")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class MonthlySalesResponse(BaseModel):
    fiscal_year: str = Field(alias="Fiscal Year")
    month_key: int = Field(alias="MonthKey")
    month: str = Field(alias="Month")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class RegionSalesResponse(BaseModel):
    region: str = Field(alias="Region")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class ProductSalesResponse(BaseModel):
    product: str = Field(alias="Product")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class CategorySalesResponse(BaseModel):
    category: str = Field(alias="Category")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class CustomerSalesResponse(BaseModel):
    customer_key: int = Field(alias="CustomerKey")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class CustomerProductAnalysisResponse(BaseModel):
    customer_key: int = Field(alias="CustomerKey")
    product: str = Field(alias="Product")
    category: str = Field(alias="Category")
    order_quantity: int = Field(alias="Order Quantity")
    sales_amount: float = Field(alias="Sales Amount")

    model_config = {
        "populate_by_name": True
    }


class CustomerSummaryResponse(BaseModel):
    customer_key: int
    total_sales_amount: float
    total_order_quantity: int
    unique_products: int
    top_category: str


class SalesPredictionRequest(BaseModel):
    order_quantity: int = Field(
        ...,
        ge=1,
        description="Number of products ordered",
    )
    unit_price: float = Field(
        ...,
        gt=0,
        description="Unit price of the product",
    )
    product_key: int = Field(
        ...,
        ge=1,
        description="Product key from Product_data",
    )
    sales_territory_key: int = Field(
        ...,
        ge=1,
        description="Sales territory key",
    )
    month_key: int = Field(
        ...,
        ge=1,
        description="Month key from Date_data",
    )


class SalesPredictionResponse(BaseModel):
    predicted_sales_amount: float


class SalesScenarioPredictionRequest(BaseModel):
    scenarios: list[SalesPredictionRequest] = Field(
        ...,
        min_length=1,
        max_length=20,
        description="List of sales scenarios for what-if prediction",
    )


class SalesScenarioPredictionItem(BaseModel):
    scenario_id: int
    predicted_sales_amount: float


class SalesScenarioPredictionResponse(BaseModel):
    results: list[SalesScenarioPredictionItem]


class BuyPredictionRequest(BaseModel):
    customer_key: int = Field(
        ...,
        ge=1,
        description="Customer key from Customer_data",
    )
    product_key: int = Field(
        ...,
        ge=1,
        description="Product key from Product_data",
    )
    sales_territory_key: int = Field(
        ...,
        ge=1,
        description="Sales territory key",
    )
    month_key: int = Field(
        ...,
        ge=1,
        description="Month key from Date_data",
    )
    unit_price: float = Field(
        ...,
        gt=0,
        description="Unit price of the product",
    )


class BuyPredictionResponse(BaseModel):
    will_buy: bool
    prediction_label: str
    buy_probability: float