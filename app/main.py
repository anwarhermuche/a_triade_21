from fastapi import FastAPI

from app.api.v1.stocks import router as stocks_router


app = FastAPI()

app.include_router(stocks_router)
