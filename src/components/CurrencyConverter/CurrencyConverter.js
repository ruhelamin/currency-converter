import React, { useState, useEffect } from "react";
import "./CurrencyConverter.css";
import { Converter } from "./Converter";

export const CurrencyConverter = ({ heading }) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const BASE_CURRENCY = { EUR: 1 };
    // NOTE: using https://cors-anywhere.herokuapp.com/ proxy service to bypass ECB CORS policy for development
    const exchangeRatesUrl =
      "https://cors-anywhere.herokuapp.com/http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";

    const getExchangeRatesData = async () => {
      try {
        const response = await fetch(exchangeRatesUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const cubeNodes = xmlDoc.querySelectorAll("Cube[currency]");
        const rates = {};

        cubeNodes.forEach((cube) => {
          const currency = cube.getAttribute("currency");
          const rate = parseFloat(cube.getAttribute("rate"));
          rates[currency] = rate;
        });

        setExchangeRates({ ...BASE_CURRENCY, ...rates });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    getExchangeRatesData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      {heading && <h1>{heading}</h1>}
      <Converter exchangeRates={exchangeRates} />
    </>
  );
};
