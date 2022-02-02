import React, { useState, useEffect, useRef } from "react";
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
import { AvForm, AvField } from "availity-reactstrap-validation";
import * as _ from "lodash";
import { ReactBingmaps } from "react-bingmaps";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import AsyncSelect from "react-select/async";
import CreatableSelect from "react-select/creatable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import TagInput from "../TagInput/TagInput";
import { Countries, TimeZones, CountriesAndStates } from "../../assets/Globals";
import { getUsers } from "../../services/userService";
import WhyTooltip from "../WhyTooltip";
import RequiredField from "../RequiredField";

import {
  getLocationFromAddress,
  suggestAddressByQuery,
} from "../../helpers/utils";
//TODO add bingmap api to env file
const BING_MAP_KEY =
  "Apk2wwOfyW26tQC-4Ca-5vOyCySWHNfMJj1wTkhx-xEyvXdY0SrW_RfEJettZxzh";
//TODO fetch this from server


let contactPeople = [];


//TODO fetch this from server
const buildingTypes = ["Library","Hotel","Barracks","Parking","Post-office","Police Station","Fire Station","Courthouse","Bank Branch","Financial Office","College/University","K-12 School","Pre-school/Daycare","Vocational School","Other – Education","Aquarium","Casino","Convention Center","Fitness Center/Health Club/Gym","Ice/Curling Rink","Indoor Arena","Movie Theater","Museum","Performing Arts","Social/Meeting Hall","Stadium (Closed)","Stadium (Open)","Swimming Pool","Zoo",
                       "Other – Entertainment/Public Assembly","Other – Recreation","Other – Stadium", "Convenience Store with Gas Station","Convenience Store without Gas Station","Fast Food Restaurant","Restaurant","Supermarket/Grocery Store","Other – Restaurant/Bar","Medical Office","Outpatient Rehabilitation/Physical Therapy","Residential Care Facility","Senior Living Community","Urgent Care/Clinic/Other Outpatient","Other – Specialty Hospital","Barracks","Hotel","Multifamily Housing","Prison/Incarceration","Residence Hall/Dormitory","Senior Living Community"];

const floors = [... Array(100).keys()].map(x => ++x)


// const emptyBuildingObject = {
//   name: "",
//   type: "",
//   geo_location: [],
//   address: {
//     country: "",
//     province_state: "",
//     city: "",
//     address_line1: "",
//     address_line2: "",
//     //street: "",
//     //street_address: "",
//     postal_code: "",
//     formatted: "",
//   },
//   maintenance_contact: "",
//   time_zone: "",
//   currency: "",
//   units: "",
//   area: 0,
//   building_area_unit: "",
// }

export default function AddBuildingWizard({
  showModal,
  setShowModal,
  handleAddBuilding,
  inputBuilding,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const formRef0 = useRef();
  const formRef1 = useRef();
  const formRef2 = useRef();
  const formRef3 = useRef();
  const { t } = useTranslation();


  const [building, setBuilding] = useState({ ...inputBuilding });
  const [contactList, setContactList] = useState([]);

  const [pinLocation, setPinLocation] = useState([]);
  const [address, setAddress] = useState("");
  const status = !inputBuilding ? "addNew" : "update";

  useEffect(() => {
    const fetchLocation = async () => {
      if (activeTab === 1) {
        const address = getAddressString(building?.address);
        const result = await getLocationFromAddress(address);
        setPinLocation(result.location);
        setAddress(result.address);
      }
      if (activeTab === 0) {
        const response = await getUsers();
        //contactPeople = contacts;
        const contactData = response.data;
        //const {email, _id} = contactData
        const filteredData = contactData.map(({_id,email})=>({_id,email}));
        contactPeople = filteredData
      }
    };
    fetchLocation();
    

  }, [activeTab]);

  
  
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      if (tab >= 0 && tab <= 4) {
        setActiveTab(tab);
      }
    }
  };

  
  const changeHandler = (event) => {
 //   const response = getUserEmails();
 //   contactPeople = response.data;
 //   console.log('contactPeople', contactPeople);
    const { name, value } = event.target;
    setBuildingValue(name, value);
    console.log(event);
  };

  const setBuildingValue = (name, value) => {
    var newObj = _.cloneDeep(building);
    _.set(newObj, name, value);
    if (name === "units") {
      const unit = value === "metric" ? "square meter" : "square feet";
      _.set(newObj, "building_area_unit", unit);
    }
    setBuilding(newObj);
  };

  const addBuilding = () => {
    building.geo_location = [...pinLocation];
    setTimeout(() => {
      setShowModal(false);
      handleAddBuilding(building);
      setBuilding({});
      setActiveTab(0);
      setPinLocation([]);
      setAddress("");
    }, 2000);
  };

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
          <span data-testid="title">{t("Add Building")}</span>
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
                  <div className="steps clearfix">
                    <ul>
                      <NavItem
                        className={classnames({ current: activeTab === 0 })}
                      >
                        <NavLink
                          className={classnames({ current: activeTab === 0 })}
                          // onClick={() => {
                          //   setActiveTab(0);
                          // }}
                        >
                          <span className="number">1.</span>
                          <span className="ml-2" data-testid='general'>{t("General")}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        className={classnames({ current: activeTab === 1 })}
                      >
                        <NavLink
                          className={classnames({ active: activeTab === 1 })}
                          // onClick={() => {
                          //   setActiveTab(1);
                          // }}
                        >
                          <span className="number ms-2">2.</span>
                          <span className="ml-2">{t("Address")}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        className={classnames({ current: activeTab === 2 })}
                      >
                        <NavLink
                          className={classnames({ active: activeTab === 2 })}
                          // onClick={() => {
                          //   setActiveTab(2);
                          // }}
                        >
                          <span className="number">3.</span>
                          <span className="ml-2">{t("Metrics")}</span>
                        </NavLink>
                      </NavItem>
                      <NavItem
                        className={classnames({ current: activeTab === 3 })}
                      >
                        <NavLink
                          className={classnames({ active: activeTab === 3 })}
                          // onClick={() => {
                          //   setActiveTab(3);
                          // }}
                        >
                          <span className="number">4.</span>
                          <span className="ml-2">{t("Map")}</span>
                        </NavLink>
                      </NavItem>
                    </ul>
                  </div>
                  <div className="content clearfix mt-4">
                    <TabContent activeTab={activeTab}>
                      <TabPane tabId={0}>
                        <AvForm ref={formRef0}>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="name">
                                  {t("Building Name")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  name="name"
                                  value={building.name}
                                  onChange={(e) => changeHandler(e)}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                />
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="time_zone">
                                  {t("Timezone")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="select"
                                  id="address.time_zone"
                                  name="address.time_zone"
                                  onChange={changeHandler}
                                  value={building?.address?.time_zone}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  {TimeZones.map((element) => {
                                    return (
                                      <option
                                        key={element.id}
                                        value={element.id}
                                      >
                                        {element.name}
                                      </option>
                                    );
                                  })}
                                </AvField>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="units">
                                  {t("Units")}: <RequiredField />
                                </Label>
                                <WhyTooltip tooltipId="units">
                                  postal_codeLorem ipsum dolor sit amet
                                  consectetur adipisicing elit. Maxime mollitia,
                                  molestiae quas vel sint commodi
                                </WhyTooltip>
                                <AvField
                                  type="select"
                                  id="units"
                                  name="units"
                                  onChange={changeHandler}
                                  value={building.units}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  <option value="metric">{t("Metric")}</option>
                                  <option value="imperial">
                                    {t("Imperial")}
                                  </option>
                                </AvField>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="currency">
                                  {t("Currency")}: <RequiredField />
                                </Label>
                                <WhyTooltip tooltipId="currency">
                                  postal_codeLorem ipsum dolor sit amet
                                  consectetur adipisicing elit. Maxime mollitia,
                                  molestiae quas vel sint commodi
                                </WhyTooltip>
                                <AvField
                                  type="select"
                                  id="currency"
                                  name="currency"
                                  onChange={changeHandler}
                                  value={building.currency}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  <option value="cad$">{t("CAD")}</option>
                                  <option value="usd$">{t("USD")}</option>
                                </AvField>
                              </div>
                            </Col>
                          </Row>

                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="area">
                                  {t("Building's Tags")}:
                                </Label>

                                <div>
                                  <TagInput
                                    tags={building?.tags || []}
                                    setTags={(tags) => {
                                      setBuildingValue("tags", tags);
                                    }}
                                  />
                                  <p
                                    className="font-size-11 my-1 pl-1 alert-warning"
                                    role="alert"
                                  >
                                    {t(
                                      "Only lowercase letters, numbers and _ are valid!"
                                    )}
                                  </p>
                                </div>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="maintenance_contact">
                                  {t("Contact Person")}: <RequiredField />
                                </Label>
                                <ContactPersonComponent
                                  id="maintenance_contact"
                                  setBuildingValue={setBuildingValue}
                                  building={building}
                                  
                                />

                                <AvField
                                  className="d-none my-0 py-0"
                                  type="text"
                                  id="maintenance_contact"
                                  name="maintenance_contact"
                                  style={{ display: "none" }}
                                  value={contactPeople}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6"></Col>
                            <Col lg="6"></Col>
                          </Row>
                          <Row>
                            <WizardControl
                              fromRef={formRef0}
                              toggleTab={toggleTab}
                              activeTab={activeTab}
                              addBuilding={addBuilding}
                              status={status}
                            />
                          </Row>
                        </AvForm>
                      </TabPane>

                      <TabPane tabId={1}>
                        <AvForm ref={formRef1}>
                          <Row>
                            <Col>
                              <p className="alert alert-warning" role="alert">
                                {t(
                                  "Please Enter your address as precisely as possible. It will help us find the closest weather station near you and provide you with more accurate analytics."
                                )}
                              </p>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.address_line1">
                                  {t("Address Line")} 1: <RequiredField />
                                </Label>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="address.address_line1"
                                  name="address.street"
                                  onChange={changeHandler}
                                  value={building?.address?.street}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                />
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.address_line2">
                                  {t("Address Line")} 2:
                                </Label>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="address.address_line2"
                                  name="address.street_address"
                                  onChange={changeHandler}
                                  value={building?.address?.street_address}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: false },
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.country">
                                  {t("Country")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="select"
                                  id="address.country"
                                  name="address.country"
                                  onChange={changeHandler}
                                  value={building?.address?.country}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  {Countries.map((element) => {
                                    return (
                                      <option
                                        key={element.id}
                                        value={element.id}
                                      >
                                        {element.name}
                                      </option>
                                    );
                                  })}
                                </AvField>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.province_state">
                                  {t("Province")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="select"
                                  className="form-control"
                                  id="address.province_state"
                                  name="address.province_state"
                                  onChange={changeHandler}
                                  value={building?.address?.province_state}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  {CountriesAndStates[
                                    building?.address?.country
                                  ]?.map((element) => {
                                    return (
                                      <option
                                        key={element.abbreviation}
                                        value={element.abbreviation}
                                      >
                                        {element.name}
                                      </option>
                                    );
                                  })}
                                </AvField>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.city">
                                  {t("City")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="address.city"
                                  name="address.city"
                                  onChange={changeHandler}
                                  value={building?.address?.city}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                />
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="address.postal_code">
                                  {t("Postal Code")}: <RequiredField />
                                </Label>
                                <WhyTooltip tooltipId="postal_code">
                                  postal_codeLorem ipsum dolor sit amet
                                  consectetur adipisicing elit. Maxime mollitia,
                                  molestiae quas vel sint commodi
                                </WhyTooltip>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="address.postal_code"
                                  name="address.postal_code"
                                  onChange={changeHandler}
                                  value={building?.address?.postal_code}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <WizardControl
                              fromRef={formRef1}
                              toggleTab={toggleTab}
                              activeTab={activeTab}
                              addBuilding={addBuilding}
                              status={status}
                            />
                          </Row>
                        </AvForm>
                      </TabPane>

                      <TabPane tabId={2}>
                        <AvForm ref={formRef2}>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="building_type">
                                  {t("Building Type")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="select"
                                  id="building_type"
                                  name="building_type"
                                  onChange={changeHandler}
                                  value={building.building_type}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                  }}
                                >
                                  <option hidden>
                                    -- {t("select an option")} --
                                  </option>
                                  {buildingTypes.map((element) => {
                                    return (
                                      <option key={element} value={element}>
                                        {element}
                                      </option>
                                    );
                                  })}
                                </AvField>
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="area">
                                  {t("Building Total Area")}: <RequiredField />
                                </Label>
                                <div>
                                  <AvField
                                    type="number"
                                    className="form-control"
                                    id="area"
                                    name="area"
                                    onChange={changeHandler}
                                    value={building.area}
                                    errorMessage={t("Can't be empty")}
                                    validate={{
                                      required: { value: true },
                                    }}
                                  />
                                  <span
                                    style={{
                                      position: "absolute",
                                      top: "35px",
                                      right: "45px",
                                    }}
                                    className="font-weight-bold"
                                  >
                                    {building.units === "metric" ? "m" : "ft"}
                                    <sup>2</sup>
                                  </span>
                                </div>
                              </div>
                            </Col>
                          </Row>
                  
                          <Row>
                          <Col lg="6">
                              <div className="mb-3">
                                <Label for="Floors">
                                  {t("Floors")}: <RequiredField />
                                </Label>
                                <AvField
                                  type="text"
                                  className="form-control"
                                  id="floors"
                                  name="floors"
                                  value={building.floors}
                                  onChange={(e) => changeHandler(e)}
                                  errorMessage={t("Can't be empty")}
                                  validate={{
                                    required: { value: true },
                                    min: {value: 1, errorMessage: 'Floors should be greater than 0'}
                                  }}
                                />
                              </div>
                            </Col>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label for="year">
                                  {t("Built Year")}: <RequiredField />
                                </Label>
                                <div>
                                  <AvField
                                    type="number"
                                    className="form-control"
                                    id="year"
                                    name="year"
                                    onChange={changeHandler}
                                    value={building.year}
                                    errorMessage={t("Can't be empty")}
                                    validate={{
                                      required: { value: true },
                                      min: {value: 0, errorMessage: 'Year should not be negative '}
                                    }}
                                  />
                              
                                </div>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <WizardControl
                              fromRef={formRef2}
                              toggleTab={toggleTab}
                              activeTab={activeTab}
                              addBuilding={addBuilding}
                              status={status}
                            />
                          </Row>
                        </AvForm>
                      </TabPane>

                      <TabPane tabId={3}>
                        <AvForm ref={formRef3}>
                          <Row style={{ height: "250px" }}>
                            <Col md={8}>
                              <Label>{t("Address")}:</Label>

                              <BingMapModule
                                address={address}
                                setAddress={setAddress}
                                pinLocation={pinLocation}
                                setPinLocation={setPinLocation}
                              />
                            </Col>
                            <Col md={4}>
                              <div className="d-flex justify-content-center">
                                <div className="">
                                  <Label for="name">{t("Latitude")}:</Label>
                                  <AvField
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={pinLocation[0]}
                                    errorMessage={t("Can't be empty")}
                                    validate={{
                                      required: { value: true },
                                    }}
                                    disabled
                                  />
                                </div>
                                <div className="ml-1">
                                  <Label for="name">{t("Longitude")}:</Label>
                                  <AvField
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="geo_location"
                                    value={pinLocation[1]}
                                    disabled
                                    errorMessage={t("Can't be empty")}
                                    validate={{
                                      required: { value: true },
                                    }}
                                  />
                                </div>
                              </div>
                              <p className="mt-3 text-justify">
                                {t(`
                              We have determined the location of your building
                              from your address. If it is not correct, you can
                              select your building location on the map or
                              enter the geo-coordinates. This will be used to
                              gather weather data for your building.
                              `)}
                              </p>
                            </Col>
                          </Row>
                          <Row style={{ marginTop: "100px" }}>
                            <Col>
                              <WizardControl
                                className=""
                                fromRef={formRef3}
                                toggleTab={toggleTab}
                                activeTab={activeTab}
                                addBuilding={addBuilding}
                                status={status}
                              />
                            </Col>
                          </Row>
                        </AvForm>
                      </TabPane>
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

const ContactPersonComponent = ({ setBuildingValue, building}) => {
  const [hasError, setHasError] = useState(false);



  const handleChange = (event) => {
    if (event.value) {
      let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (event.value.match(regexEmail)) {
        setHasError(false);
        setBuildingValue("maintenance_contact", event.value);
      } else {
        setHasError(true);
      }
    }
  };
  const handleInputChange = (event, action) => {
    console.log('main Contact', building);


    if (action === "set-value") {
      setBuildingValue("maintenance_contact", event.value);
    }
  };

  const options = contactPeople.map((p) => {
    return {
      value: p.email,
      label: p.email,
    };
  });

  return (
    <>
      <CreatableSelect
        isClearable
        defaultValue={{
          value: building.maintenance_contact,
          label: building.maintenance_contact,
        }}
        onChange={(e) => handleChange(e)}
        className={hasError ? "redBorder" : ""}
        onInputChange={(e, a) => handleInputChange(e, a)}
        options={options}
        validate={{
          required: { value: true },
        }}
      />
      {hasError && <small className="text-danger">{t("Invalid Email")}</small>}
    </>
  );
};

const WizardControl = ({
  fromRef,
  toggleTab,
  activeTab,
  addBuilding,
  status,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const isNextDisabled = fromRef?.current?.state?.invalidInputs
    ? !!Object.keys(fromRef?.current?.state?.invalidInputs).length
    : true;

  return (
    <div className="actions clearfix ml-auto">
      <Button
        onClick={() => toggleTab(activeTab - 1)}
        disabled={activeTab === 0 || isSubmitted}
        color="primary"
      >
        {t("Previous")}
      </Button>
      {activeTab < 3 && (
        <Button
          className="mx-2"
          color="primary"
          onClick={() => {
            toggleTab(activeTab + 1);
          }}
          disabled={false}
        >
          {t("Next")}
        </Button>
      )}
      {activeTab === 3 && (
        <Button
          className="mx-2"
          color="primary"
          onClick={() => {
            addBuilding();
            setIsSubmitted(true);
          }}
          disabled={isSubmitted}
        >
          {isSubmitted && <Spinner color="light" size="sm" className="mr-2" />}
          {status === "addNew" ? t("Add Building") : t("Update Building")}
        </Button>
      )}
    </div>
  );
};

const BingMapModule = ({
  pinLocation,
  setPinLocation,
  address,
  setAddress,
}) => {
  const [searchInput, setSearchInput] = useState("");

  const loadOptions = async (inputValue, callback) => {
    if (!searchInput.length) {
      return [];
    }
    try {
      const result = await suggestAddressByQuery(searchInput);
      const foundPlaces = result.map((p) => {
        const addressString = convertFromBingAddress(p.address);
        return {
          type: p.__type,
          address: addressString,
          name: p.name || "",
          label: addressString.formatted,
          value: addressString.formatted,
        };
      });
      callback(foundPlaces);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = async (event) => {
    const res = await getLocationFromAddress(event.address.formatted);
    setPinLocation(res.location);
    setAddress(event.address.formatted);
  };

  const handleMapClick = async (event) => {
    setPinLocation([event.latitude, event.longitude]);
  };

  const pin = [
    {
      location: pinLocation,
      option: { color: "red" },
      addHandler: {
        type: "click",
        callback: () => {
          //console.log("handlePinClick");
        },
      },
    },
  ];

  // const boundary = {
  //   //location: pinLocation,
  //   //search: getAddressString(address),
  //   search: address,
  //   option: {
  //     entityType: "PopulatedPlace",
  //   },
  //   polygonStyle: {
  //     fillColor: "rgba(0,0,0,0)",
  //     strokeColor: "rgba(161,224,255,0.4)",
  //     strokeThickness: 0,
  //   },
  // }
  return (
    <>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions
        onChange={(e) => handleSelectChange(e)}
        onInputChange={(e) => setSearchInput(e)}
      />
      <ReactBingmaps
        className="customClass"
        id="addBuildingWizardMap"
        center={pinLocation}
        bingmapKey={BING_MAP_KEY}
        //boundary={boundary}
        pushPins={pin}
        supportedMapTypes={["road", "canvasDark"]}
        getLocation={{ addHandler: "click", callback: handleMapClick }}
      ></ReactBingmaps>
    </>
  );
};

const convertFromBingAddress = (inputAddress) => {
  const outputAddress = {
    country: inputAddress.countryRegion || "",
    province_state: inputAddress.adminDistrict || "",
    city: inputAddress.locality || "",
    address_line1: inputAddress.addressLine || "",
    address_line2: "",
    postal_code: inputAddress.postalCode || "",
  };
  outputAddress.formatted = `${outputAddress.address_line1} ${outputAddress.address_line2} ${outputAddress.city} ${outputAddress.province_state} ${outputAddress.country}`;

  return outputAddress;
};

const getAddressString = ({
  address_line1,
  address_line2,
  city,
  province_state,
  country,
}) => {
  const countryName = Countries.filter((c) => c.id === country)[0]?.name || "";
  return `${address_line1} ${address_line2} ${city} ${province_state} ${countryName}`;
};

