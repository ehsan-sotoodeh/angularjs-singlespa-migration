import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Spinner,
  Badge,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { editPermissions } from "../../services/buildingService";
import { PermissionOptions } from "../../assets/Globals";
import ModalAddUser from "./ModalAddUser";
import ModalBulkEditPermission from "./ModalBulkEditPermission";
import { getUsers } from "../../services/userService";
import { of } from "rxjs";

let glbUsers = [];
let glbPivot = "building";
let glbSelectedRows;
let glbAccountAdmins = [];
let glbAvailableItems = {};
let glbPendingUpdates = [];
toast.configure();

export default function BuildingPermissionManager(props) {
  const { account, buildings, buildingError, readOnly } = props;
  const { t } = useTranslation();

  const [loaded, setLoaded] = useState(false);
  const [pivot, setPivot] = useState(glbPivot);
  const [columns, setColumns] = useState();
  const [tableData, setTableData] = useState([]);
  const [canAddUser, setCanAddUser] = useState(false);
  const [canBulkEdit, setCanBulkEdit] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  useEffect(async () => {
    setLoaded(false);
    if (
      account &&
      account._id &&
      account.buildings.length === buildings.length
    ) {
      glbAccountAdmins = account.permissions
        .filter((e) => e.role.name === "admin")
        .map((e) => e.user);

      const _users = await getBuildingsUsers(buildings);
      glbUsers = _users === null ? [] : _users;

      const cols = createColumns(glbPivot);
      const data = createData(glbPivot);

      if (!_users) {
        cols.push({
          dataField: "err",
          text: <span className="text-danger">Error in loading users:</span>,
        });
      }

      setColumns(cols);
      setTableData(data);
      setLoaded(true);
    }

    glbSelectedRows = {
      building: [],
      user: [],
    };
  }, [account, buildings]);

  const getBuildingsUsers = async (buildings) => {
    const userIds = new Set();

    for (const building of buildings) {
      for (const permission of building.permissions) {
        userIds.add(permission.user._id);
      }
    }
    if (userIds.size > 0) {
      const response = await getUsers(Array.from(userIds).join(","));
      if (response.succeeded) {
        return await of(response.data).toPromise();
      } else {
        console.error(response.error);
        return await of(null).toPromise();
      }
    } else {
      return await of([]).toPromise();
    }
  };

  function createData(pivot) {
    let data = [];

    if (pivot === 'building') {
      buildings.forEach(building => {
        let d = { "id": building._id, "type": "building", "name": building.name };
        building.permissions.forEach(p => {
          d['role'] = p.role.name;
        });


        data.push(d);
      });
    } else {
      glbUsers.forEach((user) => {
        const full_name = user.pending ? (
          <>
            {user.email}{" "}
            <Badge color="secondary" className="font-size-12 text-light">
              {" "}
              pending{" "}
            </Badge>{" "}
          </>
        ) : (
          [user.first_name, user.last_name].join(" ")
        );
        const name = user.organization
          ? [full_name, " (", user.organization, " )"].join("")
          : full_name;

        let d = {
          id: user._id,
          type: "user",
          pending: user.pending,
          name: name,
        };

        buildings.forEach(building => {
          building.permissions.forEach(p => {
              d['role'] = p.role.name;
          })
        });
        data.push(d);
      });
    }
    return data;
  }

  function createColumns(pivot) {
    let columns = [{ dataField: "id", text: "Id", hidden: true }];

    const label = pivot === "building" ? "Buildings" : "Users";
    const objs = pivot === "building" ? glbUsers : buildings;

    columns.push({
      dataField: "name",
      text: label,
      formatter: (cellContent, data) => {
        return cellContent;
      },
    });
    objs.forEach((obj) => {
      columns.push({
        dataField: obj["_id"],
        text: (() => {
          if (pivot === 'building') {
            
            if (obj.pending) {
              return (
                <>
                  {obj.email}{" "}
                  <Badge color="secondary" className="font-size-12 text-light">
                    {" "}
                    pending{" "}
                  </Badge>
                </>
              );
            } else {
              const full_name = [obj.first_name, obj.last_name].join(" ");
              return obj.organization
                ? [full_name, " (", obj.organization, " )"].join("")
                : full_name;
            }
          } else {
            return obj.name;
             
          }
        })(),
        formatter: (cellContent, data) => {

          if ((data.type === 'building' && glbAccountAdmins.includes(obj._id)) || (data.type === 'user' && glbAccountAdmins.includes(data.id))) {
            return (
              <select
                type="select"
                className="custom-select"
                value={t("Account Admin")}
                disabled={true}
              >
                <option>{t("Account Admin")}</option>
              </select>
            );
          } else {
            return ( 
              <select type="select" className="custom-select" onChange={changeHandler(data, obj)} disabled={readOnly}>
                <option key="none" > { data.role} </option>
                {
                  PermissionOptions.map((element) => {
                    return <option key={element.id} value={element.id} >{element.name}</option>
                  })
                }
              </select>
            );
          }
        },
      });
    });

    return columns;
  }

  function changeHandler(data, obj) {
    return (e) => {
      updatePermission(data, obj, e.target.value);
    };
  }

  async function updatePermission(data, obj, value) {
    let buildingId, userId;

    if (data.type === "building") {
      buildingId = data.id;
      userId = obj._id;
    } else {
      userId = data.id;
      buildingId = obj._id;
    }

    updateBuildingUserPermission(buildingId, userId, value, true);
    setTableData(createData(data.type));

    const params = {
      account_id: account._id,
      building_ids: [buildingId],
      user_ids: [userId],
      role: value,
    };
    const response = await editPermissions(params);

    if (!response.succeeded) {
      const oldValue = glbPendingUpdates.find(
        (e) => e.buildingId === buildingId && e.userId === userId
      )["oldValue"];
      updateBuildingUserPermission(buildingId, userId, oldValue, false);
      setTableData(createData(data.type));
    }
    glbPendingUpdates = glbPendingUpdates.filter(
      (e) => !(e.buildingId === buildingId && e.userId === userId)
    );
  }

  function updateBuildingUserPermission(buildingId, userId, value, pending) {
    let building = buildings.find(e => e._id === buildingId);
    let permission = building.permissions.find(e => e.user === userId);
    let oldValue = permission ? permission.role.name : value;
    
    if (pending) {
      glbPendingUpdates.push({
        buildingId: buildingId,
        userId: userId,
        oldValue: oldValue,
      });
    }
    if (permission) {
      const p = PermissionOptions.find((e) => e.id === value);
      if (p) {
        permission.role = {
          name: value,
          description: p.description,
        };

      }
      else {
        building.permissions = building.permissions.filter(e => e.user !== userId);
      }
    } else {
      const p = PermissionOptions.find((e) => e.id === value);
      if (p) {
        building.permissions.push({
          user: userId,
          role: {
            name: value,
            description: p.description,
          },
        });
      }
    }
              toast.success("Permission Changed Successfully!");
  }

  async function togglePivot() {
    glbPivot = pivot === "building" ? "user" : "building";

    const cols = createColumns(glbPivot);
    const data = createData(glbPivot);

    updateEditability(glbPivot);

    setPivot(glbPivot);
    setColumns(cols);
    setTableData(data);
  }

  const defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: tableData.length, // replace later with size(customers),
    custom: true,
  };

  // Select All Button operation
  const selectRow = {
    mode: "checkbox",
    onSelect: (row, isSelect) => {
      if (isSelect) {
        glbSelectedRows[pivot].push(row.id);
      } else {
        glbSelectedRows[pivot] = glbSelectedRows[pivot].filter(
          (e) => e !== row.id
        );
      }
      updateEditability(pivot);
    },
    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        glbSelectedRows[pivot] = rows.map((e) => e.id);
      } else {
        glbSelectedRows[pivot] = [];
      }
      updateEditability(pivot);
    },
  };

  function updateEditability(p) {
    if (p === "building") {
      setCanAddUser(glbSelectedRows.building.length > 0);
      glbAvailableItems.users = glbUsers.filter(
        (e) => !glbAccountAdmins.includes(e._id)
      );
      glbAvailableItems.buildings = buildings.filter((e) =>
        glbSelectedRows.building.includes(e._id)
      );
      setCanBulkEdit(
        glbSelectedRows.building.length !== 0 &&
          glbAvailableItems.users.length > 0
      );
    } else {
      setCanAddUser(false);
      const nonAccountAdmins = glbSelectedRows.user.filter(
        (e) => !glbAccountAdmins.includes(e)
      );
      glbAvailableItems.users = glbUsers.filter((e) =>
        nonAccountAdmins.includes(e._id)
      );
      glbAvailableItems.buildings = buildings;
      setCanBulkEdit(nonAccountAdmins.length > 0);
    }
  }

  function addBuildingsUser(response) {
    setShowAddUser(false);
    if (response.succeeded) {
      const results = response.data;

      let affectedBuildings = buildings.filter((b) =>
        results.buildingIds.includes(b._id)
      );

      affectedBuildings.forEach((building) => {
        building.permissions.push(results.permission);
      });
      glbUsers.push(results.user);

      const cols = createColumns(glbPivot);
      const data = createData(glbPivot);

      setColumns(cols);
      setTableData(data);
    }
  }

  
  
   function editBulkPermission(config, response) {
    setShowBulkEdit(false);
    const results = response.data;
    config.building_ids.forEach(buildingId => {
        config.user_ids.forEach(userId => {
          if(response.succeeded){
          updateBuildingUserPermission(buildingId, userId, config.role, false);
          }
        });
      
    });
    setTableData(createData(glbPivot));
  }

  const { SearchBar } = Search;

  return (
    <>
      <Card>
        <CardBody>
          {/* <CardTitle className="h4">Default Datatable </CardTitle> */}
          {loaded && (
            <PaginationProvider
              pagination={paginationFactory(pageOptions)}
              keyField="id"
              columns={columns}
              data={tableData}
            >
              {({ paginationProps, paginationTableProps }) => (
                <ToolkitProvider
                  keyField="id"
                  columns={columns}
                  data={tableData}
                  search
                >
                  {(toolkitProps) => (
                    <React.Fragment>
                      <Row className="mb-2">
                        <Col md="4">
                          <div className="search-box me-2 mb-2 d-inline-block">
                            <div className="position-relative">
                              <SearchBar {...toolkitProps.searchProps} />
                              <i className="bx bx-search-alt search-icon" />
                            </div>
                          </div>
                        </Col>
                        <Col md="4" className="text-center"></Col>
                        <Col md="4" className="text-right">
                          <div className="btn-group" role="group">
                            <Button
                              color="secondary"
                              outline
                              title={t("Pivot Table")}
                              onClick={togglePivot}
                            >
                              <FontAwesomeIcon icon={faExchangeAlt} />
                            </Button>
                            <Button color="primary" outline title={t('Bulk Edit Permission')} onClick={() => setShowBulkEdit(true)}  >
                              {t('Bulk Edit Permission')}
                            </Button>
                            <Button
                              color="primary"
                              outline
                              title={t("Add User")}
                              onClick={() => setShowAddUser(true)}
                              disabled={canAddUser || readOnly}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col xl="12">
                          <div className="table-responsive">
                            <BootstrapTable
                              keyField={"id"}
                              responsive
                              bordered={false}
                              striped={false}
                              defaultSorted={defaultSorted}
                              selectRow={selectRow}
                              classes={"table align-middle table-nowrap"}
                              headerWrapperClasses={"thead-light"}
                              {...toolkitProps.baseProps}
                              {...paginationTableProps}
                            />
                            {buildingError && (
                              <div className="text-center text-danger">
                                {t("Error in loading buildings")}
                              </div>
                            )}
                          </div>
                        </Col>
                      </Row>

                      <Row className="align-items-md-center mt-30">
                        <Col className="inner-custom-pagination d-flex">
                          <div className="d-inline">
                            <SizePerPageDropdownStandalone
                              {...paginationProps}
                            />
                          </div>
                          <div className="text-md-right ms-auto">
                            <PaginationListStandalone {...paginationProps} />
                          </div>
                        </Col>
                      </Row>
                    </React.Fragment>
                  )}
                </ToolkitProvider>
              )}
            </PaginationProvider>
          )}
          {!loaded && (
            <div className="d-flex justify-content-center mt-5">
              <Spinner className="mr-2" color="dark" size="lg" />
            </div>
          )}
        </CardBody>
      </Card>

      <ModalAddUser
        show={showAddUser}
        selectedRows={glbSelectedRows}
        users={glbUsers}
        onClose={() => setShowAddUser(false)}
        onSubmit={addBuildingsUser}
      />
      <ModalBulkEditPermission
        show={showBulkEdit}
        account={account}
        selectedRows={glbSelectedRows}
        pivot={pivot}
        buildings={glbAvailableItems.buildings || []}
        users={glbAvailableItems.users}
        onClose={() => setShowBulkEdit(false)}
        onSubmit={editBulkPermission}
      />
    </>
  );
}
