from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import (
    CategorySalesResponse,
    CustomerProductAnalysisResponse,
    CustomerSalesResponse,
    MonthlySalesResponse,
    OverviewResponse,
    ProductSalesResponse,
    RegionSalesResponse,
    YearlySalesResponse,
)
from app.services.eda_service import EDAService


router = APIRouter(
    prefix="/eda",
    tags=["EDA"],
)


@router.get(
    "/overview",
    response_model=OverviewResponse,
)
def overview() -> dict:
    try:
        service = EDAService()
        return service.get_overview()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/sales-by-year",
    response_model=list[YearlySalesResponse],
)
def sales_by_year() -> list[dict]:
    try:
        service = EDAService()
        return service.get_sales_by_year()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/monthly-sales",
    response_model=list[MonthlySalesResponse],
)
def monthly_sales() -> list[dict]:
    try:
        service = EDAService()
        return service.get_monthly_sales()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/region-sales",
    response_model=list[RegionSalesResponse],
)
def region_sales() -> list[dict]:
    try:
        service = EDAService()
        return service.get_region_sales()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/product-sales",
    response_model=list[ProductSalesResponse],
)
def product_sales() -> list[dict]:
    try:
        service = EDAService()
        return service.get_product_sales()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/category-sales",
    response_model=list[CategorySalesResponse],
)
def category_sales() -> list[dict]:
    try:
        service = EDAService()
        return service.get_category_sales()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/top-products",
    response_model=list[ProductSalesResponse],
)
def top_products(
    limit: int = Query(default=10, ge=1, le=50),
) -> list[dict]:
    try:
        service = EDAService()
        return service.get_top_products(limit=limit)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/customer-sales",
    response_model=list[CustomerSalesResponse],
)
def customer_sales() -> list[dict]:
    try:
        service = EDAService()
        return service.get_customer_sales()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/top-customers",
    response_model=list[CustomerSalesResponse],
)
def top_customers(
    limit: int = Query(default=10, ge=1, le=50),
) -> list[dict]:
    try:
        service = EDAService()
        return service.get_top_customers(limit=limit)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/customer-product-analysis",
    response_model=list[CustomerProductAnalysisResponse],
)
def customer_product_analysis(
    limit: int = Query(default=20, ge=1, le=100),
) -> list[dict]:
    try:
        service = EDAService()
        return service.get_customer_product_analysis(limit=limit)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))