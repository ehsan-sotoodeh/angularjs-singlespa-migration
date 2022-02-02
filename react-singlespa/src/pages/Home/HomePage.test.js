import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import "@testing-library/jest-dom";

import HomePage from "./HomePage";


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

jest.mock("./ExampleApiRequest", () => {
  return {
    handleApiRequest: jest.fn().mockImplementation(() => {
      return true;
    }),
    userData: jest.fn().mockImplementation(() => {
      return true;
    }),
  };
});

describe('Render Home page ', ()=>{
	
it('test home page', ()=>{
	const { getByText } = render(<HomePage/>);
	expect(getByText('Admin Home page')).toBeInTheDocument();
})
})