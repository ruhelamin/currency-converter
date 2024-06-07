import React, { useState, useEffect } from "react";
import arrowsSvg from "../../assets/arrows-svgrepo-com.svg";

export const Converter = ({ exchangeRates }) => {
  const [currencyOneName, setCurrencyOneName] = useState("USD");
  const [currencyTwoName, setCurrencyTwoName] = useState("EUR");
  const [currencyOneAmount, setCurrencyOneAmount] = useState();
  const [currencyTwoAmount, setCurrencyTwoAmount] = useState(1);

  useEffect(() => {
    if (exchangeRates) setCurrencyOneAmount(exchangeRates["USD"]);
  }, [exchangeRates]);

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

  const CurrencyBlock = ({
    label,
    currencyName,
    onCurrencyNameChange,
    currencyAmount,
    onCurrencyAmountChange,
    exchangeRates,
  }) => (
    <div className="currency-block">
      <label htmlFor={`${currencyName}-amount`}>{label}</label>
      <div className="select-wrapper">
        <select
          name={`${currencyName}-amount`}
          id={`${currencyName}-amount`}
          value={currencyName}
          onChange={onCurrencyNameChange}
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
        name={`${currencyName}-amount`}
        value={currencyAmount}
        onChange={onCurrencyAmountChange}
      />
    </div>
  );

  const numberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  };

  return (
    <div className="currency-converter-container">
      <CurrencyBlock
        label={currencyOneLabel}
        currencyName={currencyOneName}
        onCurrencyNameChange={handleCurrencyOneNameChange}
        currencyAmount={new Intl.NumberFormat(numberFormatOptions).format(
          currencyOneAmount
        )}
        onCurrencyAmountChange={handleCurrencyOneAmountChange}
        exchangeRates={exchangeRates}
      />

      <div className="arrows-wrapper">
        <img src={arrowsSvg} className="arrows" alt="arrows" width={24} />
      </div>

      <CurrencyBlock
        label={currencyTwoLabel}
        currencyName={currencyTwoName}
        onCurrencyNameChange={handleCurrencyTwoNameChange}
        currencyAmount={new Intl.NumberFormat(numberFormatOptions).format(
          currencyTwoAmount
        )}
        onCurrencyAmountChange={handleCurrencyTwoAmountChange}
        exchangeRates={exchangeRates}
      />
    </div>
  );
};
