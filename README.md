# My Quant App

A quantitative finance dashboard built with React (TypeScript) frontend and FastAPI (Python) backend for real-time stock market analysis and technical indicators.

## What This Project Does

This application provides:
- **Real-time stock data** fetching using Yahoo Finance API
- **Interactive candlestick charts** with technical indicators
- **Technical analysis tools** including:
  - EMA (Exponential Moving Averages) - 20, 50, 200 periods
  - RSI (Relative Strength Index)
  - VWAP (Volume Weighted Average Price)
  - Volume analysis
- **Customizable timeframes** (1 minute to max historical data)
- **Multiple period selections** (1 day to 10 years)

## Learning Purpose

**This project was created as a foundation to learn programming in React and FastAPI with a quantitative finance focus.**

The goal was to understand:
- **React/TypeScript**: Component-based UI development, state management with hooks, real-time data handling
- **FastAPI/Python**: RESTful API design, financial data processing, technical indicator calculations
- **Quantitative Programming**: Working with time series data, implementing financial algorithms, data visualization for trading analysis

This serves as a stepping stone into quantitative development, combining modern web technologies with financial mathematics.

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and build
- Lightweight Charts for financial charting
- CSS Grid for responsive layout

### Backend  
- FastAPI (Python)
- yfinance for market data
- pandas for data manipulation
- CORS enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+

### Installation

1. **Clone the repository**
```bash
git clone <https://github.com/VarunPatani/quant-dashboard-LR.git>
cd my-quant-app