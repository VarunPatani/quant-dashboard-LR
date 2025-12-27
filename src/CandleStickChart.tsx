import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, AreaSeries, ColorType, CrosshairMode,LineSeries, HistogramSeries} from 'lightweight-charts';
import type { IChartApi } from 'lightweight-charts';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume:number
}

export interface EMAData {
    time: string;
    value: number;
}


export interface RSIData {
    time: string;
    value: number;
}

export interface VWAPData {
    time: string;
    value: number;
}


export interface Props {
    data : CandleData[];
    ema20: EMAData[];
    ema50: EMAData[];
    ema200: EMAData[];
    rsi:RSIData[];
    vwap:VWAPData[];
} 

/*
In React,  refers to the current value of a mutable reference (ref) object, often a direct reference to a DOM element. The  part of the name is a common naming convention for a ref that points to a containing element. [1, 2, 3]  
How it Works 

•  Hook: A ref object is typically created using the  hook in a functional component, for example: . 
•  Property: The  hook returns a plain JavaScript object with a single  property. You can read from or write to this property at any time. 
• Linking to a DOM Node: When you pass the ref object to a JSX element's  attribute (e.g., ), React sets the  property to the corresponding DOM element instance once the component is mounted. 
• Accessing the DOM Node: You can then access and manipulate the actual DOM node using  in event handlers or  hooks, allowing you to use standard browser APIs (e.g.,  or ). [1, 2, 4, 5]  

Common Use Cases 

• Managing focus, selection, or media playback. 
• Integrating with third-party DOM libraries. 
• Imperative animations. 
• Storing any mutable value that doesn't trigger a re-render when changed (unlike state). [1, 2, 4, 6, 7]  

The term "container" is also an informal term used in the "presentational vs. container components" pattern, which is an architectural approach to separate logic and state management from UI rendering. However, in the context of , it almost certainly refers to the  property of a  object that references a DOM container element. For more details on using refs, you can refer to the official React documentation on Manipulating the DOM with 

*/ 


function CandleStickChart({data,ema20,ema50,ema200,rsi,vwap}:Props) {
    const container = useRef<HTMLDivElement>(null);
    const rsiContainer = useRef<HTMLDivElement>(null);
    const volContainer = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi>(null);

    useEffect(() => {
        if (!container.current || data.length === 0) return;  
        
        const chartOptions = { 
            layout: { 
                textColor: 'black',
                background: { type: ColorType.Solid, color: 'white' } ,
                fontFamily: "Times New Roman"
            },
            timeScale: {
                timeVisible:true,
                secondsVisible:false,
            },
            crosshair: {
                mode: CrosshairMode.MagnetOHLC
            },
            autoSize: true
        };
        const chart = createChart(container.current, chartOptions)
        const rsiChart = createChart(rsiContainer.current!,chartOptions)
        const volChart = createChart(volContainer.current!,chartOptions)
        chartRef.current = chart;
        
        // const areaSeries = chart.addSeries(AreaSeries, {
        //     lineColor: '#2962FF', topColor: '#2962FF',
        //     bottomColor: 'rgba(41, 98, 255, 0.28)',
        // });
        // const areaData = data.map(item => ({time:item.time,value:item.close}))
        // areaSeries.setData(areaData)
        
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });
        candlestickSeries.setData(data);

        const emas20 = chart.addSeries(LineSeries, { color: '#0044ffff', lineWidth: 2 });
        if(ema20 && ema20.length >= 20) {emas20.setData(ema20)}
        
        const emas50 = chart.addSeries(LineSeries, { color: '#b700ffff', lineWidth: 2 });
        if(ema50 && ema50.length >= 50) {emas50.setData(ema50)}
        
        const emas200 = chart.addSeries(LineSeries, { color: '#ff0000ff', lineWidth: 2 });
        if(ema200 && ema200.length >= 200) {emas200.setData(ema200)}
        const volumeSeries = volChart.addSeries(HistogramSeries,{
        color: '#26a69a',
        priceFormat: {
            type: 'volume',
        },
        priceScaleId: '',
        });

        volumeSeries.priceScale().applyOptions({
        scaleMargins: {
            top: 0.1,
            bottom: 0,
        },
        });

        const volumeData = data.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open ? '#26a69a80' : '#ef535080'
        }));

        volumeSeries.setData(volumeData);
        
        const rsiSeries = rsiChart.addSeries(LineSeries, {
            color: '#ff9900',
            lineWidth: 2,
        });

        const vwapSeries = chart.addSeries(LineSeries, { color: '#ff00ffff', lineWidth: 2 });
        if(vwap && vwap.length > 0) {
            vwapSeries.setData(vwap)
        }
        rsiSeries.setData(rsi);
        chart.timeScale().fitContent();
        rsiChart.timeScale().fitContent();
        return () => {
            chart.remove();
            rsiChart.remove();
            volChart.remove();
        }
    }, [data, ema20, ema50, ema200, rsi,vwap])

return (
    <div className='ChartContainers'>
        <div  ref = {container} className='CandleChart'/>
        <div  ref = {rsiContainer} className='RsiChart'/>
        <div  ref = {volContainer} className='VolumeChart'/>
    </div>
)


}

export default CandleStickChart;