import requests
import json
from app.core.settings import settings
from typing import Tuple, Dict, List, Optional

class News:

    def __init__(self, ticker: str, engine: str = "google", time_period: str = "last_week", n_organic_results: int = 10):
        self.ticker = ticker
        self.engine = engine
        self.time_period = time_period
        self.n_organic_results = n_organic_results
        self.URL = "https://www.searchapi.io/api/v1/search"

    def __get_query(self) -> str:
        return f"predictions about {self.ticker} ticker opinions"

    def __get_news_raw(self) -> Tuple[Dict, List]:
        params = {
        "engine": self.engine,
        "time_period": self.time_period,
        "q": self.__get_query(),
        "api_key": settings.SEARCH_API_KEY,
        }
        response = requests.get(self.URL, params=params)
        result = json.loads(response.text)

        answer_box = result.get('answer_box', {})
        organic_results = result.get('organic_results', [])
        return answer_box, organic_results

    def get_report(self) -> str:
        answer_box, organic_results = self.__get_news_raw()

        report = f"# Notícias relevantes sobre predições para {self.ticker}\n\n"

        for resultado in organic_results[:self.n_organic_results]:
            position = resultado.get('position', 'Posição não encontrada')
            title = resultado.get('title', 'Título não encontrado')
            link = resultado.get('link', 'Link não encontrado')
            snippet = resultado.get('snippet', 'Resumo não encontrado')
            report += f"Posição: {position}\nTítulo: {title}\nLink: {link}\nResumo: {snippet}\n\n"

        if answer_box:
            link = answer_box.get('organic_result', {}).get('link', "Link não encontrado")
            snippet = answer_box.get('snippet', "Resumo não encontrado")
            answer = answer_box.get('answer', "Resposta não encontrada")
            report += f"Resposta do Gemini para a pesquisa:\nLink: {link}\nResumo: {snippet}\nResposta: {answer}"

        return report.strip()