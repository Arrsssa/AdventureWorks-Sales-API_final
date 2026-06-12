from pathlib import Path

import pandas as pd


class DataRepository:
    def __init__(self) -> None:
        self.file_path = Path(__file__).resolve().parents[1] / "data" / "AdventureWorks Sales.xlsx"

    def load_sheet(self, sheet_name: str) -> pd.DataFrame:
        if not self.file_path.exists():
            raise FileNotFoundError(f"Excel file not found: {self.file_path}")

        return pd.read_excel(self.file_path, sheet_name=sheet_name)

    def load_all_data(self) -> dict[str, pd.DataFrame]:
        return {
            "sales_order": self.load_sheet("Sales Order_data"),
            "sales_territory": self.load_sheet("Sales Territory_data"),
            "sales": self.load_sheet("Sales_data"),
            "reseller": self.load_sheet("Reseller_data"),
            "date": self.load_sheet("Date_data"),
            "product": self.load_sheet("Product_data"),
            "customer": self.load_sheet("Customer_data"),
        }