import { del, get, post, patch } from "../helpers/api_helper";

const accountAdmins = [
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    email: "j-smith@myCompany.com",
    first_name: "John",
    last_name: "Smith",
  },
  {
    email: "e.sotoodeh@myCompany.com",
  },
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    email: "j.doe.m@myCompany.com",
    first_name: "Jane",
    last_name: "Doe",
  },
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    email: "Lara.Warren@myCompany.com",
    first_name: "Lara",
    last_name: "Warren",
  },
];

export const getAccountAdmins = async () => {
  await new Promise((resolve, reject) =>
    setTimeout(
      resolve,
      1000
    )
  );
  return accountAdmins;
};
export const deleteAccountAdmins = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};

export const createAccount = async (accountInfo) => {
  const response = await post("account", accountInfo)
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0], error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: {}, error: e.response };
    });
  return response;
};

export const deleteAccount = async (accountId) => {
  const response = await del('account', { headers: { 'account_id': accountId } })
    .then(r => { return { succeeded: r.success, data: r.docs[0], error: r.error } })
    .catch(e => { return { succeeded: false, data: {}, error: e.response } });
  return response;
};

export const updateAccount = async (account) => {
  const response = await patch("account", account)
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0], error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: {}, error: e.response };
    });
  return response;
};

export const getAccounts = async () => {
  const response = await get("account")
    .then((r) => {
      return { succeeded: r.success, data: r.docs, error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: [], error: e.response };
    });
  return response;
};

export const getAccount = async (accountId) => {
  //ToDO: better to update back-end to get another parameter let say status which could be full or simple. When status is simple back-end
  //returns like what it currently returns. When status is full, back-end returns account with full structure of its building and user objects.
  //In this case some end points like get account buildings and some functions like get building users can be deleted.
  const response = await get("account", { params: { account_id: accountId } })
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0] };
    })
    .catch((e) => {
      return { succeeded: false, error: e.response, data: {} };
    });
  return response;
};

export const inviteUserToAccount = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  accountAdmins.unshift({ email });
  return accountAdmins;
};

export const recoverAccount = async (accountId) => {
  const url = ["account", accountId, "recover"].join("/");
  const response = await patch(url)
    .then((r) => {
      return { succeeded: r.success, data: r.docs[0], error: r.error };
    })
    .catch((e) => {
      return { succeeded: false, data: {}, error: e.response };
    });
  return response;
};
// get_account
// post_account
// patch_account
// delete_account
// get_account_admins
// post_account_admins
// get_permission
// set_permission
// patch_permission
// delete_permission
// get_permission_feature_access
// set_permission_feature_access
// patch_permission_feature_access
// delete_permission_feature_access
// get_account_admins
// get_account_admins
// get_account_admins
