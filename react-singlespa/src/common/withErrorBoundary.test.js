import React, { useEffect } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import "@testing-library/jest-dom";

import withErrorBoundary from "./withErrorBoundary";

jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

const TestComponent = withErrorBoundary(({ handleError }) => {
  useEffect(() => {
    handleError("I'm an Error!", { hasReport: false, asModal: false });
  }, []);
  return <p>Hello</p>;
});

describe("Render Error Boundary", () => {
  it("should render handleError modal in case of failure!", () => {
    const { getByText } = render(<TestComponent />);
    expect(getByText(/I'm an Error!/i)).toBeInTheDocument();
  });
});
