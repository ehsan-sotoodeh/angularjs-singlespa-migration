import React from "react";
import { render,screen,fireEvent} from "@testing-library/react";
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';

import ModalDeleteAccount  from "./ModalDeleteAccount";


jest.mock('react-i18next', () => ({
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


describe("Modal Delete Account",() => {

  it("Render Component", async () => {
    const test1 = true;
    const { findAllByRole } = render(
      <ModalDeleteAccount 
      onClose={() => false}
      onSubmit={() => false}
      config ={true}
      />
      );

  });
});