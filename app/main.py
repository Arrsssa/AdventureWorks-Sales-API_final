from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import crm_controller, eda_controller, predict_controller
from app.models.schemas import HealthResponse
from app.services.data_service import DataService


app = FastAPI(
    title="AdventureWorks Sales API",
    description="FastAPI service for CRM sales EDA analysis and prediction",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(eda_controller.router)
app.include_router(predict_controller.router)
app.include_router(crm_controller.router)


@app.get("/health", response_model=HealthResponse)
def health_check() -> dict:
    return {
        "status": "ok",
        "message": "Sales API is running",
    }


@app.get("/data/summary")
def get_data_summary() -> dict:
    try:
        service = DataService()
        return service.get_data_summary()
    except FileNotFoundError as error:
        raise HTTPException(status_code=404, detail=str(error))
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))