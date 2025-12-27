from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import pandas as pd

app = FastAPI()
app.add_middleware(CORSMiddleware,allow_origins=["*"])

def format_time_value(index, interval):
    if interval.endswith('m') or interval.endswith('h'):
        return int(index.timestamp())
    else:
        return index.strftime('%Y-%m-%d')

def remove_duplicate_times(data_list):
    seen_times = set()
    filtered_data = []
    
    for item in reversed(data_list): 
        if item["time"] not in seen_times:
            seen_times.add(item["time"])
            filtered_data.append(item)
    
    return list(reversed(filtered_data)) 

@app.get('/stock/{ticker}')
def get_stock_data_latest(ticker: str, period: str = '1mo', interval: str = '1d'):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)    
    latest = st_data.iloc[-1]
    return {
            "ticker": ticker,
            "date": latest.name.strftime('%Y-%m-%d') if interval.endswith('d') else int(latest.name.timestamp()),
            "open": round(latest['Open'], 2),
            "high": round(latest['High'], 2),
            "low": round(latest['Low'], 2),
            "close": round(latest['Close'], 2),
            "volume": int(latest['Volume'])
        }

@app.get('/stock/{ticker}/candles')
def get_candle_data(ticker:str,period:str='1d',interval:str='1m'):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)
    st_data = st_data.sort_index()
    st_data = st_data.drop_duplicates() 
    
    candles = []
    for index, row in st_data.iterrows():
        time_value = format_time_value(index, interval)
        candles.append({
            "time": time_value,
            "open": round(row['Open'], 2),
            "high": round(row['High'], 2),
            "low": round(row['Low'], 2),
            "close": round(row['Close'], 2),
            "volume": int(row['Volume'])
        })
    
    return remove_duplicate_times(candles)

@app.get("/stock/{ticker}/ma")
def getEMA(ticker:str, period:str='1mo', interval:str='1d', length:int=14):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)
    st_data = st_data.sort_index()
    st_data = st_data.drop_duplicates()
    
    ema = st_data.ewm(span=length,adjust=False).mean()
    res = []
    for index,row in ema.iterrows():
        time_value = format_time_value(index, interval)
        res.append({
            "time": time_value,
            "value": round(row['Close'],2)
        })
    return remove_duplicate_times(res)

@app.get("/stock/{ticker}/rsi")
def getRSI(ticker: str, period: str = "3mo", interval: str = "1d", length: int = 14):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)
    st_data = st_data.sort_index()
    st_data = st_data.drop_duplicates()
    
    delta = st_data['Close'].diff()

    gain = delta.where(delta > 0, 0)
    loss = abs(delta.where(delta < 0, 0))

    avg_gain = gain.rolling(window=length, min_periods=length).mean()
    avg_loss = loss.rolling(window=length, min_periods=length).mean()

    for i in range(length, len(st_data)):
        avg_gain.iloc[i] = (avg_gain.iloc[i-1] * (length - 1) + gain.iloc[i]) / length
        avg_loss.iloc[i] = (avg_loss.iloc[i-1] * (length - 1) + loss.iloc[i]) / length    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    
    res = []
    for index, value in rsi.items():
        if pd.isna(value):
            continue
            
        time_value = format_time_value(index, interval)
        res.append({
            "time": time_value,
            "value": round(value, 2)
        })
    return remove_duplicate_times(res)

@app.get("/stock/{ticker}/vwap")
def getVWAP(ticker:str, period:str='1d', interval:str='1m'):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)
    st_data = st_data.sort_index()
    st_data = st_data.drop_duplicates()
    
    vwap = (((st_data['High']+st_data['Low']+st_data['Close']) / 3) * st_data['Volume']).cumsum() / st_data['Volume'].cumsum()
    res = []
    for index, value in vwap.items():
        time_value = format_time_value(index, interval)
        res.append({
            "time": time_value,
            "value": float(round(value, 2))
        })
    return remove_duplicate_times(res)

@app.get("/stock/{ticker}/returns")
def getDailyReturns(ticker:str, period:str='1mo', interval:str='1d'):
    st_data = yf.Ticker(ticker).history(period=period, interval=interval)
    st_data = st_data.sort_index()
    st_data = st_data.drop_duplicates()
    
    st_data['Daily Return'] = st_data['Close'].pct_change() * 100
    res = []
    for index, row in st_data.iterrows():
        if pd.isna(row['Daily Return']):
            continue
        time_value = format_time_value(index, interval)
        res.append({
            "time": time_value,
            "value": round(row['Daily Return'],2)
        })
    return remove_duplicate_times(res)