import { useEffect, useState } from 'react';
import { VolatilityCalc } from './QuantLogic';
import type { StockDataSnap } from './QuantLogic';
import DisplayStock from './stockDisplay';
import CandleStickChart from './CandleStickChart';
import DailyReturns from './histogramReturns';
import type { CandleData } from './CandleStickChart';
import type { EMAData } from './CandleStickChart';
import type { RSIData } from './CandleStickChart';
import type { VWAPData } from './CandleStickChart'
import type { HistorgramData } from './histogramReturns';
import "./App.css";

function App() {
  const [ticker, setTicker] = useState<string>('AAPL');
  const [stockData,setStockData] = useState<StockDataSnap|null>(null);
  const [period,setPeriod] = useState<string>('1d');
  const [timeinterval,setTimeinterval] = useState<string>('1m');
  const [candleData,setCandleData] = useState<CandleData[]>([]);
  const [ema20,setEma20] = useState<EMAData[]>([]);
  const [ema50,setEma50] = useState<EMAData[]>([]);
  const [ema200,setEma200] = useState<EMAData[]>([]);
  const [rsi,setRsi] = useState<RSIData[]>([]);
  const [vwap,setVwap] = useState<VWAPData[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  const [retData,setRetData] = useState<HistorgramData[]>([]);
  // Fetch Latest Stock Data
    useEffect(() => {
    const fetchData  = async() => {
      setLoading(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/stock/${ticker}?period=${period}&interval=${timeinterval}`);
        const data = await response.json();
        setStockData(data);
      }catch(err){
        console.log("Error fetching data:", err);
        setStockData(null);
      }finally {
        setLoading(false);
      }
    }
    if(ticker) {
    fetchData(); 
    const interval = setInterval(fetchData, 60000); 
    return () => clearInterval(interval);
    }
  },[ticker, period, timeinterval]);

// Fetch Candle Data for that stock 'ticker'
  useEffect(()=>{
    const fetchCandleData = async() => {
      setLoading(true)
      try{const candleResponse = await fetch(`http://127.0.0.1:8000/stock/${ticker}/candles?period=${period}&interval=${timeinterval}`);
      const candleData = await candleResponse.json();
      const ema20  = await fetch(`http://127.0.0.1:8000/stock/${ticker}/ma?period=${period}&interval=${timeinterval}&length=20`);
      const ema50  =await fetch(`http://127.0.0.1:8000/stock/${ticker}/ma?period=${period}&interval=${timeinterval}&length=50`);
      const ema200  = await fetch(`http://127.0.0.1:8000/stock/${ticker}/ma?period=${period}&interval=${timeinterval}&length=200`);
      const rsi = await fetch (`http://127.0.0.1:8000/stock/${ticker}/rsi?period=${period}&interval=${timeinterval}&length=14`);
      const vwap = await fetch (`http://127.0.0.1:8000/stock/${ticker}/vwap?period=${period}&interval=${timeinterval}`);
      const retData = await fetch (`http://127.0.0.1:8000/stock/${ticker}/returns?period=${period}&interval=${timeinterval}`);

      setCandleData(candleData);
      setEma20(await ema20.json());
      setEma50(await ema50.json());
      setEma200(await ema200.json());
      setRsi(await rsi.json());
      setVwap(await vwap.json());
      setRetData(await retData.json());
      }catch(err){
        console.log("Error fetching candle data:", err);
      }finally{
        setLoading(false);
      }
    }
    if(ticker){
      fetchCandleData();
      const interval = setInterval(fetchCandleData, 60000);
      return () => clearInterval(interval);
    }
  },[ticker, period, timeinterval]);
  // useEffect(()=>{},[]) this is the syntax of a use effect code.
  return (
    <div className='App'>
      {loading && <div className="loading">Loading...</div>}
      <div className = "Metrics">
        <input value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Enter Ticker Symbol"  className='TickerLabel'/>

        <select id="period-select" name="period-select" className='PeriodSelect' value={period} onChange={e => setPeriod(e.target.value)}>
          <option value = '1d'>1 Day</option>
          <option value = '5d'>5 Days</option>
          <option value = '1mo'>1 Month</option>
          <option value = '3mo'>3 Month</option>
          <option value = '6mo'>6 Months</option>
          <option value = '1y'>1 Year</option>
          <option value = '5y'>5 Years</option>
          <option value = '10y'>10 Years</option>
          <option value = 'max'>Max</option>
        </select>
        <select id="time-select" name="time-select" className='TimeSelect' value = {timeinterval} onChange = {e => setTimeinterval(e.target.value)}>
          <option value = '1m'>1 Minute</option>
          <option value = '2m'>2 Minutes</option>
          <option value = '5m'>5 Minutes</option>
          <option value = '15m'>15 Minutes</option>
          <option value = '30m'>30 Minutes</option>
          <option value = '60m'>60 Minutes</option>
          <option value = '90m'>90 Minutes</option>
          <option value = '1h'>1 Hour</option>
          <option value = '1d'>1 Day</option>
          <option value = '5d'>5 Days</option>
          <option value = '1wk'>1 Week</option>
          <option value = '1mo'>1 Month</option>
          <option value = '3mo'>3 Months</option>
        </select>
        <div className='StockTickersData'>
        <DisplayStock stockData={stockData} ticker={ticker} />
        </div>
      </div>

      
      {candleData.length > 0 && <CandleStickChart data = {candleData} ema20={ema20} ema50={ema50} ema200 = {ema200} rsi = {rsi} vwap = {vwap}/>}

      {retData.length>0 && <DailyReturns data={retData}/>}
    </div>

  )
}

export default App;