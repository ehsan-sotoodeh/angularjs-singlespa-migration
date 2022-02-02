import React from "react";
import { render,screen,fireEvent} from "@testing-library/react";
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';

import AccountInfo  from "./AccountInfo";


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


const changeHandler = jest.fn();

const info = {
	accountname : 'Double R Dinar',
	country: 'USA'
}

describe('Tests for AccountInfo Page', ()=>{
	

	it("Should render the list of admins", async () => {
    const { findAllByRole } = render(<AccountInfo mode={()=> false} info={true} />);
   

  });
})