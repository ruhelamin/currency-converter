import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Converter } from "./Converter";

describe("Converter", () => {
  const exchangeRatesMock = {
    EUR: 1,
    USD: 1.0865,
    GBP: 0.85088,
  };

  test("renders the component", () => {
    render(<Converter exchangeRates={exchangeRatesMock} />);
  });

  test("displays correct conversion rates for both currencies labels", () => {
    const { getByLabelText } = render(
      <Converter exchangeRates={exchangeRatesMock} />
    );

    expect(getByLabelText(`1 USD = 0.9204 EUR`)).toBeInTheDocument();
    expect(getByLabelText(`1 EUR = 1.0865 USD`)).toBeInTheDocument();
  });

  test("updates converted amount on right side input when currency changes using left side dropdown", () => {
    const { getByLabelText, getByText } = render(
      <Converter exchangeRates={exchangeRatesMock} />
    );

    fireEvent.change(getByLabelText("1 USD = 0.9204 EUR"), {
      target: { value: "GBP" },
    });

    expect(getByText(`1 GBP = 1.1753 EUR`)).toBeInTheDocument();
    expect(getByText(`1 EUR = 0.8509 GBP`)).toBeInTheDocument();
  });

  test("updates converted amount on left side input when currency changes using right side dropdown", () => {
    const { getByLabelText, getByText } = render(
      <Converter exchangeRates={exchangeRatesMock} />
    );

    fireEvent.change(getByLabelText("1 EUR = 1.0865 USD"), {
      target: { value: "GBP" },
    });

    expect(getByText(`1 USD = 0.7831 GBP`)).toBeInTheDocument();
    expect(getByText(`1 GBP = 1.2769 USD`)).toBeInTheDocument();
  });

  test("updates converted amount on right side input when amount changes in left side input", () => {
    const { getAllByRole } = render(
      <Converter exchangeRates={exchangeRatesMock} />
    );
    const inputElements = getAllByRole("spinbutton");

    userEvent.clear(inputElements[0]);
    userEvent.type(inputElements[0], "5");

    expect(inputElements[1].value).toBe("4.6");
  });

  test("updates converted amount on left side input when amount changes in right side input", () => {
    const { getAllByRole } = render(
      <Converter exchangeRates={exchangeRatesMock} />
    );
    const inputElements = getAllByRole("spinbutton");

    userEvent.clear(inputElements[1]);
    userEvent.type(inputElements[1], "5");

    expect(inputElements[0].value).toBe("5.43");
  });
});
