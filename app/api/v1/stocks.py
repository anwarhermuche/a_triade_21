from fastapi import APIRouter

from app.services.report import Report

from app.schemas.stocks import StocksReponseSchema, StocksRequestSchema

router = APIRouter(prefix = "/api/v1/stocks", tags = ["Stocks"])


@router.post(path = "/analyze", response_model = StocksReponseSchema)
def analyze_stock(request: StocksRequestSchema):
    return StocksReponseSchema(**Report(ticker = request.ticker).get().model_dump())