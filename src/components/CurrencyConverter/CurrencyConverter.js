import React from "react";
import "./CurrencyConverter.css";
import arrowsSvg from "../../assets/arrows-svgrepo-com.svg";

export const CurrencyConverter = ({ heading }) => {
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
