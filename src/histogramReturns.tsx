import { useEffect, useRef } from 'react';
import { createChart, ColorType , HistogramSeries} from 'lightweight-charts';


export interface HistorgramData{
    time:string;
    value:number;
}


export interface Props {
    data: HistorgramData[];
}

function DailyReturns({data}:Props){
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const chartoptions = {
            layout: { 
                textColor: 'black',
                background: { type: ColorType.Solid, color: 'white' } ,
                fontFamily: "Times New Roman"
            },
            timeScale: {
                timeVisible:true,
                secondsVisible:false
            },
            autoSize: true
        };
        const chart = createChart(container.current!,chartoptions);
        const historgramSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',},
            priceScaleId: '', 
        });
        historgramSeries.priceScale().applyOptions({
            scaleMargins:{
                top:0.1,
                bottom:0
            }
        });
        historgramSeries.setData(data);
        return () => {
            chart.remove();
        }
    },[data])

    return (
        <div className='histogram-container'>
        <div className="title">Histogram of Daily Returns</div>
        <div ref={container} className="histogram-chart"/>
        </div>
    )

}



export default DailyReturns;