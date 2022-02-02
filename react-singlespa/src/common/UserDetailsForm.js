import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  CardBody,
  Label,
  Button,
  ButtonGroup,
  Spinner,
  Container,
} from "reactstrap";
import MetaTags from "react-meta-tags";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faWindowClose,
} from "@fortawesome/free-regular-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
} from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

import { restPassword, auth$ } from "@react-mf/root-config";

import UserAvatar from "../assets/images/profile-picture.png";
import { Countries, TimeZones } from "../assets/Globals";
import ModalAcceptReject from "./ModalAcceptReject";
import ModalTermsAndConditions from "./ModalTermsAndConditions";
import ModalTermsAndConditionsEula from "./ModalTermsAndConditionsEula";
import languages from "../assets/languages";
import i18n from "../i18n";
import { DragnDropImageManager } from "./ImageManager";
import ResponseAlert from "../common/ResponseAlert";

import "./UserDetailsForm.css";

export default function UserDetailsForm(props) {
  const profileImg = "";
  const formRef = useRef();
  const action = props.action;
  const [initUser, setInitUser] = useState(props.user);
  const [user, setUser] = useState(props.user);
  const [mode, setMode] = useState(action === "signup" ? "edit" : "view");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isFormValid, setFormValidation] = useState(
    action === "signup" ? false : true
  );
  const [isSubmitting, setSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showTermsEula, setShowTermsEula] = useState(false);
  
  const deleteHeader = "Are you sure you want to remove yourself?";
  const deleteMessage = `Are you sure you want to remove yourself from Kaizen? You will be removed from all buildings and accounts 
    and will no longer be able to access Kaizen.`;

  const { t } = useTranslation();

  function imageUploadHandler(avatar) {
    setUser({
      ...user,
      avatar: avatar,
    });
  }

  function imageUploadErrorHandler() {
    setUser({
      ...user,
      avatar: initUser.avatar,
    });
  }

  function clearImageHandler() {
    setUser({
      ...user,
      avatar: null,
    });
  }

  async function changeHandler(event) {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });

    await formRef.current._validators[name](value);
    const isValid = !Object.keys(formRef.current.state.invalidInputs).length;
    setFormValidation(isValid);
  }

  function changeLanguage(event) {
    const lang = event.target.value;
    setUser({
      ...user,
      language: lang,
    });
    //set language as i18n
    i18n.changeLanguage(lang);
    localStorage.setItem("I18N_LANGUAGE", lang);
  }

  function requestEdit() {
    setMode("edit");
  }

  function requestDelete() {
    // setModalShow(true);
  }

  function save(e) {
    e.preventDefault();
    setMode("view");

    setSubmitting(true);
    props.onSave(user);
  }

  function cancelEdit() {
    setUser(initUser);
    setMode("view");
  }

  function requestDelete() {
    setDeleteConfirmation(true);
  }

  function deleteUser() {
    if (props.onDelete) {
      setSubmitting(true);
      props.onDelete(user);
    }
    setDeleteConfirmation(false);
  }

  function cancelDelete() {
    setDeleteConfirmation(false);
  }

  function hideTermsAndConditions() {
    setShowTerms(false);
  }

  function hideTermsAndConditionsEula() {
    setShowTermsEula(false);
  }
  useEffect(() => {
    setSubmitting(false);
    if (props.config.succeeded) {
      setInitUser(user);
    }
  }, [props.config]);

  const moduleTitle =
    action === "signup" ? t("Signup") : t("Manage My Profile");
  const moduleDescription =
    action === "signup"
      ? t("Complete registration to continue")
      : t("View, edit or delete my profile");

  return (
    <div className="">
      <MetaTags>
        <title>{moduleTitle}</title>
      </MetaTags>
      <Container>
        <Card>
          <div className="bg-primary bg-soft">
            <Row>
              <Col xs="3">
                <div className="text-primary p-3">
                  <h5 className="text-primary">{moduleTitle}</h5>
                  <p>{moduleDescription}</p>
                </div>
              </Col>
              <Col xs="6">
                <ResponseAlert
                  config={props.config}
                  successMessage={props.config.successMessage}
                />
              </Col>
              <Col xs="3" className="align-self-end">
                <img src={profileImg} alt="" className="img-fluid" />
              </Col>
            </Row>
          </div>

          <CardBody>
            <AvForm ref={formRef}>
              <div className="row mb-1">
                <Col sm={9}>
                  <DragnDropImageManager
                    mode={mode}
                    avatar={user.avatar}
                    defaultImage={UserAvatar}
                    onUpload={imageUploadHandler}
                    onClear={clearImageHandler}
                    onError={imageUploadErrorHandler}
                    style={{ roundedImage: true }}
                    imageClass="img-thumbnail rounded-circle"
                  />
                </Col>

                <Col sm={3}>
                  {action !== "signup" && (
                    <ButtonGroup className="commands">
                      {isSubmitting && (
                        <Spinner className="mr-2" color="dark" size="md" />
                      )}
                      {mode === "view" && (
                        <>
                          <Button
                            title={t("Edit")}
                            onClick={requestEdit}
                            disabled={isSubmitting}
                          >
                            <FontAwesomeIcon icon={faEdit} /> Edit
                          </Button>
                          <Button
                            title={t("Delete")}
                            color="danger"
                            onClick={requestDelete}
                            disabled={isSubmitting}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} /> Delete{" "}
                          </Button>
                        </>
                      )}
                      {mode === "edit" && (
                        <>
                          <Button
                            title={t("Save")}
                            onClick={save}
                            color="primary"
                            disabled={!isFormValid || isSubmitting}
                          >
                            <FontAwesomeIcon icon={faSave} /> Save{" "}
                          </Button>

                          <Button title={t("Cancel")} onClick={cancelEdit}>
                            <FontAwesomeIcon icon={faWindowClose} /> Reset
                          </Button>
                        </>
                      )}
                    </ButtonGroup>
                  )}
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="email" className="col-sm-3 col-form-label">
                  {t("Email")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="email"
                    name="email"
                    id="email"
                    className="custom-field"
                    value={user.email}
                    disabled={true}
                    placeholder="example@example.com"
                    onChange={changeHandler}
                    errorMessage={t("Invalid Email")}
                    validate={{
                      required: { value: true },
                      email: { value: true },
                    }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="first_name" className="col-sm-3 col-form-label">
                  {t("First Name")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="first_name"
                    id="first_name"
                    className="custom-field"
                    value={user.first_name}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Enter First Name")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="last_name" className="col-sm-3 col-form-label">
                  {t("Last Name")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="last_name"
                    id="last_name"
                    className="custom-field"
                    value={user.last_name}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Enter Last Name")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label
                  htmlFor="organization"
                  className="col-sm-3 col-form-label"
                >
                  {t("Organization")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="organization"
                    id="organization"
                    className="custom-field"
                    value={user.organization}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Enter Organization")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="phone" className="col-sm-3 col-form-label">
                  {t("Phone Number")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="phone_number"
                    id="phone"
                    className="custom-field"
                    value={user.phone_number}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    placeholder="1 (555) 555-5555"
                    errorMessage={t("Invalid Phone Number")}
                    validate={{ tel: true }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="phone" className="col-sm-3 col-form-label">
                  {t("Location")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="location"
                    id="location"
                    className="custom-field"
                    value={user.location}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    placeholder="Enter your location"
                    errorMessage={t("Invalid Location")}
                    validate={{ required: true }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="country" className="col-sm-3 col-form-label">
                  {t("Country")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="select"
                    name="country"
                    id="country"
                    className="custom-select"
                    value={user.country}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Invalid Country")}
                    validate={{ required: { value: true } }}
                  >
                    <option hidden> -- select an option -- </option>
                    {Countries.map((element) => {
                      return (
                        <option key={element.id} value={element.id}>
                          {element.name}
                        </option>
                      );
                    })}
                  </AvField>
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="language" className="col-sm-3 col-form-label">
                  {t("Preferred Language")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="select"
                    name="language"
                    id="language"
                    className="custom-select"
                    value={user.language}
                    disabled={mode === "view"}
                    onChange={changeLanguage}
                    errorMessage={t("Please Select Language")}
                    validate={{ required: { value: true } }}
                  >
                    <option hidden> -- select an option -- </option>
                    {Object.keys(languages).map((key) => (
                      <option
                        key={key}
                        value={key}
                        style={{
                          backgroundImage: `url(${languages[key].flag})`,
                        }}
                      >
                        {languages[key].label}
                      </option>
                    ))}
                  </AvField>
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="timezone" className="col-sm-3 col-form-label">
                  {t("Time Zone")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="select"
                    name="time_zone"
                    id="timezone"
                    className="custom-select"
                    value={user.time_zone}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Time Zone is required")}
                    validate={{ required: { value: true } }}
                  >
                    <option hidden> -- select an option -- </option>
                    {TimeZones.map((element) => {
                      return (
                        <option key={element.id} value={element.id}>
                          {element.name}
                        </option>
                      );
                    })}
                  </AvField>
                </Col>
              </div>
              <div className="row mb-1">
                <Label
                  htmlFor="statusnotification"
                  className="col-sm-3 col-form-label"
                >
                  {t("Status Notification")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="text"
                    name="status_notification"
                    id="statusnotification"
                    className="custom-field"
                    value={user.status_notification}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Enter Status Notification")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </div>
              <div className="row mb-1">
                <Label htmlFor="clearafter" className="col-sm-3 col-form-label">
                  {t("Clear Status After")}
                </Label>
                <Col sm={9} className="userprofile-field">
                  <AvField
                    type="date"
                    name="clear_after"
                    id="clearafter"
                    className="calendar-field custom-field"
                    value={user.clear_after}
                    disabled={mode === "view"}
                    onChange={changeHandler}
                    errorMessage={t("Enter Clear After Duration")}
                    validate={{ required: { value: true } }}
                  />
                </Col>
              </div>

              <div className="row justify-content-end">
                <Col sm={9}>
                  {mode === "edit" && (
                    <Button
                      color="danger"
                      onClick={() => {
                        restPassword("/admin/login?restpass");
                      }}
                    >
                      {t("Reset Password")}
                    </Button>
                  )}
                </Col>
              </div>

              {action === "signup" && (
                <>
                  <Row className="mt-3 ml-1">
                    <AvGroup check className="ml-0">
                      <AvInput
                        type="checkbox"
                        name="termsAndConditions"
                        className="mt-1"
                        validate={{ required: { value: true } }}
                        onChange={changeHandler}
                      />
                      <Label check htmlFor="termsAndConditions" className="">
                        {t("By Clicking Signup I agree to")}
                      </Label>
                      <a
                        className="link-primary"
                        onClick={() => setShowTerms(true)}
                      >
                        {" "}
                        {t("Terms and Conditions")}
                      </a>
                    </AvGroup>
                  </Row>

                  <Row className="mt-3 ml-1">
                    <AvGroup check className="ml-0">
                      <AvInput
                        type="checkbox"
                        name="termsAndConditionsEula"
                        className="mt-1"
                        validate={{ required: { value: true } }}
                        onChange={changeHandler}
                      />
                      <Label check htmlFor="termsAndConditionsEula" className="">
                        {t("By Clicking Signup I agree to")}
                      </Label>
                      <a
                        className="link-primary"
                        onClick={() => setShowTermsEula(true)}
                      >
                        {" "}
                        {t("End User License Agreement")}
                      </a>
                    </AvGroup>
                  </Row>

                  <Row className="mt-4 mx-1">
                    <Button
                      className="w-100"
                      color="primary"
                      style={{ height: "40px" }}
                      disabled={!isFormValid || isSubmitting}
                      onClick={save}
                    >
                      {isSubmitting ? (
                        <Spinner className="ml-2" size="sm" />
                      ) : (
                        <FontAwesomeIcon icon={faSave} size="lg" />
                      )}
                      <span className="ml-2">{t("Signup")}</span>
                    </Button>
                    <br />
                    <br />
                    <br />
                  </Row>
                </>
              )}
            </AvForm>
          </CardBody>
        </Card>

        <ModalAcceptReject
          show={deleteConfirmation}
          title={t("Warning")}
          header={t(deleteHeader)}
          message={t(deleteMessage)}
          onAccept={deleteUser}
          onReject={cancelDelete}
        ></ModalAcceptReject>

        <ModalTermsAndConditions
          show={showTerms}
          onAccept={hideTermsAndConditions}
          title={t("Terms and Conditions")}
        />

        <ModalTermsAndConditionsEula
          show={showTermsEula}
          onAccept={hideTermsAndConditionsEula}
          title={t("End User License Agreement")}
        />
        
      </Container>
    </div>
  );
}
