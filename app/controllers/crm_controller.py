from fastapi import APIRouter, HTTPException

from app.models.schemas import CustomerSummaryResponse
from app.services.eda_service import EDAService


router = APIRouter(
    prefix="/crm",
    tags=["CRM"],
)


@router.get(
    "/customer-summary/{customer_key}",
    response_model=CustomerSummaryResponse,
)
def customer_summary(customer_key: int) -> dict:
    try:
        service = EDAService()
        summary = service.get_customer_summary(customer_key=customer_key)

        if summary is None:
            raise HTTPException(
                status_code=404,
                detail=f"CustomerKey {customer_key} not found",
            )

        return summary
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))