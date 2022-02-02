import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ResponseAlert from "../../common/ResponseAlert";
import AccountInfo from "./AccountInfo";

export default function ModalCreateAccount(props) {
  const { onClose, onSubmit, config } = props;
  const { t } = useTranslation();
  toast.configure();
  // const [info, setInfo] = useState(props.info);
  const [show, setShow] = useState(config.show);
  const [info, setInfo] = useState({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("edit");
  const [isFormValid, setFormValidation] = useState(false);

  function changeHandler(name, value, superField, isValid) {
    if (superField) {
      setInfo({
        ...info,
        [superField]: { ...info[superField], [name]: value },
      });
    } else {
      setInfo({ ...info, [name]: value });
    }
    setFormValidation(isValid);
  }

  function close() {
    onClose();
  }
  function responseMessage() {
    toast.success("Account Created successfully", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    });
    close();
    window.location.reload(true);
  }
  function submit() {
    setSubmitting(true);
    setInfo({ info });
    setMode("view");
    onSubmit(info);
    responseMessage();
  }

  function resetStats() {
    setSubmitting(false);
    setMode("edit");
  }

  useEffect(() => {
    resetStats();
    setInfo({ address: {} });
    setFormValidation(false);
  }, [show]);

  useEffect(() => {
    if (config.error) {
      resetStats();
    } else if (config.succeeded) {
      resetStats();
      setTimeout(() => setShow(false), 2000);
    } else {
      setShow(config.show);
    }
  }, [config]);

  return (
    <Modal size="lg" centered={true} isOpen={show}>
      <ModalHeader toggle={close}>{t("Create Account")}</ModalHeader>
      <ModalBody>
        <ResponseAlert config={config} successMessage="Account created successfully" />
        <p data-testid="headerText">
          {t('Fill in your account detail bellow. When the account is created you will be added as an admin user to the account')}.
        </p>
        <AccountInfo mode={mode} info={info} onChange={changeHandler} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit} disabled={!isFormValid}>
          {t("Create")}
          {isSubmitting && <Spinner className="ml-2" color="light" size="sm" />}
        </Button>{" "}
        <Button color="secondary" onClick={close}>
          {t("Cancel")}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
