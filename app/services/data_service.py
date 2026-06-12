import pandas as pd

from app.repositories.data_repository import DataRepository


class DataService:
    _all_data_cache: dict[str, pd.DataFrame] | None = None
    _sales_dataset_cache: pd.DataFrame | None = None

    def __init__(self) -> None:
        self.repository = DataRepository()

    def _load_all_data_cached(self) -> dict[str, pd.DataFrame]:
        if DataService._all_data_cache is None:
            DataService._all_data_cache = self.repository.load_all_data()

        return DataService._all_data_cache

    def get_data_summary(self) -> dict:
        data = self._load_all_data_cached()

        summary = {}

        for name, df in data.items():
            summary[name] = {
                "rows": len(df),
                "columns": list(df.columns),
                "missing_values": int(df.isnull().sum().sum()),
            }

        return summary

    def get_sales_dataset(self) -> pd.DataFrame:
        if DataService._sales_dataset_cache is not None:
            return DataService._sales_dataset_cache

        data = self._load_all_data_cached()

        sales_df = data["sales"]
        date_df = data["date"]
        product_df = data["product"]
        territory_df = data["sales_territory"]

        merged_df = sales_df.merge(
            date_df,
            left_on="OrderDateKey",
            right_on="DateKey",
            how="left",
        )

        merged_df = merged_df.merge(
            product_df,
            on="ProductKey",
            how="left",
        )

        merged_df = merged_df.merge(
            territory_df,
            on="SalesTerritoryKey",
            how="left",
        )

        DataService._sales_dataset_cache = merged_df

        return merged_df