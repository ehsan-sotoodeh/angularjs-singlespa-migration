import React from "react";
import { render,screen,fireEvent} from "@testing-library/react";
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';

import ModalCreateAccount  from "./ModalCreateAccount";

/*const [show, setShow] = React.useState(true);*/

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


async function submitCreateAccount(info) {
    setCreateAccountConfig({ ...createAccountConfig, error: undefined });

    const response = await createAccount(info);

    if (response.succeeded) {
      setAccounts(accounts.concat(response.data));
      setCreateAccountConfig({ show: false, succeeded: true });
    } else {
      setCreateAccountConfig({ ...createAccountConfig, error: response.error });
    }
  }

/*describe("renders wizard's step1 ", () => {
  const init = () => {
    render(<ModalCreateAccount config={createAccountConfig}
        onClose={() => setCreateAccountConfig({ show: false })}
        onSubmit={submitCreateAccount} />);

  }
  
});*/


describe("Modal Create Account",() => {

  it("Modal is working or not", () => {
    
    const submitCreateAccount = jest.fn();
    const { getByText } =  render(
      <ModalCreateAccount 
      onClose={() => false}
      onSubmit={() => false}
      config ={true}
      />
      );

  });
});
