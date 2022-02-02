import React, { useState, useEffect } from "react";
import { logout } from "@react-mf/root-config";

import UserDetailsForm from "../../common/UserDetailsForm";
import {
  updateUser,
  createNewUser,
  deleteCurrentUser,
} from "../../services/userService";
import { getCurrentUser } from "../../services/userService";

export default function UserProfilePage() {
  const [config, setConfig] = useState({});
  const [user, setUser] = useState();

  useEffect(async () => {
    const currentUser = await getCurrentUser();
    currentUser.avatar = currentUser.picture;
    delete currentUser.picture;
    setUser(currentUser);
  }, []);

  async function saveHandler(selectedUser) {
    if (selectedUser._id) {
      const response = await updateUser(selectedUser);
      updateStatus(response, "User information successfully updated");
    } else {
      const response = await createNewUser(selectedUser);
      updateStatus(response, "New user successfully created");
    }
  }

  async function deleteHandler(selectedUser) {
    if (selectedUser._id) {
      const response = await deleteCurrentUser();
      updateStatus(response, "User deleted successfully");
      if (response.succeeded) {
        setTimeout(() => logout(), 2000);
      }
    }
  }

  function updateStatus(r, successMessage) {
    if (r.succeeded) {
      setConfig({ succeeded: true, successMessage: successMessage });
    } else {
      setConfig({ error: r.error });
    }
    setTimeout(() => setConfig({}), 2000);
  }

  return (
    <div className="">
      {user && (
        <UserDetailsForm
          user={user}
          config={config}
          onSave={saveHandler}
          onDelete={deleteHandler}
          action="profile"
        ></UserDetailsForm>
      )}
    </div>
  );
}
