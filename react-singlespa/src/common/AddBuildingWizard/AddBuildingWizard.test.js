import React from "react";
import { render,screen,fireEvent} from "@testing-library/react";
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';

import AddBuildingWizard  from "./AddBuildingWizard";


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

//wizard steps
  // step 1 start
  // step 2 general settings
  // step 3 regional settings
  // step 4 building type
  // step 5 location info

describe("renders wizard's step1 ", () => {
  const init = () => {
    render(<AddBuildingWizard />);
  }
  it("it should render the wizard first step", () => {
    const { getByTestId,findByTestId } = render(<AddBuildingWizard/>);
    const result = await findByTestId('generalWidget');
    expect(getByTestId('generalWidget')).toBeInTheDocument();
  });
  it("Click next should take use to next step", () => {
    init();

  });
  it("Click cancel should close the modal", () => {
    init();

  });

});
describe("renders wizard's step2 ", () => {
  const init = () => {
    render(<AddBuildingWizard />);
  }
  it("click on next should be disabled if necessary info is not provided", () => {
    init();
  });
  it("click on next should take us to step 3", () => {
    init();

  });
  it("click on back should take to step 1", () => {
    init();

  });
  it("click on previous step from header of wizard in should be possible", () => {
    init();

  });

});

describe("renders wizard's step3 ", () => {
  const init = () => {
    render(<AddBuildingWizard />);
  }
  it("click on next should be disabled if necessary info is not provided", () => {
    init();
  });
  it("click on next should take us to step 4", () => {
    init();

  });
  it("click on back should take to step 2", () => {
    init();

  });
});

describe("renders wizard's step4 ", () => {
  const init = () => {
    render(<AddBuildingWizard />);
  }
  it("click on next should be disabled if necessary info is not provided", () => {
    init();
  });
  it("click on next should take us to step 5", () => {
    init();

  });
  it("click on back should take to step 3", () => {
    init();

  });
});

describe("renders wizard's step5 ", () => {
  const init = () => {
    render(<AddBuildingWizard />);
  }
  it("click on next should be disabled if necessary info is not provided", () => {
    init();
  });
  it("click on add should add the building and closes modal", () => {
    init();

  });
  it("click on back should take to step 4", () => {
    init();

  });

});
