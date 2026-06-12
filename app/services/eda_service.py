import pandas as pd

from app.services.data_service import DataService


class EDAService:
    def __init__(self) -> None:
        self.data_service = DataService()

    def _get_sales_data(self) -> pd.DataFrame:
        return self.data_service.get_sales_dataset()

    def _get_customer_sales_data(self) -> pd.DataFrame:
        df = self._get_sales_data()

        return df[df["CustomerKey"] != -1].copy()

    def get_overview(self) -> dict:
        df = self._get_sales_data()
        customer_df = self._get_customer_sales_data()

        return {
            "total_sales_amount": round(float(df["Sales Amount"].sum()), 2),
            "average_sales_amount": round(float(df["Sales Amount"].mean()), 2),
            "total_orders": int(df["SalesOrderLineKey"].nunique()),
            "total_customers": int(customer_df["CustomerKey"].nunique()),
            "total_products": int(df["ProductKey"].nunique()),
            "total_regions": int(df["SalesTerritoryKey"].nunique()),
        }

    def get_sales_by_year(self) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby("Fiscal Year", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Fiscal Year")
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_monthly_sales(self) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby(["Fiscal Year", "MonthKey", "Month"], as_index=False)["Sales Amount"]
            .sum()
            .sort_values(["Fiscal Year", "MonthKey"])
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_region_sales(self) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby("Region", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_product_sales(self) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby("Product", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_category_sales(self) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby("Category", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_top_products(self, limit: int = 10) -> list[dict]:
        df = self._get_sales_data()

        result = (
            df.groupby("Product", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
            .head(limit)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_customer_sales(self) -> list[dict]:
        df = self._get_customer_sales_data()

        result = (
            df.groupby("CustomerKey", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_top_customers(self, limit: int = 10) -> list[dict]:
        df = self._get_customer_sales_data()

        result = (
            df.groupby("CustomerKey", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
            .head(limit)
        )

        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_customer_product_analysis(self, limit: int = 20) -> list[dict]:
        df = self._get_customer_sales_data()

        result = (
            df.groupby(
                [
                    "CustomerKey",
                    "Product",
                    "Category",
                ],
                as_index=False,
            )
            .agg(
                {
                    "Order Quantity": "sum",
                    "Sales Amount": "sum",
                }
            )
            .sort_values("Sales Amount", ascending=False)
            .head(limit)
        )

        result["Order Quantity"] = result["Order Quantity"].astype(int)
        result["Sales Amount"] = result["Sales Amount"].round(2)

        return result.to_dict(orient="records")

    def get_customer_summary(self, customer_key: int) -> dict | None:
        df = self._get_customer_sales_data()

        customer_df = df[df["CustomerKey"] == customer_key].copy()

        if customer_df.empty:
            return None

        category_sales = (
            customer_df.groupby("Category", as_index=False)["Sales Amount"]
            .sum()
            .sort_values("Sales Amount", ascending=False)
        )

        top_category = str(category_sales.iloc[0]["Category"])

        return {
            "customer_key": int(customer_key),
            "total_sales_amount": round(float(customer_df["Sales Amount"].sum()), 2),
            "total_order_quantity": int(customer_df["Order Quantity"].sum()),
            "unique_products": int(customer_df["ProductKey"].nunique()),
            "top_category": top_category,
        }