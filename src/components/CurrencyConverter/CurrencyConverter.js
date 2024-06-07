import React, { useState, useEffect } from "react";
import "./CurrencyConverter.css";
import arrowsSvg from "../../assets/arrows-svgrepo-com.svg";

export const CurrencyConverter = ({ heading }) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("exchangeRates:", exchangeRates);

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

      <div className="currency-converter-container">
        <div className="currency-block">
          {/* TODO: make the label values dynamic based on selected currency and exchange rate */}
          <label htmlFor="currency-one-amount">1 USD = 0.8110 EUR</label>
          <select
            value="USD"
            name="currency-one-amount"
            id="currency-one-amount"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          <input type="number" name="currency-one-amount" value={1} />
        </div>

        <div className="arrows-wrapper">
          <img src={arrowsSvg} className="arrows" alt="arrows" width={24} />
        </div>

        <div className="currency-block">
          {/* TODO: make the label values dynamic based on selected currency and exchange rate */}
          <label htmlFor="currency-two-amount">1 EUR = 1.2331 USD</label>
          <select
            value="EUR"
            name="currency-two-amount"
            id="currency-two-amount"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>
          <input type="number" name="currency-two-amount" value={1} />
        </div>
      </div>
    </>
  );
};
