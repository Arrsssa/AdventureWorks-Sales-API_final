import pandas as pd


REGRESSION_FEATURE_COLUMNS = [
    "Order Quantity",
    "Unit Price",
    "ProductKey",
    "SalesTerritoryKey",
    "MonthKey",
]

CLASSIFICATION_FEATURE_COLUMNS = [
    "CustomerKey",
    "ProductKey",
    "SalesTerritoryKey",
    "MonthKey",
    "Unit Price",
]

REGRESSION_TARGET_COLUMN = "Sales Amount"
CLASSIFICATION_TARGET_COLUMN = "Bought"


def remove_missing_values(df: pd.DataFrame, required_columns: list[str]) -> pd.DataFrame:
    missing_columns = [
        column for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")

    return df.dropna(subset=required_columns).copy()


def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    return df.drop_duplicates().copy()


def remove_sales_outliers(df: pd.DataFrame) -> pd.DataFrame:
    if REGRESSION_TARGET_COLUMN not in df.columns:
        raise ValueError(f"Missing required column: {REGRESSION_TARGET_COLUMN}")

    q1 = df[REGRESSION_TARGET_COLUMN].quantile(0.25)
    q3 = df[REGRESSION_TARGET_COLUMN].quantile(0.75)
    iqr = q3 - q1

    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    return df[
        (df[REGRESSION_TARGET_COLUMN] >= lower_bound)
        & (df[REGRESSION_TARGET_COLUMN] <= upper_bound)
    ].copy()


def remove_unknown_customers(df: pd.DataFrame) -> pd.DataFrame:
    if "CustomerKey" not in df.columns:
        raise ValueError("Missing required column: CustomerKey")

    return df[df["CustomerKey"] != -1].copy()


def clean_sales_data(
    df: pd.DataFrame,
    required_columns: list[str],
    remove_outliers: bool = False,
    remove_unknown_customer_keys: bool = False,
) -> pd.DataFrame:
    cleaned_df = remove_missing_values(df, required_columns)
    cleaned_df = remove_duplicates(cleaned_df)

    if remove_unknown_customer_keys:
        cleaned_df = remove_unknown_customers(cleaned_df)

    if remove_outliers:
        cleaned_df = remove_sales_outliers(cleaned_df)

    return cleaned_df


def prepare_regression_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    required_columns = REGRESSION_FEATURE_COLUMNS + [REGRESSION_TARGET_COLUMN]

    cleaned_df = clean_sales_data(
        df=df,
        required_columns=required_columns,
        remove_outliers=True,
        remove_unknown_customer_keys=False,
    )

    X = cleaned_df[REGRESSION_FEATURE_COLUMNS]
    y = cleaned_df[REGRESSION_TARGET_COLUMN]

    return X, y


def prepare_classification_data(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    required_columns = CLASSIFICATION_FEATURE_COLUMNS

    cleaned_df = clean_sales_data(
        df=df,
        required_columns=required_columns,
        remove_outliers=False,
        remove_unknown_customer_keys=True,
    )

    positive_df = cleaned_df[CLASSIFICATION_FEATURE_COLUMNS].copy()
    positive_df[CLASSIFICATION_TARGET_COLUMN] = 1

    negative_df = positive_df.copy()

    negative_df["ProductKey"] = (
        negative_df["ProductKey"]
        .sample(frac=1, random_state=42)
        .reset_index(drop=True)
    )

    negative_df[CLASSIFICATION_TARGET_COLUMN] = 0

    classification_df = pd.concat(
        [positive_df, negative_df],
        ignore_index=True,
    )

    classification_df = classification_df.drop_duplicates().copy()

    X = classification_df[CLASSIFICATION_FEATURE_COLUMNS]
    y = classification_df[CLASSIFICATION_TARGET_COLUMN]

    return X, y


def prepare_prediction_input(
    order_quantity: int,
    unit_price: float,
    product_key: int,
    sales_territory_key: int,
    month_key: int,
) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "Order Quantity": order_quantity,
                "Unit Price": unit_price,
                "ProductKey": product_key,
                "SalesTerritoryKey": sales_territory_key,
                "MonthKey": month_key,
            }
        ]
    )


def prepare_buy_prediction_input(
    customer_key: int,
    product_key: int,
    sales_territory_key: int,
    month_key: int,
    unit_price: float,
) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "CustomerKey": customer_key,
                "ProductKey": product_key,
                "SalesTerritoryKey": sales_territory_key,
                "MonthKey": month_key,
                "Unit Price": unit_price,
            }
        ]
    )