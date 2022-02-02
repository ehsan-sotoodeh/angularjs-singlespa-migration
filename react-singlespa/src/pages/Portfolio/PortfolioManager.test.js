import React from "react";
import { render,screen,fireEvent} from "@testing-library/react";
import { act } from 'react-dom/test-utils';

import '@testing-library/jest-dom';

import PortfolioManager  from "./PortfolioManager";

const items =  [
   	{
   		id: 1,
   		name:"Portfolio 1",
   		buildingCount: 2,
   		sharedWith: "John"
   	},
   	{
   		id: 2,
   		name:"Portfolio 2",
   		buildingCount: 2,
   		sharedWith: "Steve"
   	},
   	{
   		id: 3,
   		name:"Portfolio 3",
   		buildingCount: 65,
   		sharedWith: "John Smith"
   	}
   ];

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


describe('Render portfolio component', ()=>{ 
	it('Check portfolio component is working',  ()=>{

		const { getByText,getByRole } = render(<PortfolioManager />);
    expect(getByText('My Portfolio Manager')).toBeInTheDocument();
		
	});
  it('Check data of portfolio component', async ()=>{

    const { findAllByRole } = render(<PortfolioManager />);
    const rows = await findAllByRole("row");
    expect(rows).toHaveLength(4);
    
    
  });
  
})


