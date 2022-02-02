import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import { v4 as uuid } from "uuid";

import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Button,
  Tooltip,
  Spinner,
  Label,
  Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faUserPlus,
  faTimes,
  faCog,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

//import { inviteUserToBuilding } from "../../../services/accountService";
import {
  editPermissions,
  inviteUserToBuilding,
} from "../../../services/buildingService";

import { summarizeText } from "../../../helpers/utils";


const PERMS = {
  read: "Read",
  write: "Read & Write",
  admin: "Admin",
};
export default function BuildingUsersPermissionsWidget({ permissions = [] }) {
  const [viewMode, setViewMode] = useState("view"); //view, edit, invite
  const [perms, setPerms] = useState([...permissions]);
  const [loading, setLoading] = useState(false);
  let { buildingId, accountId } = useParams();
  const { t } = useTranslation();
  const handleRevokePerm = async (userId) => {
    if (perms.length === 1) {
      console.log("Should have at least one user");
      return;
    }
    try {
      const newPerms = perms.filter((p) => p.user._id !== userId);
      alert("route is not ready");
      setPerms(newPerms);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePerm = async (userId, value) => {
    const response = await editPermissions({
      account_id: accountId,
      building_ids: [buildingId],
      role: value,
      user_ids: [userId],
    });
    if (response.succeeded) {
      const updatedPerm = response.data[0].permissions.filter(
        (p) => p.user === userId
      )[0];
      const newPerms = perms.map((p) => {
        if (p.user._id === updatedPerm.user) {
          return {
            ...updatedPerm,
            user: p.user,
          };
        }
        return p;
      });

      setPerms([...newPerms]);
    }
  };

  const permsJSX = !perms.length ? (
    []
  ) : (
    <tbody>
      {perms.map((perm) => {
        return (
          <UserPermRow
            key={uuid()}
            viewMode={viewMode}
            perm={perm}
            setPerms={setPerms}
            handleRevokePerm={handleRevokePerm}
            handleChangePerm={handleChangePerm}
            isLastRow={perm.length < 2}
          />
        );
      })}
    </tbody>
  );

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <CardTitle>{t("User Permissions")}</CardTitle>
        <div>
          {(viewMode === "edit" || viewMode === "invite") && (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => setViewMode("view")}
            />
          )}
          {viewMode === "view" && (
            <FontAwesomeIcon icon={faCog} onClick={() => setViewMode("edit")} />
          )}

          {viewMode === "edit" && (
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => setViewMode("invite")}
              className="ml-3"
            />
          )}
          <FontAwesomeIcon
            className="ml-3"
            style={{ cursor: "pointer" }}
            icon={faArrowsAlt}
          />
        </div>
      </CardHeader>

      <CardBody>
        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <Spinner className="mr-2" color="dark" size="lg" />
          </div>
        )}
        <AvForm>
          {!loading &&
            viewMode !== "invite" &&
            (perms.length ? (
              <Table striped hover>
                <thead>
                  <tr>
                    <th>{t("Name")}</th>
                    {viewMode === "view" ? (
                      <th>{t("Status")}</th>
                    ) : (
                      <th>{t("Permissions")}</th>
                    )}
                    {viewMode === "edit" ? (
                      <th>{t("Revoke")}</th>
                    ) : (
                      <th>{t("Permissions")}</th>
                    )}
                  </tr>
                </thead>
                {permsJSX}
              </Table>
            ) : (
              <p className="text-center">{t("No Permission Found")}!</p>
            ))}

          {!loading && viewMode === "invite" && (
            <InviteUI
              setPerms={setPerms}
              perms={perms}
              setViewMode={setViewMode}
            />
          )}
        </AvForm>
      </CardBody>
    </Card>
  );
}

const UserPermRow = ({
  perm,
  setPerms,
  viewMode,
  handleRevokePerm,
  handleChangePerm,
  isLastRow,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [changePending, setChangePending] = useState(false);
  const { t } = useTranslation();

  const { user } = perm;

  const toggle = () => setTooltipOpen(!tooltipOpen);
  const handleRevokeClicked = async (userId) => {
    setChangePending(true);
    await handleRevokePerm(userId);
  };

  const permChangeHandler = async (event) => {
    const { name, value } = event.target;
    setChangePending(true);
    const response = await handleChangePerm(perm.user._id, value);

    setChangePending(false);
    event.preventDefault();
  };

  const name = user.first_name
    ? user?.first_name + " " + user?.last_name
    : user?.email;

  const tooltipId = user._id;
  if (viewMode === "edit") {
    return (
      <tr className={changePending ? "text-secondary" : ""}>
        <td>
          <span id={"Tooltip-" + tooltipId}>{summarizeText(name, 15)}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={"Tooltip-" + tooltipId}
            toggle={toggle}
          >
            {user.email}
          </Tooltip>
        </td>
        <td>
          <AvField
            type="select"
            id={"perm" + user.email}
            name={"perm" + user.email}
            onChange={(e) => permChangeHandler(e, user._id)}
            value={perm.role.name}
            errorMessage={t("Can't be empty")}
            validate={{
              required: { value: false },
            }}
            disabled={changePending}
            bsSize="sm"
          >
            {Object.keys(PERMS).map((key) => {
              return (
                <option key={key} value={key}>
                  {PERMS[key]}
                </option>
              );
            })}
          </AvField>

          {/* {permission} */}
        </td>
        <td className="text-center">
          {!changePending && (
            <Button
              size="small"
              outline
              color="danger"
              className="border-0 "
              aria-label="delete row"
              onClick={() => handleRevokeClicked(user?._id)}
              disabled={isLastRow}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )}
          {changePending && <Spinner className="mr-2" color="dark" size="sm" />}
        </td>
      </tr>
    );
  } else {
    return (
      <tr key={"user-permission " + user.email}>
        <td>
          <span id={"Tooltip-" + tooltipId}>{summarizeText(name, 20)}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={"Tooltip-" + tooltipId}
            toggle={toggle}
          >
            {user.email}
          </Tooltip>
        </td>
        <td>{perm.user.pending && <Badge color="info">Pending...</Badge>}</td>
        <td className="text-center">{PERMS[perm.role.name]}</td>
      </tr>
    );
  }
};

const InviteUI = ({ setPerms, setViewMode, perms }) => {
  const [isFormValid, setFormValidatiom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const formRef = useRef();
  const { t } = useTranslation();
  let { buildingId, accountId } = useParams();

  async function changeHandler(event) {
    const { name, value } = event.target;
    setEmail(value);
    await formRef.current._validators[name](value);
    const isValid = !Object.keys(formRef.current.state.invalidInputs).length;
    setFormValidatiom(isValid);
  }

  const handleInvite = async () => {
    setIsSubmitting(true);
    try {
      const response = await inviteUserToBuilding({
        email: email,
        role: "read",
        target: buildingId,
      });
      if (response.succeeded) {
        const newPermsList = [
          ...perms,
          {
            user: "614e28cea756ca94690878bb",
            role: {
              name: "read",
              description: "Role granted by esotoodeh@coppertreeanalytics.com",
            },
            description: "Role object permission for ehsan.set12@gmail.com",
          },
        ];
        setIsSubmitting(false);
        setPerms(newPermsList);
        setViewMode("edit");
      } else {
        //TODO remove the following section
        // because of the error with sending email, sometimes user is added but no email is sent.
        // So here if user is added with add it to the permission page
        if (response.error.data.success) {
          console.log(response);
          const newPermsList = [
            ...perms,
            {
              user: {
                email: email,
                pending: true,
              },
              role: {
                name: "read",
                description:
                  "Role granted by esotoodeh@coppertreeanalytics.com",
              },
              description: "Role object permission for " + email,
            },
          ];
          setPerms(newPermsList);
          setViewMode("edit");
        }
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <AvForm ref={formRef}>
      <Label>{t("User Email")}:</Label>
      <AvField
        name="email"
        type="email"
        placeholder={"example@example.com"}
        onChange={changeHandler}
        value={email}
        data-testid="email-input"
        errorMessage={t("Email not valid")}
        validate={{
          required: { value: true },
          email: { value: true },
        }}
      />
      <Button
        className="w-100"
        onClick={handleInvite}
        color="primary"
        style={{ height: "40px" }}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <Spinner className="ml-2" size="sm" />
        ) : (
          <FontAwesomeIcon icon={faUserPlus} size="lg" />
        )}
        <span className="ml-2">{t("Invite")}</span>
      </Button>
    </AvForm>
  );
};
