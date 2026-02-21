from pydantic import BaseModel, Field
from typing import Literal, List 


class StocksReponseSchema(BaseModel):
    ticker: str = Field(description = "ticker a ser analisado (e.g.: AAPL)")
    action: Literal["BUY", "HOLD", "SELL"] = Field(description = "Ação a ser tomada")
    confidence: float = Field(le = 1, ge = 0, description = "Float entre 0 e 1 com a confiança na ação a ser tomada")
    reasoning: str = Field(description = "String com a explicação técnica para o investidor do porquê está tomando essa decisão")
    risks: List[str] = Field(description = "Lista de strings com os riscos associados e, se tiver, links de matérias que corroboram com a explicação")
    opportunities: List[str] = Field(description = "Lista de strings com as oportunidades associadas e, se tiver, links de matérias que corroboram com a explicação")

class StocksRequestSchema(BaseModel):
    ticker: str = Field(description = "ticker a ser analisado (e.g.: AAPL)")