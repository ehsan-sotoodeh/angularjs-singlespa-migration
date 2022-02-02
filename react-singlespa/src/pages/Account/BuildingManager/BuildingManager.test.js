import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import "@testing-library/jest-dom";

import BuildingManager from "./BuildingManager";

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

jest.mock("react-router", () => ({
  useParams: jest.fn().mockReturnValue({ accountId: "123" }),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

// jest.mock("react-router-dom", () => ({
//   useHistory: () => ({
//     push: jest.fn(),
//   }),
//   useParams: jest.fn().mockReturnValue({ accountId: "123" }),
// }));

jest.mock("../../../services/buildingService", () => {
  return {
    createBuilding: jest.fn().mockImplementation(() => {
      return true;
    }),
    moveBuildings: jest.fn().mockImplementation(() => {
      return true;
    }),
    deleteBuildings: jest.fn().mockImplementation((email) => {
      return true;
    }),
  };
});

jest.mock("../../../services/userService", () => {
  return {
    getCurrentUser: jest.fn().mockImplementation(() => {
      return true;
    }),
  };
});

jest.mock("../../../helpers/api_helper", () => {
  return {
    del: jest.fn(() => Promise.resolve({ data: {} })),
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    patch: jest.fn(() => Promise.resolve({ data: {} })),
  };
});

const buildings = [
  {
    _id: "6194d760dc261a6b84fec076",
    _cls: "Building",
    name: "Double R Diner",
    location: "US",
    geo_location: { lat: 47.5, lon: -121.79 },
    contact_person: "6194d760dc261a6b84fec06e",
    permissions: [
      {
        _cls: "Permission",
        user: {
          _id: "6194d760dc261a6b84fec06e",
          _cls: "User",
          email: "agalloway@coppertreeanalytics.com",
          first_name: "Andrew",
          last_name: "Galloway",
          email_verified: false,
          phone_verified: false,
          country: "CA",
          language: "en",
          time_zone: "UTC +8",
          blocked: false,
          login_history: [],
          created_on_utc: "2021-11-17T10:20:15.864948",
          modified_on_utc: "2021-11-17T10:20:15.864981",
          pending: false,
        },
        role: { name: "admin", description: "account_creator" },
        description: "account created by Andrew Galloway",
      },
    ],
    units: "ABC",
    floors: 22,
    area: 210,
    building_type: "Hotel",
    currency: "USD",
    year: 2021,
    created_on_utc: "2021-11-17T10:20:15.866683",
    modified_on_utc: "2021-11-17T10:20:15.866711",
    notes: [],
    tags: [],
  },
];

const fakeAccount = {
  "_id": "61a50f07f419f5e1ecf4de7a",
  "_cls": "Account",
  "name": "Fake Account",
  "permissions": [
      {
          "_cls": "Permission",
          "user": "61a50f04f419f5e1ecf4de6d",
          "role": {
              "name": "admin",
              "description": "account creator"
          },
          "description": "account created by Ehsan Sotoodeh"
      },
      {
          "_cls": "Permission",
          "user": "61a50f04f419f5e1ecf4de6d",
          "role": {
              "name": "admin",
              "description": "Ehsan Account admin"
          },
          "description": "account admin Ehsan Sotoodeh"
      },
      {
          "_cls": "Permission",
          "user": "61a50f02f419f5e1ecf4de69",
          "role": {
              "name": "read",
              "description": "Ehsan Account reader"
          },
          "description": "account reader Brett Spratt"
      },
      {
          "_cls": "Permission",
          "user": "61a50f04f419f5e1ecf4de6d",
          "role": {
              "name": "read",
              "description": "Ehsan Account reader"
          },
          "description": "account reader Ehsan Sotoodeh"
      },
      {
          "_cls": "Permission",
          "user": "61a50f04f419f5e1ecf4de6e",
          "role": {
              "name": "read",
              "description": "Ehsan Account reader"
          },
          "description": "account reader Shahrokh Zehtabian"
      }
  ],
  "buildings": [
      "61a50f05f419f5e1ecf4de73",
      "61a50f05f419f5e1ecf4de74",
      "61a50f06f419f5e1ecf4de75",
      "61a50f06f419f5e1ecf4de76",
      "61a50f04f419f5e1ecf4de6f",
      "61a50f05f419f5e1ecf4de72"
  ],
  "hubspot_reference": "hubspot_ref#__TEST",
  "address": {
      "country": "Canada",
      "province_state": "BC"
  },
  "main_contact": "61a50f04f419f5e1ecf4de6d",
  "location": "CA-Central",
  "status": "active",
  "branding": {
      "app_name": "K2"
  },
  "created_on_utc": "2021-11-29T17:33:50.058916",
  "modified_on_utc": "2021-11-29T17:33:50.058940"
}

describe("render list on building manager ", () => {

  it("should render building list to check whether it's showing content to users", async ()=>{
    const { findAllByRole} = render(<BuildingManager account={fakeAccount} buildings={buildings}/>);
    const rows = await findAllByRole("row");
    expect(rows).not.toBeNull();

  })

  it("should render building list", async () => {
    const { findAllByRole } = render(<BuildingManager account={fakeAccount} buildings={buildings} />);
    const rows = await findAllByRole("row");
    expect(rows).toHaveLength(2);
  });
});
