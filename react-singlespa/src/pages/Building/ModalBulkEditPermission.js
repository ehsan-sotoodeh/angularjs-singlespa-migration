import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Label,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { editPermissions } from "../../services/buildingService";
import ResponseAlert from "../../common/ResponseAlert";
import { PermissionOptions } from "../../assets/Globals";

export default function ModalBulkEditPermission(props) {
  const {
    show,
    onClose,
    onSubmit,
    selectedRows,
    pivot,
    buildings,
    users,
  } = props;

  const { t } = useTranslation();
  toast.configure();
  const formRef = useRef();
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState(1);
  const [recordNo, setRecordNo] = useState(0);
  const [recordName, setRecordName] = useState();
  const [isSubmitting, setSubmitting] = useState(false);
  const [role, setRole] = useState();
  const [radioOption, setRadioOption] = useState("edit");
  const [selectedId, setselectedId] = useState();

  function close() {
    onClose();
  }

  async function submit() {
    setSubmitting(true);

    const params = {
      account_id: props.account._id,
      building_ids:
        pivot === "building" ? buildings.map((e) => e._id) : [selectedId],
      user_ids: pivot === "user" ? users.map((e) => e._id) : [selectedId],
      role: role,
    };
    const response = await editPermissions(params);
    setSubmitting(false);

    if (response.succeeded) {
      const config = {
        building_ids: params.building_ids,
        user_ids: params.user_ids,
        role: params.role,
        results: response.data.buildings,
      }
      console.log(response.data);
      console.log(response.data[0].buildings);
     onSubmit(config,response);
    } else {
      console.error(response.error);
    }
  }

  useEffect(() => {
    setStage(1);
    const recNo =
      selectedRows && (pivot === "building" ? buildings.length : users.length);
    const recName =
      pivot === "building"
        ? recNo === 1
          ? "building"
          : "buildings"
        : recNo === 1
        ? "user"
        : "users";

    setRecordNo(recNo);
    setRecordName(recName);
    setselectedId(undefined);
    setRole(undefined);
    setSubmitting(false);
  }, [show]);

  function permChangeHandler(event) {
    setRole(event.target.value);
  }

  async function radioChangeHandler(event) {
    setRadioOption(event.target.value);
  }

  function selChangeHandler(event) {
    setselectedId(event.target.value);
  }

  return (
    <Modal centered={true} isOpen={show}>
      <ModalHeader toggle={close}>{t("Bulk Edit Permissions")}</ModalHeader>

      <AvForm ref={formRef}>
        <ModalBody>
          {stage === 1 && (
            <>
              <p>
                {t("You are about to make changes to ({{x}}) {{y}}", {
                  x: recordNo,
                  y: recordName,
                })}
              </p>
              <div className="pl-5">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="action"
                    id="action1"
                    value="edit"
                    onChange={radioChangeHandler}
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="exampleRadios1">
                    {" "}
                    {t("Edit User Permissions (selected)")}{" "}
                  </label>
                </div>
                {/* <div className="form-check">
                  <input className="form-check-input" type="radio" name="action" id="action2" value="other" onChange={radioChangeHandler} />
                  <label className="form-check-label" htmlFor="exampleRadios2"> {t('Other')} </label>
                </div> */}
              </div>
            </>
          )}

          {stage === 2 && (
            <>
              <p>
                {t("Select a {{x}} to edit their permission", {
                  x: pivot === "building" ? "user" : "building",
                })}
              </p>
              {
                <AvField
                  type="select"
                  name="building"
                  id="select_building"
                  className="custom-select"
                  value={selectedId}
                  onChange={selChangeHandler}
                >
                  <option hidden> -- {t("select an option")} -- </option>
                  {pivot === "building" &&
                    users.map((element) => {
                      const name = element.pending
                        ? element.email
                        : [element.first_name, element.last_name].join(" ");
                      return (
                        <option key={element._id} value={element._id}>
                          {name}
                        </option>
                      );
                    })}
                  {pivot === "user" &&
                    buildings.map((element) => {
                      return (
                        <option key={element._id} value={element._id}>
                          {element.name}
                        </option>
                      );
                    })}
                </AvField>
              }
            </>
          )}

          {stage === 3 && (
            <>
              <p>
                {t("Select a {{x}} to edit their permission", {
                  x: pivot === "building" ? "user" : "building",
                })}
              </p>
              <AvField
                type="select"
                name="permission"
                id="permission"
                className="custom-select"
                value={role}
                onChange={permChangeHandler}
              >
                <option hidden> -- {t("select an option")} -- </option>
                <option> {t("None")} </option>
                {PermissionOptions.map((element) => {
                  return (
                    <option key={element.id} value={element.id}>
                      {element.name}
                    </option>
                  );
                })}
              </AvField>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={close}>
            {t("Cancel")}
          </Button>

          {stage === 1 && (
            <Button type="button" color="primary" onClick={() => setStage(2)}>
              {t("Next")}
            </Button>
          )}

          {stage === 2 && (
            <Button type="button" color="primary" onClick={() => setStage(3)}>
              {t("Next")}
            </Button>
          )}

          {stage === 3 && (
            <Button
              type="submit"
              color="primary"
              disabled={!role || isSubmitting}
              onClick={submit}
            >
              {t("Save")}
            </Button>
          )}
        </ModalFooter>
      </AvForm>
    </Modal>
  );
}
