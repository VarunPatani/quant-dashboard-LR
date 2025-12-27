export interface StockDataSnap {
    ticker: string;
    date: string;
    open: number;
    high:number;
    low:number;
    close: number;
    volume:number;
}

export class VolatilityCalc {
    public static calVol(data : StockDataSnap) : number {
        if (data.open === 0 ) {return 0;}
        return Math.abs((data.close - data.open) / data.open) * 100;
    }
}

