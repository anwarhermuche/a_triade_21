from typing import List
from langchain_core.messages import SystemMessage, HumanMessage, AnyMessage

from app.ai.prompts.stocks_report_human import HUMAN_PROMPT
from app.ai.prompts.stocks_report_system import SYSTEM_PROMPT
from app.ai.structured_outputs.stocks_response import StocksResponse

from app.services.finance import Finance
from app.services.news import News

from app.core.settings import settings

from langchain_openai import ChatOpenAI

class Report:

    def __init__(self, ticker: str, model: str = "gpt-5.1", temperature: float = 0.2):
        self.ticker = ticker
        self.model = model
        self.temperature = temperature

    def __get_messages(self) -> List[AnyMessage]:

        relatorio_estatistico = Finance(ticker=self.ticker).get_report()
        relatorio_noticias = News(ticker=self.ticker).get_report()

        new_human_prompt = HUMAN_PROMPT\
            .replace("{STOCKS_STATISTICS_REPORT}", relatorio_estatistico)\
            .replace("{STOCKS_NEWS_REPORT}", relatorio_noticias)

        return [
            SystemMessage(content = SYSTEM_PROMPT),
            HumanMessage(content = new_human_prompt)
        ]

    def get(self) -> StocksResponse:

        modelo = ChatOpenAI(model = self.model,
                            temperature = self.temperature,
                            api_key = settings.OPENAI_API_KEY)\
                            .with_structured_output(StocksResponse)
        
        return modelo.invoke(self.__get_messages())
        