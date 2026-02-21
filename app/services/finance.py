import pandas as pd
import yfinance as yf

class Finance:

    def __init__(self, ticker: str, period: str = "1y", interval: str = "1d"):
        self.ticker = ticker
        self.period = period
        self.interval = interval

    def __str__(self):
        return f"Finance(ticker = {self.ticker})"

    def __repr__(self):
        return f"Finance(ticker = {self.ticker})"

    def __get_history(self) -> pd.DataFrame:
        return yf.Ticker(
            ticker = self.ticker
        ).history(
            period = self.period,
            interval = self.interval
        )

    def __statistics_calc(self) -> dict:
        df = self.__get_history()

        # Cálculo estatísticas básicas
        df['Return'] = df['Close'].pct_change()


        ## Retorno
        avg_return = df['Return'].mean()
        median_return = df['Return'].median()
        max_daily_return = df['Return'].max()
        min_daily_return = df['Return'].min()
        cumulative_return = df['Close'].iloc[-1]/df['Close'].iloc[0] - 1

        ## Preço
        max_price = str(df[df['Close'] == df['Close'].max()][['Close']].to_dict()['Close'])
        min_price = str(df[df['Close'] == df['Close'].min()][['Close']].to_dict()['Close'])
        current_price = df['Close'].iloc[-1]

        # Cálculo RSI
        delta = df['Close'].diff(1)
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        rsi_period = 14

        avg_gain = gain.ewm(com=rsi_period - 1, adjust=False).mean()
        avg_loss = loss.ewm(com=rsi_period - 1, adjust=False).mean()

        RS = avg_gain / avg_loss

        df['RSI'] = 100 - (100 / (1 + RS))

        current_rsi = df['RSI'].iloc[-1]

        return {
            "avg_return": avg_return,
            "median_return": median_return,
            "max_daily_return": max_daily_return,
            "min_daily_return": min_daily_return,
            "cumulative_return": cumulative_return,
            "max_price": max_price,
            "min_price": min_price,
            "current_price": current_price,
            "current_rsi": current_rsi,
        }

    def get_report(self) -> str:
        statistics = self.__statistics_calc()

        return f"""
# Análise Estatística da Ação {self.ticker} | Período analisado ({self.period}) | Granularidade ({self.interval})
Retorno médio: {statistics['avg_return']:.3%}
Mediana do retorno: {statistics['median_return']:.3%}
Maior retorno diário: {statistics['max_daily_return']:.3%}
Menor retorno diário: {statistics['min_daily_return']:.3%}
Retorno acumulado: {statistics['cumulative_return']:.3%}
Preço máximo: {statistics['max_price']}
Preço mínimo: {statistics['min_price']}
Preço atual: {statistics['current_price']}
RSI atual: {statistics['current_rsi']:.3f}
        """.strip()