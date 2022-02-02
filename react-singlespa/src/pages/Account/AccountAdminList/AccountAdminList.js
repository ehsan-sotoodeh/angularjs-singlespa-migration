import React, { useState, useEffect, useRef } from "react";
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
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faUserPlus,
  faTimes,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

import {
  getAccountAdmins,
  deleteAccountAdmins,
  inviteUserToAccount,
} from "../../../services/accountService";
import { summarizeText } from "../../../helpers/utils";
import withErrorBoundary from "../../../common/withErrorBoundary";

//TODO move this to a better place
const NUMBER_OF_ALLOWED_ADMINS = 5;

function AccountAdminList({handleError}) {
  const [viewMode, setViewMode] = useState("view"); //view, edit, invite
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation();

  useEffect(async () => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedAdmins = await getAccountAdmins();
        setAdmins(fetchedAdmins);
      } catch (error) {
        handleError(error,{hasReport:true,asModal:true});
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRevokeAdmin = async (email) => {
    if (admins.length === 1) {
      console.log("Should have at least one admin");
      return;
    }
    try {
      const result = await deleteAccountAdmins(email);
      if (result) {
        const fetchedAdmins = admins.filter((a) => a.email !== email);
        setAdmins(fetchedAdmins);
      }
    } catch (error) {

      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between">
        <CardTitle>{t("Admins")}</CardTitle>
        <div>
          {(viewMode === "edit" || viewMode === "invite") && (
            <Button
              size="sm"
              outline
              color="secondary"
              aria-label="cancel"
              className="mr-2"
              onClick={() => setViewMode("view")}
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          )}
          {viewMode === "view" && (
            <Button
              size="sm"
              outline
              color="primary"
              aria-label="edit"
              onClick={() => setViewMode("edit")}
            >
              <FontAwesomeIcon icon={faCog} />
            </Button>
          )}

          {viewMode === "edit" && (
            <Button
              size="sm"
              outline
              color="primary"
              aria-label="add admin"
              onClick={() => setViewMode("invite")}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardBody className="d-flex justify-content-between">
        {loading && (
          <div className="d-flex justify-content-center mt-5">
            <Spinner className="mr-2" color="dark" size="lg" />
          </div>
        )}

        {!loading && viewMode !== "invite" && (
          <Table responsive size="md">
            <thead>
              <tr>
                <th>{t("Name")}</th>
                <th>{t("Permissions")}</th>
                {viewMode === "edit" && <th>{t("Revoke")}</th>}
              </tr>
            </thead>
            <tbody>
              {admins.length
                ? admins.map((admin) => {
                    return (
                      <AdminRow
                        key={uuid()}
                        viewMode={viewMode}
                        admin={admin}
                        handleRevokeAdmin={handleRevokeAdmin}
                        isLastRow={admins.length < 2}
                      />
                    );
                  })
                : null}
            </tbody>
          </Table>
        )}
        {!loading && viewMode === "invite" && (
          <InviteUI
            setAdmins={setAdmins}
            admins={admins}
            setViewMode={setViewMode}
          />
        )}
      </CardBody>
    </Card>
  );
}

const AdminRow = ({ admin, viewMode, handleRevokeAdmin, isLastRow }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const handleRevokeClicked = async (email) => {
    setDeletePending(true);
    await handleRevokeAdmin(email);
  };

  const name = admin.first_name
    ? admin.first_name + " " + admin.last_name
    : admin.email;
  const permission = admin._id ? "Admin" : "Pending";
  const tooltipId = admin.email.replace(/\./gi, "").replace("@", "");

  if (viewMode === "edit") {
    return (
      <tr className={deletePending ? "text-secondary" : ""}>
        <td>
          <span id={"Tooltip-" + tooltipId}>{summarizeText(name, 15)}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={"Tooltip-" + tooltipId}
            toggle={toggle}
          >
            {admin.email}
          </Tooltip>
        </td>
        <td> {permission}</td>
        <td className="text-center">
          {!deletePending && (
            <Button
              size="small"
              outline
              color="danger"
              className="border-0 "
              aria-label="delete row"
              onClick={() => handleRevokeClicked(admin.email)}
              disabled={isLastRow}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          )}
          {deletePending && <Spinner className="mr-2" color="dark" size="sm" />}
        </td>
      </tr>
    );
  } else {
    return (
      <tr key={"admin-permission " + admin.email}>
        <td>
          <span id={"Tooltip-" + tooltipId}>{summarizeText(name, 20)}</span>
          <Tooltip
            placement="top"
            isOpen={tooltipOpen}
            target={"Tooltip-" + tooltipId}
            toggle={toggle}
          >
            {admin.email}
          </Tooltip>
        </td>
        <td>{permission}</td>
      </tr>
    );
  }
};

const InviteUI = ({ setAdmins, setViewMode, admins }) => {
  const [isFormValid, setFormValidatiom] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const formRef = useRef();
  const { t } = useTranslation();

  async function changeHandler(event) {
    const { name, value } = event.target;
    setEmail(value);
    await formRef.current._validators[name](value);
    const isValid = !Object.keys(formRef.current.state.invalidInputs).length;
    setFormValidatiom(isValid);
  }

  const handleInvite = async () => {
    try {
      setIsSubmitting(true);
      const newAdminsList = await inviteUserToAccount(email);
      setAdmins(newAdminsList);
      setViewMode("view");
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <AvForm ref={formRef}>
      {admins.length >= NUMBER_OF_ALLOWED_ADMINS && (
        <p className="text-danger">
          {t("You can't have more than X admins", {
            number: NUMBER_OF_ALLOWED_ADMINS,
          })}
        </p>
      )}
      <Label>{t("User Email")}:</Label>
      <AvField
        name="email"
        type="email"
        placeholder={"example@example.com"}
        onChange={changeHandler}
        value={email}
        disabled={admins.length >= NUMBER_OF_ALLOWED_ADMINS}
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
        disabled={
          !isFormValid ||
          isSubmitting ||
          admins.length >= NUMBER_OF_ALLOWED_ADMINS
        }
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

export default withErrorBoundary(AccountAdminList);
