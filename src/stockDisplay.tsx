import { VolatilityCalc } from "./QuantLogic";
import type { StockDataSnap } from "./QuantLogic";
import './stockDisplay.css';

export interface Props{
    ticker:string | null;
    stockData: StockDataSnap | null;
}

function DisplayStock({stockData,ticker}:Props){
    return (
        <div className="stock-display-container">
            {stockData && ticker ? (
                <table className="stock-table">
                    <thead>
                        <tr>
                            <th colSpan={14} className="table-header">
                                {ticker}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="label">Date</td>
                            <td className="value">{stockData.date}</td>
                            <td className="label">Open</td>
                            <td className="value">${stockData.open}</td>
                            <td className="label">High</td>
                            <td className="value high">${stockData.high}</td>
                            <td className="label">Low</td>
                            <td className="value low">${stockData.low}</td>
                            <td className="label">Close</td>
                            <td className="value">${stockData.close}</td>
                            <td className="label">Volume</td>
                            <td className="value">{stockData.volume.toLocaleString()}</td>
                            <td className="label">Volatility</td>
                            <td className="value volatility">{VolatilityCalc.calVol(stockData).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div className="placeholder">Enter a ticker symbol</div>
            )}
        </div>
    )
}

export default DisplayStock;