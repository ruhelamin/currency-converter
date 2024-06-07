import React, { useState, useEffect } from "react";
import "./CurrencyConverter.css";
import arrowsSvg from "../../assets/arrows-svgrepo-com.svg";

export const CurrencyConverter = ({ heading }) => {
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currencyOneName, setCurrencyOneName] = useState("USD");
  const [currencyTwoName, setCurrencyTwoName] = useState("EUR");
  const [currencyOneAmount, setCurrencyOneAmount] = useState();
  const [currencyTwoAmount, setCurrencyTwoAmount] = useState(1);

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
        setCurrencyOneAmount(rates["USD"]);
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

  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    return (
      amount * (1 / exchangeRates[fromCurrency]) * exchangeRates[toCurrency]
    );
  };

  const currencyOneLabel = `1 ${currencyOneName} = ${convertCurrency(
    1,
    currencyOneName,
    currencyTwoName
  ).toFixed(4)} ${currencyTwoName}`;

  const currencyTwoLabel = `1 ${currencyTwoName} = ${convertCurrency(
    1,
    currencyTwoName,
    currencyOneName
  ).toFixed(4)} ${currencyOneName}`;

  const handleCurrencyOneNameChange = (e) => {
    const selectedCurrencyName = e.target.value;
    setCurrencyOneName(selectedCurrencyName);
    setCurrencyTwoAmount(
      convertCurrency(currencyOneAmount, selectedCurrencyName, currencyTwoName)
    );
  };

  const handleCurrencyTwoNameChange = (e) => {
    const selectedCurrencyName = e.target.value;
    setCurrencyTwoName(selectedCurrencyName);
    setCurrencyTwoAmount(
      convertCurrency(currencyOneAmount, currencyOneName, selectedCurrencyName)
    );
  };

  const handleCurrencyOneAmountChange = (e) => {
    const amount = e.target.value;
    setCurrencyOneAmount(amount);
    setCurrencyTwoAmount(
      convertCurrency(amount, currencyOneName, currencyTwoName)
    );
  };

  const handleCurrencyTwoAmountChange = (e) => {
    const amount = e.target.value;
    setCurrencyTwoAmount(amount);
    setCurrencyOneAmount(
      convertCurrency(amount, currencyTwoName, currencyOneName)
    );
  };

  return (
    <>
      {heading && <h1>{heading}</h1>}

      <div className="currency-converter-container">
        <div className="currency-block">
          <label htmlFor="currency-one-amount">{currencyOneLabel}</label>
          <div className="select-wrapper">
            <select
              name="currency-one-amount"
              id="currency-one-amount"
              value={currencyOneName}
              onChange={handleCurrencyOneNameChange}
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="currency-one-amount"
            value={new Intl.NumberFormat({
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(currencyOneAmount)}
            onChange={handleCurrencyOneAmountChange}
          />
        </div>

        <div className="arrows-wrapper">
          <img src={arrowsSvg} className="arrows" alt="arrows" width={24} />
        </div>

        <div className="currency-block">
          <label htmlFor="currency-two-amount">{currencyTwoLabel}</label>
          <div className="select-wrapper">
            <select
              name="currency-two-amount"
              id="currency-two-amount"
              value={currencyTwoName}
              onChange={handleCurrencyTwoNameChange}
            >
              {Object.keys(exchangeRates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="currency-two-amount"
            value={new Intl.NumberFormat({
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(currencyTwoAmount)}
            onChange={handleCurrencyTwoAmountChange}
          />
        </div>
      </div>
    </>
  );
};
