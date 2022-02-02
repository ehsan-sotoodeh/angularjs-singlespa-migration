import React, { useState, useEffect, useRef } from "react";
import { Route, useParams } from "react-router-dom";

import {
  Modal,
  Row,
  Col,
  Card,
  CardBody,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Label,
  Button,
  Spinner,
} from "reactstrap";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput,
  AvRadioGroup,
  AvRadio,
} from "availity-reactstrap-validation";
import * as _ from "lodash";

import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { getCurrentUser } from "../../../services/userService";
import { getAccounts } from "../../../services/accountService";

export default function BulkManageBuildingWizard({
  showModal,
  setShowModal,
  buildings,
  handleDeleteBuildings,
  HandleMoveBuildings,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [state, setState] = useState({});
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUsers, setCurrentUser] = useState([])

  const formRef0 = useRef();
  const formRef1 = useRef();

  const { t } = useTranslation();

  const currentAccountId = window.location.pathname.replace(
    "/admin/account/",
    ""
  );

  useEffect(async () => {
    //TODO: review below code with Ehsan:
    if (state.action === "move") setLoading(true);
    const response = await getAccounts();
    const currentUser = await getCurrentUser();
    setCurrentUser(currentUser);
    setAccounts(response.data);
    setLoading(false);

    if (!response.succeeded) {
      console.log(response.error);
    }
  }, [activeTab]);

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 0 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  };
  const changeHandler = async (event, formRef) => {
    const { name, value } = event.target;
    await formRef.current._validators[name](value);
    setState({ ...state, [name]: value });
  };

  const reset = () => {
    setShowModal(false);
    setState({});
    setActiveTab(0);
    setAccounts([]);
  };

  const lostPermissions = buildings.map(b => b.permissions).flat();
  const lostPermissionsUsers = new Set(lostPermissions.map(perm => perm.user._id));


  return (
    <Modal
      isOpen={showModal}
      toggle={() => {
        setShowModal(!showModal);
      }}
      size="lg"
    >
      <div className="modal-header d-flex justify-content-between w-100">
        <div className="modal-title h5 d-flex justify-content-between w-100">
          <span>{t("Manage Buildings")}</span>
          <span className="p-2">
            <FontAwesomeIcon
              style={{ cursor: "pointer" }}
              icon={faTimes}
              onClick={() => {
                setShowModal(false);
              }}
            />
          </span>
        </div>
      </div>
      <div className="modal-body">
        <Row>
          <Col lg="12">
            <Card>
              <CardBody className="my-0 py-0">
                <div className="wizard clearfix">
                  <div className="">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={0}>
                        <AvForm ref={formRef0}>
                          <Row>
                            <Col className="d-flex justify-content-center">
                              <h5>
                                {t(
                                  `You are about to make changes to (X) buildings`,
                                  { number: buildings.length }
                                )}
                                <RequiredField />
                              </h5>
                            </Col>
                          </Row>
                          <Row className="my-3">
                            <Col md={3}></Col>
                            <Col md={6}>
                              <AvRadioGroup
                                name="action"
                                className=""
                                required
                                errorMessage={t("Pick one!")}
                                onChange={(e) => changeHandler(e, formRef0)}
                              >
                                <AvRadio
                                  label={t("Delete Building")}
                                  value="delete"
                                />
                                <br />
                                <AvRadio
                                  label={t("Move Building to another Account")}
                                  value="move"
                                />
                                <br />
                              </AvRadioGroup>
                            </Col>
                            <Col md={3}></Col>
                          </Row>
                          <Row>
                            <WizardControl
                              formRef={formRef0}
                              toggleTab={toggleTab}
                              activeTab={activeTab}
                              finishFn={() => {}}
                            />
                          </Row>
                        </AvForm>
                      </TabPane>
                      {state.action === "delete" && (
                        <>
                          <TabPane tabId={1}>
                            <Row>
                              <Col className="d-flex justify-content-center">
                                <div className="mx-auto">
                                  <h5>
                                    {t(
                                      "You're about to delete the following buildings"
                                    )}
                                    :
                                  </h5>
                                  <h6>
                                    <ol >
                                      {buildings.map((b) => (
                                        <li className="my-2" key={b.name}>{b.name}</li>
                                      ))}
                                    </ol>
                                  </h6>
                                </div>
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col md={3}></Col>
                              <Col md={6}>
                                <h6>
                                  {t(
                                    "Please enter your email address to continue"
                                  )}
                                  :
                                </h6>
                                <AvForm ref={formRef1} inline className="mt-2">
                                  <Label for="email">
                                    {t("Email")}:
                                    <RequiredField />
                                  </Label>
                                  <AvField
                                    type="email"
                                    data-testid='emailField'
                                    className="form-control ml-3"
                                    id="email"
                                    name="email"
                                    value={state.email}
                                    onChange={(e) => changeHandler(e, formRef1)}
                                    errorMessage={t("Invalid Email")}
                                    validate={{
                                      required: { value: true },
                                    }}
                                  />
                                </AvForm>
                              </Col>
                              <Col md={3}></Col>
                            </Row>
                            <Row>
                              <WizardControl
                                formRef={formRef1}
                                toggleTab={toggleTab}
                                activeTab={activeTab}
                                finishCB={null}
                              />
                            </Row>
                          </TabPane>

                          <TabPane tabId={2}>
                            <Row className="pb-4">
                              <Col className="d-flex justify-content-center">
                                <div className="mx-auto">
                                  <h5 className="pb-3">{t("Are you sure")}?</h5>
                                  <h6>
                                    <ol>
                                      <li className="my-3">
                                        {t(
                                          "X permissions to Y users will be lost" , {X : lostPermissions.length, Y:lostPermissionsUsers.size}
                                        )}
                                      </li>
                                      <li className="my-3">
                                        (x) {t("Portfolios will be affected")}
                                      </li>
                                    </ol>
                                  </h6>
                                  <p className="">
                                    {" "}
                                    {t(
                                      "Note: Users will be notified by email of this change."
                                    )}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <WizardControl
                                formRef={formRef1}
                                toggleTab={toggleTab}
                                activeTab={activeTab}
                                finishCB={() => handleDeleteBuildings(reset)}
                              />
                            </Row>
                          </TabPane>
                        </>
                      )}
                      {state.action === "move" && (
                        <>
                          <TabPane tabId={1}>
                            <Row>
                              <Col className="d-flex justify-content-center">
                                <div className="mx-auto">
                                  <h5>{t("Select destination Account")}</h5>
                                  <h6>
                                    {t(
                                      "Note: You must be an Admin User in the destination Account"
                                    )}
                                  </h6>
                                  {loading && (
                                    <div className="mt-3">
                                      <center>
                                        <Spinner size="sm" className="" />
                                        <span className="ml-2 font-size-14">
                                          {t("Loading Accounts")}...
                                        </span>
                                      </center>
                                    </div>
                                  )}
                                  {!loading && (
                                    <AvForm ref={formRef1} className="mt-4">
                                      <AvField
                                        type="select"
                                        id="destinationAccount"
                                        name="destinationAccount"
                                        onChange={(e) =>
                                          changeHandler(e, formRef1)
                                        }
                                        value={state.destinationAccount}
                                        errorMessage={t(
                                          "Must select an Account"
                                        )}
                                        validate={{
                                          required: { value: true },
                                        }}
                                      >
                                        <option hidden key="defaultOption">
                                          -- {t("select an option")} --
                                        </option>
                                        {accounts
                                          .filter(
                                            (a) => a._id !== currentAccountId &&
                                            a.permissions.find(x => x.role.name === 'admin' && x.user === currentUsers._id)
                                          )
                                          .map((account) => {
                                            return (
                                              <option
                                                key={account._id}
                                                value={account._id}
                                              >
                                                {  account.name }
                                              </option>
                                            );
                                          })}
                                      </AvField>
                                    </AvForm>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row className="my-3">
                              <Col></Col>
                              <Col>
                                <center></center>
                              </Col>
                              <Col></Col>
                            </Row>
                            <Row>
                              <WizardControl
                                formRef={formRef1}
                                toggleTab={toggleTab}
                                activeTab={activeTab}
                                finishCB={() =>
                                  HandleMoveBuildings(
                                    state.destinationAccount,
                                    reset
                                  )
                                }
                              />
                            </Row>
                          </TabPane>
                        </>
                      )}
                    </TabContent>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </Modal>
  );
}

const WizardControl = ({ formRef, toggleTab, activeTab, finishCB }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const isNextDisabled = formRef?.current?.state?.invalidInputs
    ? !!Object.keys(formRef?.current?.state?.invalidInputs).length
    : true;

  return (
    <div className="actions clearfix ml-2">
      <Button
        onClick={() => toggleTab(activeTab - 1)}
        disabled={activeTab === 0 || isSubmitted}
        color="primary"
      >
        {t("Previous")}
      </Button>
      {!finishCB && (
        <Button
          className="mx-2"
          color="primary"
          onClick={() => {
            toggleTab(activeTab + 1);
          }}
          disabled={isNextDisabled}
        >
          {t("Next")}
        </Button>
      )}
      {finishCB && (
        <Button
          className="mx-2"
          color="primary"
          onClick={() => {
            finishCB();
            setIsSubmitted(true);
          }}
          disabled={isSubmitted || isNextDisabled}
        >
          {isSubmitted && <Spinner color="light" size="sm" className="mr-2" />}
          {t("OK")}
        </Button>
      )}
    </div>
  );
};

const RequiredField = () => {
  return <span className="text-danger">*</span>;
};
