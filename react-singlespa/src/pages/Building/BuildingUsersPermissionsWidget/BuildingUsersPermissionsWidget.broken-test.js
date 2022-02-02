import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import "@testing-library/jest-dom";

import BuildingUsersPermissionsWidget from "./BuildingUsersPermissionsWidget";

// const admins = [
//   {
//     "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     "email": "j-smith@myCompany.com",
//     "first_name": "John",
//     "last_name": "Smith",
//   },
//   {
//     "email": "e.sotoodeh@myCompany.com",
//   },
//   {
//     "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
//     "email": "j.doe.m@myCompany.com",
//     "first_name": "Jane",
//     "last_name": "Doe",
//   },
//   {
//     "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa8",
//     "email": "Lara.Warren@myCompany.com",
//     "first_name": "Lara",
//     "last_name": "Warren",
//   }
// ]

const perms = [
  {
    _cls: "Permission",
    user: {
      _id: "6151ebb90547a5b3d498ea9c0",
      _cls: "User",
      email: "user1@coppertreeanalytics.com",
      first_name: "John",
      last_name: "Doe",
      email_verified: false,
      phone_verified: false,
      country: "CA",
      language: "en",
      time_zone: "UTC +8",
      blocked: false,
      login_history: [],
      created_on_utc: "2021-09-27T16:05:12.301252",
      modified_on_utc: "2021-09-27T16:05:12.301380",
      pending: false,
    },
    role: {
      name: "admin",
      description: "building_creator",
    },
    description: "building created by John Doe",
  },
  {
    _cls: "Permission",
    user: {
      _id: "6151ebb90547a5b3d498ea9c1",
      _cls: "User",
      email: "hbruce@coppertreeanalytics.com",
      first_name: "Hillary",
      last_name: "Bruce",
      email_verified: false,
      phone_verified: false,
      country: "CA",
      language: "en",
      time_zone: "UTC +8",
      blocked: false,
      login_history: [],
      created_on_utc: "2021-09-27T16:05:12.301252",
      modified_on_utc: "2021-09-27T16:05:12.301380",
      pending: false,
    },
    role: {
      name: "read",
      description: "building_creator",
    },
    description: "building created by Hillary Bruce",
  },
  {
    _cls: "Permission",
    user: {
      _id: "6151ebb90547a5b3d498ea9c",
      _cls: "User",
      email: "mvillegas@coppertreeanalytics.com",
      first_name: "Miquel",
      last_name: "Villegas",
      email_verified: false,
      phone_verified: false,
      country: "CA",
      language: "en",
      time_zone: "UTC +8",
      blocked: false,
      login_history: [],
      created_on_utc: "2021-09-27T16:05:12.301252",
      modified_on_utc: "2021-09-27T16:05:12.301380",
      pending: false,
    },
    role: {
      name: "read",
      description: "building_creator",
    },
    description: "building created by Miquel Villegas",
  },
  {
    _cls: "Permission",
    user: {
      _id: "6151ebb90547a5b3d498ea9c",
      _cls: "User",
      email: "grich@coppertreeanalytics.com",
      first_name: "Glenn",
      last_name: "Rich",
      email_verified: false,
      phone_verified: false,
      country: "CA",
      language: "en",
      time_zone: "UTC +8",
      blocked: false,
      login_history: [],
      created_on_utc: "2021-09-27T16:05:12.301252",
      modified_on_utc: "2021-09-27T16:05:12.301380",
      pending: false,
    },
    role: {
      name: "write",
      description: "building_creator",
    },
    description: "building created by Glenn Rich",
  },
  {
    _cls: "Permission",
    user: {
      _id: "6151ebb90547a5b3d498ea9c",
      _cls: "User",
      email: "dmartin@coppertreeanalytics.com",
      first_name: "Dora",
      last_name: "Martin",
      email_verified: false,
      phone_verified: false,
      country: "CA",
      language: "en",
      time_zone: "UTC +8",
      blocked: false,
      login_history: [],
      created_on_utc: "2021-09-27T16:05:12.301252",
      modified_on_utc: "2021-09-27T16:05:12.301380",
      pending: false,
    },
    role: {
      name: "admin",
      description: "building_creator",
    },
    description: "building created by Dora Martin",
  },
];

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    buildingId: "someBuildingID",
    accountId: "someAccountId",
  }),
  useRouteMatch: () => ({ url: "/company/company-id1/team/team-id1" }),
}));

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

jest.mock("../../../services/buildingService", () => {
  return {
    getAccountAdmins: jest.fn().mockImplementation(() => {
      return admins;
    }),
    deleteAccountAdmins: jest.fn().mockImplementation(() => {
      return true;
    }),
    inviteUser: jest.fn().mockImplementation((email) => {
      return [...admins, { email }];
    }),
  };
});

describe("Account Admin List Component in View mode", () => {
  it("Should render the list of admins", async () => {
    const { findAllByRole } = render(<BuildingUsersPermissionsWidget />);
    const rows = await findAllByRole("row");
    expect(rows).toHaveLength(5);
  });

  it("should show only edit button", async () => {
    const { findAllByRole } = render(<BuildingUsersPermissionsWidget />);
    const editButton = await findAllByRole("button", { name: /edit/i });
    expect(editButton).toHaveLength(1);
  });

  it("click on edit button should show the edit mode", async () => {
    const { findByRole, getByRole } = render(
      <BuildingUsersPermissionsWidget />
    );
    const editButton = await findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
    expect(getByRole("button", { name: /add admin/i })).toBeInTheDocument();
    expect(getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("table should have two columns name and permission", async () => {
    const { findAllByRole } = render(<BuildingUsersPermissionsWidget />);
    const columns = await findAllByRole("columnheader");
    expect(columns).toHaveLength(2);
  });
});

describe("Account Admin List component in Edit Mode", () => {
  const init = async () => {
    const { findByRole } = render(<BuildingUsersPermissionsWidget />);
    const editButton = await findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
  };

  it("should render the edit mode", async () => {
    //enable edit mode
    await init();

    //do testing
    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    const addAdminButton = await screen.findByRole("button", {
      name: /add admin/i,
    });
    const columns = await screen.findAllByRole("columnheader");
    expect(cancelButton).toBeInTheDocument();
    expect(addAdminButton).toBeInTheDocument();
    expect(columns).toHaveLength(3);
  });

  it("delete button should revoke the admin permission", async () => {
    //enable edit mode
    await init();

    //do testing
    let deleteRowButtons = await screen.findAllByRole("button", {
      name: /delete row/i,
    });
    expect(deleteRowButtons).toHaveLength(4);
    expect(await screen.findByText(/John Smith/i)).toBeInTheDocument();
    act(() => {
      fireEvent.click(deleteRowButtons[0]);
    });
    const deletedRow = await screen.findByText(/John Smith/i);
    expect(deletedRow).not.toBeInTheDocument();
  });
});

describe("Account Admin List component in Invite Mode", () => {
  const init = async () => {
    //enable edit mode
    const { findByRole, findAllByRole } = render(
      <BuildingUsersPermissionsWidget />
    );
    const editButton = await findByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
    const addAdminButton = await findByRole("button", { name: /add admin/i });
    fireEvent.click(addAdminButton);
  };

  it("should render the edit mode", async () => {
    await init();

    const inviteButton = await screen.findByRole("button", { name: /invite/i });
    expect(inviteButton).toBeInTheDocument();
  });

  it("should invite a user successfully", async () => {
    await init();

    //do testing
    expect(screen.getByText(/invite/i).closest("button")).toBeDisabled();

    let emailInput = await screen.findByTestId("email-input");
    act(() => {
      fireEvent.change(emailInput, {
        target: { value: "example@example.com" },
      });
    });
    let inviteButton = await screen.findByText(/invite/i);
    expect(inviteButton).not.toBeDisabled();

    act(() => {
      fireEvent.click(inviteButton);
    });

    const rows = await screen.findAllByText(/pending/i);
    expect(rows).toHaveLength(2);
  });

  it("should fail to invite a user", async () => {
    await init();

    expect(screen.getByText(/invite/i).closest("button")).toBeDisabled();

    let emailInput = await screen.findByTestId("email-input");
    act(() => {
      fireEvent.change(emailInput, { target: { value: "mmmm" } });
    });

    expect(
      await screen.findByRole("button", { name: /invite/i })
    ).toBeDisabled();

    act(() => {
      fireEvent.change(emailInput, {
        target: { value: "example@example.com" },
      });
    });
    expect(
      await screen.findByRole("button", { name: /invite/i })
    ).not.toBeDisabled();
  });
});
