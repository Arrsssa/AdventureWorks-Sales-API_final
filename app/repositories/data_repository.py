from functools import lru_cache
from pathlib import Path

import pandas as pd


class DataRepository:
    def __init__(self) -> None:
        self.file_path = (
            Path(__file__).resolve().parents[1]
            / "data"
            / "AdventureWorks Sales.xlsx"
        )

    def load_sheet(self, sheet_name: str) -> pd.DataFrame:
        if not self.file_path.exists():
            raise FileNotFoundError(f"Excel file not found: {self.file_path}")

        return pd.read_excel(self.file_path, sheet_name=sheet_name)

    def load_all_data(self) -> dict[str, pd.DataFrame]:
        return load_all_data_cached(str(self.file_path))


@lru_cache(maxsize=1)
def load_all_data_cached(file_path: str) -> dict[str, pd.DataFrame]:
    excel_path = Path(file_path)

    if not excel_path.exists():
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    return {
        "sales_order": pd.read_excel(excel_path, sheet_name="Sales Order_data"),
        "sales_territory": pd.read_excel(excel_path, sheet_name="Sales Territory_data"),
        "sales": pd.read_excel(excel_path, sheet_name="Sales_data"),
        "reseller": pd.read_excel(excel_path, sheet_name="Reseller_data"),
        "date": pd.read_excel(excel_path, sheet_name="Date_data"),
        "product": pd.read_excel(excel_path, sheet_name="Product_data"),
        "customer": pd.read_excel(excel_path, sheet_name="Customer_data"),
    }