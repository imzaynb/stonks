import axios from "axios";
import { getYesterdayDateInNY } from "./utils";

export const BASE_URL = 'https://www.alphavantage.co/query';

type RawOHLCV = {
  '1. open': number,
  '2. high': number,
  '3. low': number,
  '4. close': number,
  '5. volume': number,
}

export type OHLCV = {
  'open': number,
  'high': number,
  'low': number,
  'close': number,
  'volume': number,
}

export type Stock = {
  ohlcv: OHLCV,
  name: string,
  ticker: string,
}

export const alphaVantageTimeSeriesDaily = async (
  ticker: string,
  outputSize: "compact" | "full" = "compact",
  date: string
): Promise<OHLCV | null> => {

  try {
    const { data, status } = await axios.get(BASE_URL, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol: ticker,
        outputsize: outputSize,
        apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_ACCESS_KEY,
      }
    });

    let rawOHLCV;
    if (date in data["Time Series (Daily)"]) {
      rawOHLCV = data["Time Series (Daily)"][date];
    } else {
      let yesterday = getYesterdayDateInNY(date);
      rawOHLCV = data["Time Series (Daily)"][yesterday];
    }

    return convertAPIResultToOHLCV(rawOHLCV as RawOHLCV);
  } catch (error) {
    alert(`${error} from alphaVantageTimeSeriesDaily`);
  }

  return null;
}

const convertAPIResultToOHLCV = (rawOHLCV: RawOHLCV): OHLCV => {
  // fun fact: prepending a string with a "+" will make it into a number
  const ohlcv: OHLCV = {
    "open": +rawOHLCV["1. open"],
    "high": +rawOHLCV["2. high"],
    "low": +rawOHLCV["3. low"],
    "close": +rawOHLCV["4. close"],
    "volume": +rawOHLCV["5. volume"],
  };

  return ohlcv;
}

export const findNameByTicker = async (ticker: string): Promise<string> => {
  const res = await axios.get(BASE_URL, {
    params: {
      function: "SYMBOL_SEARCH",
      keywords: ticker,
      apikey: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_ACCESS_KEY
    }
  })

  const name = res["data"]["bestMatches"][0]["2. name"];

  return name;
}

export const createStock = (ohlcv: OHLCV, name: string, ticker: string): Stock => {
  return {
    ohlcv: ohlcv,
    name: name,
    ticker: ticker,
  }
}