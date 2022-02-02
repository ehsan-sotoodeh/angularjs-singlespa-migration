import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import BootstrapTable from "react-bootstrap-table-next";

import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import {
  Button,
  Row,
  Col,
  Link,
  InputGroup,
  InputGroupAddon,
  Input,
  Badge,
  Label,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";

import { toast } from "react-toastify";

import AddBuildingWizard from "../../../common/AddBuildingWizard/AddBuildingWizard";
import BulkManageBuildingWizard from "../BulkManageBuildingWizard/BulkManageBuildingWizard";

import {
  createBuilding,
  deleteBuildings,
  moveBuildings,
} from "../../../services/buildingService";
import { getCurrentUser } from "../../../services/userService";
import withErrorBoundary from "../../../common/withErrorBoundary";

const test_building = {
  name: "Ehsan's Building",
  units: "metric",
  building_area_unit: "square meter",
  tags: ["ehsan_building"],
  address: {
    time_zone: "UTC +10:30",
    street: "13277 108 ave",
    country: "CA",
    province_state: "BC",
    city: "Surrey",
    postal_code: "V3T0A9",
  },
  currency: "cad$",
  building_type: "Hospital",
  area: "6545",
  floors: 21,
  year: 2021,
  geo_location: [49.1991395, -122.8539075],
  area: 6545,
};



const BuildingManager = ({ account, buildings, setBuildings, loading }) => {
  const history = useHistory();
  const [status, setStatus] = useState("");
  const [checkedAll, setCheckedAll] = useState(false);
  const { t } = useTranslation();
  const [showAddBuildingWizard, setShowAddBuildingWizard] = useState(false);
  const [showBulkManageBuildingWizard, setBulkManageBuildingWizard] = useState(
    false
  );
  const accountPending = account.status !== "active";
  //let { accountId } = useParams();
  //TODO do the filtering on status on server side
  let buildingsList = buildings.filter((b) => {
    return status === "" ? true : b.status === status;
  });

  const { SearchBar } = Search;
  const pageOptions = {
    sizePerPage: 10,
    totalSize: buildingsList?.length,
    custom: true,
  };

  const columns = [
    {
      dataField: "_id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "checked",
      text: "",
      headerFormatter: () => {
        return (
          <div>
            <Input
              className="ml-1"
              title="check all"
              type="checkbox"
              checked={checkedAll}
              onChange={() => {
                handleCheckAll();
              }}
              disabled={accountPending}
            />
            &nbsp;
          </div>
        );
      },
      formatter: (cellContent, building) => {
        return (
          <center>
            <Input
              className="ml-1"
              type="checkbox"
              checked={!!building.checked}
              onChange={() => handleCheckboxClick(building._id)}
              disabled={accountPending}
            />
          </center>
        );
      },
    },
    {
      dataField: "name",
      text: t("Building Name"),
      sort: true,
      formatter: (cellContent, b) => {
        return (
          <div
            onClick={() => navigateToBuilding(b._id)}
            className="text-left pointer"
          >
            {b.name}
          </div>
        );
      },
    },
    {
      dataField: "building_type",
      text: t("Building Type"),
      sort: true,
      formatter: (cellContent, b) => {
        return (
          <div onClick={() => navigateToBuilding(b._id)} className="pointer">
            {b.building_type}
          </div>
        );
      },
    },
    {
      dataField: "area",
      text: t("Area"),
      sort: true,
      formatter: (cellContent, b) => {
        return (
          <div onClick={() => navigateToBuilding(b._id)} className="pointer">
            {b.area}{" "}
            {b.units === "metric" ? (
              <span>
                m<sup>2</sup>
              </span>
            ) : (
              <span>
                ft<sup>2</sup>
              </span>
            )}
          </div>
        );
      },
    },
    {
      dataField: "connectorName",
      text: t("Connector Name"),
      sort: true,
      formatter: (cellContent, b) => (
        <div onClick={() => navigateToBuilding(b._id)} className="pointer">
          {b.connectorName ? b.connectorName : "-------"}
        </div>
      ),
    },
    {
      dataField: "connectorType",
      text: t("Connector Type"),
      sort: true,
      formatter: (cellContent, b) => (
        <div onClick={() => navigateToBuilding(b._id)} className="pointer">
          {b.connectorType ? b.connectorType : "-------"}
        </div>
      ),
    },
    {
      dataField: "connectorMac",
      text: t("Connector MAC Address"),
      sort: true,
      formatter: (cellContent, b) => (
        <div onClick={() => navigateToBuilding(b._id)} className="pointer">
          {b.connectorMac ? b.connectorMac : "-------"}
        </div>
      ),
    },
    {
      dataField: "status",
      sort: true,
      text: t("Status"),
      formatter: (cellContent, b) => (
        <Badge
          onClick={() => navigateToBuilding(b._id)}
          color={b.status === "online" ? "primary" : "danger"}
          className="font-size-12 mb-1 text-light pointer"
        >
          {b.status || "offline"}
        </Badge>
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "asc",
    },
  ];

  const handleStatusChange = (newStatus) => {
    if (status === newStatus) {
      setStatus("");
    } else {
      setStatus(newStatus);
    }
  };

  const handleCheckboxClick = (buildingId) => {
    const modifiedBuildings = buildings.map((b) => {
      if (b._id === buildingId) {
        b.checked = !b.checked;
      }
      return b;
    });
    setBuildings(modifiedBuildings);
  };

  const handleCheckAll = () => {
    const newValue = !checkedAll;
    setCheckedAll(newValue);
    const modifiedBuildings = buildings.map((b) => {
      b.checked = newValue;
      return b;
    });
    setBuildings(modifiedBuildings);
  };

  const handleAddBuilding = async (newBuilding) => {
    const currentUser = await getCurrentUser();

    const converted_building = {
      name: newBuilding.name,
      units: newBuilding.units,
      tags: newBuilding.tags,
      address: {
        city: newBuilding.address.city,
        country: newBuilding.address.country,
        postal_code: newBuilding.address.postal_code,
        street: newBuilding.address.street,
        street_address: newBuilding.address.street_address || "",
      },
      currency: newBuilding.currency,
      building_type: newBuilding.building_type,
      //TODO replace contact_person's id with current_user.id
      contact_person: currentUser._id,
      geo_location: {
        lat: newBuilding.geo_location[0],
        lon: newBuilding.geo_location[1],
      },
      area: Number(newBuilding.area),
      //"location": "EU-London",
    };

    const response = await createBuilding(converted_building);

    if (response.succeeded) {
      setBuildings([...buildings, response.data]);
    } else {
      //setCreateAccountConfig({ ...createAccountConfig, error: response.error });
      console.log(response);
    }
  };

  const HandleMoveBuildings = async (destinationAccount, resetModal) => {
    console.log(destinationAccount);
    const selectedBuildings = buildings
      .filter((b) => b.checked)
      .map((b) => b._id);
    try {
      const res = await moveBuildings(
        account._id,
        destinationAccount,
        selectedBuildings
      );
      resetModal();
      if (res.succeeded) {
        const remainingBuildings = buildings
          .filter((b) => !selectedBuildings.includes(b._id))
          .map((building) => {
            building.checked = false;
            return building;
          });
        setBuildings(remainingBuildings);
        const toastMessage = `${selectedBuildings.length} ${t(
          (selectedBuildings.length > 1 ? "Buildings" : "Building") +
            " moved successfully"
        )}`;
        toast.success(toastMessage);
      } else {
        toast.error(res?.error?.data?.error || t("Operation Failed!"));
      }
    } catch (error) {
      toast.error(String(error));
      console.log(error);
    }
  };

  const handleDeleteBuildings = async (resetModal) => {
    const selectedBuildings = buildings
      .filter((b) => b.checked)
      .map((b) => b._id);

    try {
      const res = await deleteBuildings(selectedBuildings);
      resetModal();
      if (res.succeeded) {
        const deleted_buildings = res.data
          .filter((b) => b.succeeded)
          .map((b) => b.data.doc_ids[0]);
        const failedToDelete_buildings = res.data
          .filter((b) => !b.succeeded)
          .map((b) => {
            return { id: b.data.doc_ids[0], error: b.error };
          });

        //  Update UI and reset checkbox
        const remainingBuildings = buildings
          .filter((b) => !deleted_buildings.includes(b._id))
          .map((building) => {
            building.checked = false;
            return building;
          });

        setBuildings(remainingBuildings);

        //show toast
        const successToastMessage = `${deleted_buildings.length} ${t(
          (deleted_buildings.length > 1 ? "Buildings" : "Building") +
            " deleted successfully"
        )}`;
        toast.success(successToastMessage);

        if (failedToDelete_buildings.length) {
          failedToDelete_buildings.forEach((b) => {
            toast.error(b.error);
          });
        }
      } else {
        toast.error(res?.error?.data?.error || t("Operation Failed!"));
      }
    } catch (error) {
      toast.error(String(error));
      console.log(error);
    }
  };

  const navigateToBuilding = (buildingId) => {
    history.push("/admin/account/" + account._id + "/building/" + buildingId);
  };

  return (
    <div style={{ height: "100%", textAlign: "center" }}>
      {accountPending && (
        <div className="alert alert-warning" role="alert">
          {t("You're account is still Pending! Please contact your admin.")}
        </div>
      )}
      <PaginationProvider
        pagination={paginationFactory(pageOptions)}
        keyField="_id"
        columns={columns}
        data={buildingsList}
      >
        {({ paginationProps, paginationTableProps }) => (
          <ToolkitProvider
            keyField="_id"
            columns={columns}
            data={buildingsList}
            search
          >
            {(toolkitProps) => (
              <React.Fragment>
                <Row className="my-2">
                  <Col className="d-flex justify-content-start">
                    <div className="search-box d-inline-block ml-3">
                      <div className="position-relative">
                        <SearchBar {...toolkitProps.searchProps} />
                        <i className="bx bx-search-alt search-icon" />
                      </div>
                    </div>
                  </Col>
                  <Col className="row justify-content-center">
                    <div>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <Button
                            color="danger"
                            outline={status === "offline" ? false : true}
                            onClick={() => handleStatusChange("offline")}
                          >
                            {t("Offline")}
                          </Button>
                        </InputGroupAddon>
                        <InputGroupAddon addonType="append">
                          <Button
                            color="success"
                            outline={status === "online" ? false : true}
                            onClick={() => handleStatusChange("online")}
                          >
                            {t("Online")}
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                  </Col>
                  <Col className="">
                    <Button
                      className="mx-1"
                      outline
                      color="primary"
                      title={t("Manage")}
                      disabled={!buildings.filter((b) => b.checked).length}
                      onClick={() => setBulkManageBuildingWizard(true)}
                    >
                      {t("Manage")}
                    </Button>
                    <Button
                      className="mx-1"
                      color="primary"
                      outline
                      onClick={() => setShowAddBuildingWizard(true)}
                      disabled={accountPending}
                    >
                      <FontAwesomeIcon icon={faPlus} /> {t("Add Building")}
                    </Button>
                    <Button
                      className="ml-4"
                      color="primary"
                      outline
                      onClick={() => setCreateAccountConfig({ show: true })}
                    >
                      <FontAwesomeIcon icon={faExpandArrowsAlt} />
                    </Button>
                  </Col>
                </Row>

                <Row>
                  <Col xl="12" className="">
                    <div className="table-responsive">
                      <BootstrapTable
                        keyField={"id"}
                        responsive
                        bordered={true}
                        striped={true}
                        defaultSorted={defaultSorted}
                        classes={"table align-middle table-nowrap"}
                        headerWrapperClasses={"thead-light"}
                        {...toolkitProps.baseProps}
                        {...paginationTableProps}
                        // rowStyle={{ cursor: "pointer" }}
                        // rowEvents={{
                        //   onClick: (e, row, rowIndex) => {
                        //     history.push("/admin/building/"+row._id);
                        //   },
                        // }}
                      />
                    </div>
                  </Col>
                </Row>
                {!buildings.length && !loading && (
                  <Row className="my-2">
                    <p className="mx-auto">{t("No Building Was Found")}...</p>
                  </Row>
                )}
                {loading && (
                  <Row className="my-2">
                    <p className="mx-auto">{t("Loading")}...</p>
                  </Row>
                )}
                {pageOptions.totalSize > pageOptions.sizePerPage && (
                  <Row className="align-items-md-center mt-30">
                    <Col className="inner-custom-pagination d-flex justify-content-end">
                      <div className="text-md-right ms-auto">
                        <PaginationListStandalone {...paginationProps} />
                      </div>
                      <SizePerPageDropdownStandalone
                        className="mx-2 p-0"
                        {...paginationProps}
                      />
                    </Col>
                  </Row>
                )}
              </React.Fragment>
            )}
          </ToolkitProvider>
        )}
      </PaginationProvider>
      <AddBuildingWizard
        showModal={showAddBuildingWizard}
        setShowModal={setShowAddBuildingWizard}
        handleAddBuilding={handleAddBuilding}
        
      />

      <BulkManageBuildingWizard
        showModal={showBulkManageBuildingWizard}
        setShowModal={setBulkManageBuildingWizard}
        buildings={buildings.filter((b) => b.checked)}
        handleDeleteBuildings={handleDeleteBuildings}
        HandleMoveBuildings={HandleMoveBuildings}
      />
    </div>
  );
};

export default withErrorBoundary(BuildingManager);
