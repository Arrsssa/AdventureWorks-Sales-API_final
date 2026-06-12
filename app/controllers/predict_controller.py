from fastapi import APIRouter, HTTPException

from app.models.schemas import (
    BuyPredictionRequest,
    BuyPredictionResponse,
    SalesPredictionRequest,
    SalesPredictionResponse,
    SalesScenarioPredictionRequest,
    SalesScenarioPredictionResponse,
)
from app.services.predict_service import PredictService


router = APIRouter(
    prefix="/predict",
    tags=["Prediction"],
)


@router.post(
    "/sales",
    response_model=SalesPredictionResponse,
)
def predict_sales(request: SalesPredictionRequest) -> dict:
    try:
        service = PredictService()
        return service.predict_sales(request)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post(
    "/scenario",
    response_model=SalesScenarioPredictionResponse,
)
def predict_sales_scenarios(
    request: SalesScenarioPredictionRequest,
) -> dict:
    try:
        service = PredictService()
        return service.predict_sales_scenarios(request)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.post(
    "/buy",
    response_model=BuyPredictionResponse,
)
def predict_buy(request: BuyPredictionRequest) -> dict:
    try:
        service = PredictService()
        return service.predict_buy(request)
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))