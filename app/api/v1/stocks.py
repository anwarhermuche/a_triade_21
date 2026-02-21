from fastapi import APIRouter


router = APIRouter(prefix = "/api/v1/stocks", tags = ["Stocks"])


@router.get(path = "/oi")
def diz_oi():
    return {"mensagem": "oi"}