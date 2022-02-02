import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardHeader,
  Badge,
} from "reactstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCog,
  faSave,
  faUndo,
  faArrowsAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { ReactBingmaps } from "react-bingmaps";

import classnames from "classnames";

import {
  getBuildingById,
  updateBuilding,
  createBuilding
} from "../../services/buildingService";
import { DragnDropImageManager } from "../../common/ImageManager";
import BuildingUsersPermissionsWidget from "./BuildingUsersPermissionsWidget/BuildingUsersPermissionsWidget";
import AddBuildingWizard from "../../common/AddBuildingWizard/AddBuildingWizard";
import Contextualization from "./Contextualization";

import Loading from "../../common/Loading";

import defaultImage from "../../assets/images/defaultBuilding-gray.png";

//TODO add bingmap api to env file
const BING_MAP_KEY =
  "Apk2wwOfyW26tQC-4Ca-5vOyCySWHNfMJj1wTkhx-xEyvXdY0SrW_RfEJettZxzh";

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  //padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "#eeeeee",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "#fff",
  //padding: grid,
  width: "%100",
});

//TODO move this to a better place

export default function BuildingPage() {
  const { t } = useTranslation();
  let { buildingId } = useParams();
  const [activeTab, setActiveTab] = useState("1");
  const [initBuilding, setInitBuilding] = useState({});
  const [building, setBuilding] = useState({});

  const [state, setState] = useState({
    column1: [],
    column2: [],
    column3: [],
  });

  const tabNames = {
    1: "Profile",
    2: "Projects",
    3: "Dashboard",
    4: "Discover",
    5: "Reports",
    7: "Contextualization",
    6: "Rules",
  };

  useEffect(async () => {
    const response = await getBuildingById(buildingId);
    // .then((r) => {
    //   return { succeeded: true, data: r };
    // })
    // .catch((e) => {
    //   return { succeeded: false, error: e, data: {} };
    // });
    if (response.success) {
      //fake building address
      // const fetchedBuilding = {
      //   ...response.data,
      //   address: {
      //     address_line1: "13277",
      //     address_line2: " 108 ave",
      //     city: "Surrey",
      //     province_state: "BC",
      //     country: "CA",
      //     postal_code: "V3S5A5",
      //   },
      //   building_total_area : 1100,
      //   maintenance_contact : 'faith_blakely@example.com',
      //   type: "Hospital",
      //   tags: ["tag1", "tag2", "tag_33"],
      //   units: "metric",
      //   currency: "cad$",
      //   time_zone: "UTC +0",
      //   logo: fakeBuildingImage,
      // };

      // TODO this line after we decide where to store BuildingExtras
      const buildingExtras = {
        status: "connected",
        buildingProfileWidgets: {
          column1: [
            {
              id: "BuildingDetails",
            },
            {
              id: "BrandingWidget",
            },
          ],
          column2: [
            {
              id: "UserPermWidget",
            },
            {
              id: "MapWidget",
            },
          ],
          column3: [
            {
              id: "StatisticsWidget",
            },
            {
              id: "RecentActivityWidget",
            },
          ],
        },
        activities: [
          {
            user: {
              fullName: "Jane Doe",
            },
            date: "2021-02-07",
            action: "Resolved (5) Insights",
            comment: "Resolving insights related to the faulty sensors",
          },
          {
            user: {
              fullName: "John Doe",
            },
            date: "2021-02-23",
            action: "Assigned (7) Insights to Jane Doe",
            comment:
              "Jane, assigning you some insights to work on as we discussed yesterday",
          },
        ],
      };

      //TODO remove this line. this is because of a bug that returns all buildings
      let fetchedBuilding = response.docs.filter(
        (b) => b._id === buildingId
      )?.[0];
      fetchedBuilding = { ...fetchedBuilding, ...buildingExtras };

      //TODO remove this line when server start to send address back
      (fetchedBuilding.address = fetchedBuilding.address || {
        address_line1: "13277",
        address_line2: " 108 ave",
        city: "Surrey",
        province_state: "BC",
        country: "CA",
        postal_code: "V3S5A5",
      }),
      setBuilding(fetchedBuilding);
      setInitBuilding(fetchedBuilding);
      setState({ ...fetchedBuilding.buildingProfileWidgets });
    } else {
      console.log(response.error);
    }
  }, [buildingId]);

  useEffect(async () => {
    //Update state
    if (!Object.keys(building).length) {
      return;
    }
    const updatedBuilding = {
      ...initBuilding,
      buildingProfileWidgets: state,
    };
    try {
      const fetchedBuilding = await updateBuilding(updatedBuilding);
      setBuilding(fetchedBuilding);
      setInitBuilding(fetchedBuilding);
    } catch (error) {
      //Handle Error
      console.log(error);
    }
  }, [state]);

  function imageUploadHandler(logo) {
    setBuilding({
      ...building,
      logo: logo,
    });
  }

  function imageUploadErrorHandler() {
    setBuilding({
      ...building,
      logo: initBuilding.logo,
    });
  }

  function clearImageHandler() {
    setBuilding({
      ...building,
      logo: null,
    });
  }

  async function saveLogo() {
    const updatedBuilding = {
      ...initBuilding,
      logo: building.logo,
    };
    try {
      const fetchedBuilding = await updateBuilding(updatedBuilding);
      setBuilding(fetchedBuilding);
      setInitBuilding(fetchedBuilding);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async function handleLogoUndo() {
    setBuilding({
      ...building,
      logo: initBuilding.logo,
    });
  }

  const id2List = {
    column1: "column1",
    column2: "column2",
    column3: "column3",
  };

  const getList = (id) => {
    return state[id2List[id]];
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        getList(source.droppableId),
        source.index,
        destination.index
      );

      let newState = { ...state, column1: items };

      if (source.droppableId === "column2") {
        newState = { ...state, column2: items };
      }
      if (source.droppableId === "column3") {
        newState = { ...state, column3: items };
      }
      setState(newState);
    } else {
      const result = move(
        getList(source.droppableId),
        getList(destination.droppableId),
        source,
        destination
      );

      setState({
        ...state,
        ...result,
      });
    }
  };

  const WidgetsMap = {
    MapWidget: (
      <MapWidget
        pinLocation={[
          building?.geo_location?.lat || 0,
          building?.geo_location?.lon || 0,
        ]}
      />
    ),
    UserPermWidget: <UserPermWidget permissions={building.permissions} />,
    BrandingWidget: (
      <BrandingWidget
        building={building}
        imageUploadHandler={imageUploadHandler}
        imageUploadErrorHandler={imageUploadErrorHandler}
        clearImageHandler={clearImageHandler}
        saveLogo={saveLogo}
        handleLogoUndo={handleLogoUndo}
      />
    ),
    StatisticsWidget: <StatisticsWidget />,
    RecentActivityWidget: (
      <RecentActivityWidget activities={building.activities} />
    ),
    BuildingDetails: (
      <BuildingDetails building={building} setBuilding={setBuilding} />
    ),
  };

  const getWidgets = (list) => {
    const newList = list.map((w) => {
      return {
        id: w.id,
        content: WidgetsMap[w.id],
      };
    });
    return newList;
  };

  const columns = {
    column1: getWidgets(state.column1),
    column2: getWidgets(state.column2),
    column3: getWidgets(state.column3),
  };

  //Loading...
  if (!Object.keys(building).length) {
    return <Loading message={t("loading") + "..."} />;
  }
  return (
    <div className="">
      <Card>
        <CardBody>
          <CardTitle className="h4 text-center d-flex ">
            <div className="d-flex " style={{ width: "300px" }}>
              <img
                src={building.logo || defaultImage}
                alt=""
                className="img-thumbnail rounded"
                style={{ width: "100px" }}
              />
              <div className="text-left">
                <div className="float-right mt-4">
                  <span>Status:</span>
                  <br />
                  {building.status === "connected" && (
                    <span className="text-success">  {t("Connected")}</span>
                  )}
                  {building.status !== "connected" && (
                    <span className="text-danger">  {t("Disconnected")}</span>
                  )}
                </div>
                <div className="float-left mt-3">
                  {building.status === "connected" && (
                    <i
                      className="mdi mdi-power-plug text-success "
                      style={{ fontSize: "2.6rem" }}
                    ></i>
                  )}
                  {building.status !== "connected" && (
                    <i
                      className="mdi mdi-power-plug-off text-danger"
                      style={{
                        fontSize: "2.6rem",
                      }}
                    ></i>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4  w-100">
              <div style={{ marginLeft: "-300px" }}>
                {building.name} - {t(tabNames[activeTab])}
              </div>
            </div>
          </CardTitle>
          <div className="d-flex">
            <Nav className="justify-content-end icon-tab nav-justified mb-4 mx-auto" >
              {Object.keys(tabNames).map((i) => {
                return (
                  <NavItem key={"tab-" + i}>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab === String(i),
                      })}
                      onClick={() => {
                        setActiveTab(String(i));
                      }}
                    >
                      <span className="d-none d-sm-block">{tabNames[i]}</span>
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
          </div>

          <TabContent activeTab={activeTab} className="p-3 text-muted">
          <TabPane tabId="1">
              <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                  <Col>
                    <Droppable droppableId="column1">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {columns.column1.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>

                  <Col>
                    <Droppable droppableId="column2">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {columns.column2.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                  <Col>
                    <Droppable droppableId="column3">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          style={getListStyle(snapshot.isDraggingOver)}
                        >
                          {columns.column3.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                >
                                  {item.content}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                </Row>
              </DragDropContext>
            </TabPane>
            <TabPane tabId="2">
              <p>Placeholder for Projects</p>
            </TabPane>
            <TabPane tabId="3">
              <p>Placeholder for Dashboard</p>
            </TabPane>
            <TabPane tabId="4">
              <p>Placeholder for Discover</p>
            </TabPane>
            <TabPane tabId="5">
              <p>Placeholder for Reports</p>
            </TabPane>
            <TabPane tabId="6">
              <p>Placeholder for Rules</p>
            </TabPane>
            <TabPane tabId="7">
              <Contextualization />
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/*
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const BuildingDetails = ({ building, setBuilding }) => {
  const [showAddBuildingWizard, setShowAddBuildingWizard] = useState(false);
  const { t } = useTranslation();

  const handleAddBuilding = (newBuilding) => {
    console.log("New Building",newBuilding);
    const response = createBuilding(newBuilding); 
    setBuilding(newBuilding);
  };
  building.time_zone = building.time_zone || building.address?.time_zone;
  const addressArray = Object.values(building.address).join(" ");
  const tagsArray = building.tags?.map(tag => (
    <Badge color="info font-size-11" className="mx-1" key={tag}>
      {tag}
    </Badge>
  ));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="d-flex justify-content-between">
            <span>{t("Building Details")}</span>
            <div>
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faCog}
                className="mr-3"
                onClick={() => setShowAddBuildingWizard(true)}
              />
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faArrowsAlt}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row className="my-2">
            <Col>{t("Building Name")}:</Col>
            <Col>{building.name}</Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Address")}:</Col>
            <Col>{addressArray}</Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Type")}:</Col>
            <Col>{building.building_type}</Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Tags")}:</Col>
            <Col>{tagsArray}</Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Units")}:</Col>
            <Col style={{ textTransform: "capitalize" }}>{building.units}</Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Currency")}:</Col>
            <Col style={{ textTransform: "uppercase" }}>
              {building.currency}
            </Col>
          </Row>
          <Row className="my-2">
            <Col>{t("Timezone")}:</Col>
            <Col>{building.time_zone}</Col>
          </Row>
        </CardBody>
      </Card>
      {showAddBuildingWizard && (
        <AddBuildingWizard
          showModal={showAddBuildingWizard}
          setShowModal={setShowAddBuildingWizard}
          handleAddBuilding={handleAddBuilding}
          inputBuilding={building}
        />
      )}
    </>
  );
};

const BrandingWidget = ({
  building,
  imageUploadHandler,
  imageUploadErrorHandler,
  clearImageHandler,
  saveLogo,
  handleLogoUndo,
}) => {
  const { t } = useTranslation();

  const [mode, setMode] = useState("view");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleModeChange = () => {
    setMode(mode === "view" ? "edit" : "view");
    setErrorMessage("");
  };
  const handleLogoSave = async () => {
    setIsSubmitted(true);
    setMode("view");

    try {
      await saveLogo();
      setIsSubmitted(false);
    } catch (error) {
      setIsSubmitted(false);
      setErrorMessage(error);
    }
  };

  const handleUndo = () => {
    setMode("view");
    handleLogoUndo();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="d-flex justify-content-between">
          <span>{t("Branding")}</span>
          {mode !== "edit" && (
            <div>
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faCog}
                onClick={handleModeChange}
                className="mr-3"
              />
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faArrowsAlt}
              />
            </div>
          )}
          {mode === "edit" && (
            <div>
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faSave}
                onClick={handleLogoSave}
                className="mr-3"
              />
              <FontAwesomeIcon
                style={{ cursor: "pointer" }}
                icon={faUndo}
                onClick={handleUndo}
              />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      {isSubmitted && (
        <CardBody>
          <Loading message={t("Submitting") + "..."} />
        </CardBody>
      )}
      {errorMessage && (
        <CardBody>
          <center>
            <p className="text-danger">{errorMessage}</p>
          </center>
        </CardBody>
      )}
      {!isSubmitted && !errorMessage && (
        <CardBody>
          <Row>
            <Col>
              {mode === "edit" && (
                <DragnDropImageManager
                  mode={mode}
                  avatar={building.logo}
                  defaultImage={defaultImage}
                  onUpload={imageUploadHandler}
                  onClear={clearImageHandler}
                  onError={imageUploadErrorHandler}
                  imageClass="img-thumbnail rounded"
                />
              )}
              {mode !== "edit" && (
                <Row className="d-flex justify-content-center">
                  <div>
                    <div className="d-flex justify-content-center">
                      <img
                        src={building.logo || defaultImage}
                        alt=""
                        className="img-thumbnail rounded"
                        style={{ width: "100px" }}
                      />
                    </div>
                    <span className="">Building Logo/Image</span>
                  </div>
                </Row>
              )}
            </Col>
          </Row>
          {mode === "edit" && (
            <Row>
              <Col className="d-flex justify-content-center">
                <span className="text-danger mx-auto">
                  {t("Image must be square")}
                </span>
              </Col>
            </Row>
          )}
        </CardBody>
      )}
    </Card>
  );
};

// const BrandingWidget = ({
//   building,
//   imageUploadHandler,
//   imageUploadErrorHandler,
//   clearImageHandler,
//   saveLogo,
//   handleLogoUndo,
// }) => {
//   return (
//     <DraggableWidget title="Branding Widget">
//       <Branding
//         building={building}
//         imageUploadHandler={imageUploadHandler}
//         imageUploadErrorHandler={imageUploadErrorHandler}
//         clearImageHandler={clearImageHandler}
//         saveLogo={saveLogo}
//         handleLogoUndo={handleLogoUndo}
//       />
//     </DraggableWidget>
//   );
// };

const MapWidget = ({ pinLocation }) => {
  const pin = [
    {
      location: pinLocation,
      option: { color: "red" },
      addHandler: {
        type: "click",
        callback: () => {
          console.log("handlePinClick");
        },
      },
    },
  ];

  return (
    <DraggableWidget title="Map Widget" className="bg-info">
      <div style={{ width: "100%", height: "400px" }}>
        <ReactBingmaps
          className="customClass"
          id="buildingProfileMap"
          center={pinLocation}
          bingmapKey={BING_MAP_KEY}
          //boundary={boundary}
          pushPins={pin}
          supportedMapTypes={["road", "canvasDark"]}
        ></ReactBingmaps>
      </div>
    </DraggableWidget>
  );
};
const StatisticsWidget = () => {
  return (
    <DraggableWidget title="Statistics Widget">
      <Card className="border border-dark  mb-1">
        <CardBody>
          <Row>
            <Col>Area</Col>
            <Col>
              65,000 m<sup>2</sup>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="border border-dark mb-1">
        <CardBody className="">
          <Row>
            <Col md={6}>
              <span>
                Equipment <br />
                Summary
              </span>
            </Col>
            <Col md={6}>
              <span>5 AHU</span>
              <br />
              <span>3 BLR</span>
              <br />
              <span>250 VAV</span>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card className="border border-dark   mb-1">
        <CardBody>
          <Row>
            <Col>Projects</Col>
            <Col>
              <span>3 Open</span>
              <br />
              <span>9 Completed</span>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </DraggableWidget>
  );
};

const RecentActivityWidget = ({ activities }) => {
  const { t } = useTranslation();

  const activitiesJSX = activities.map((activity,index) => {
    return (
      <Card key={'activity' + index}>
        <CardBody className="p-1">
          <div className="d-flex justify-content-center">
            <FontAwesomeIcon icon={faUserCircle} className="font-size-24" />
            <h6 className="ml-2 mt-1">
              {activity.user.fullName}: {activity.date}
            </h6>
          </div>
          <Row className="mt-1">
            <Col sm={12} md={4}>
            {t("Action")}:
            </Col>
            <Col sm={12} md={8}>
              {activity.action}
            </Col>
          </Row>
          <Row>
            <Col md={4}>{t("Comment")}:</Col>
            <Col md={8}>{activity.comment}</Col>
          </Row>
        </CardBody>
      </Card>
    );
  });

  return (
    <DraggableWidget title={t("Recent Activity Widget")}>
      {activitiesJSX}
    </DraggableWidget>
  );
};

const DraggableWidget = ({ title, children }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="d-flex justify-content-between">
          <span>{title}</span>
          <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faArrowsAlt} />
        </CardTitle>
      </CardHeader>
      <CardBody>
        <span>{children}</span>
      </CardBody>
    </Card>
  );
};

const UserPermWidget = ({ permissions }) => {
  return <BuildingUsersPermissionsWidget permissions={permissions} />;
};
