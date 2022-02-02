import React, { useEffect, useState } from "react";
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
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import AccountAdminList from "./AccountAdminList/AccountAdminList";
import AccountDetail from "./AccountDetail";
import BuildingManager from "./BuildingManager/BuildingManager";
import BuildingPermissionManager from "../Building/BuildingPermissionManager";
import { getAccount } from "../../services/accountService";
import { getAccountBuildings } from "../../services/buildingService";
import { getCurrentUser } from "../../services/userService";
import withErrorBoundary from "../../common/withErrorBoundary";

import "./account.css";

function AccountPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("1");
  const [account, setAccount] = useState({});
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buildingError, setBuildingError] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  let { accountId } = useParams();

  const tabNames = {
    1: "Profile",
    2: "Building Manager",
    3: "Building Permission Manager",
  };

  useEffect(async () => {
    setLoading(true);
    const response = await getAccount(accountId);

    if (response.succeeded) {
      const _account = response.data;

      const currentUser = await getCurrentUser();
      setReadOnly(!hasWritePermission(currentUser, _account.permissions));

      setAccount(_account);

      const b_response = await getAccountBuildings(_account);
      if (b_response.succeeded) {
        setBuildingError(false);
        setBuildings(b_response.data);
      } else {
        setBuildingError(true);
        console.error(b_response.error);
      }
    } else {
      //handleError(response.error);
      console.error(response.error);
    }
    setLoading(false);
  }, []);

  function hasWritePermission(user, permissions) {
    const userPermissions = permissions.filter((e) => e.user === user._id);
    let response = false;
    userPermissions.forEach((permission) => {
      if (["admin", "write"].includes(permission.role.name)) {
        response = true;
      }
    });
    return response;
  }

  return (
    <div className="">
      <Card>
        <CardBody>
          <CardTitle className="h4 text-center m-5">
            {" "}
            {account.name} - {t(tabNames[activeTab])}
          </CardTitle>
          {/* <p className="card-title-desc">
          </p> */}

          <Nav className="icon-tab nav-justified">
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: activeTab === "1" })}
                onClick={() => {
                  setActiveTab("1");
                }}
              >
                <span className="d-none d-sm-block"> Profile </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: activeTab === "2" })}
                onClick={() => {
                  setActiveTab("2");
                }}
              >
                <span className="d-none d-sm-block"> {t('Building Manager')} </span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                style={{ cursor: "pointer" }}
                className={classnames({ active: activeTab === "3" })}
                onClick={() => {
                  setActiveTab("3");
                }}
              >
                <span className="d-none d-sm-block">
                  {t('Building Permission Manager')}
                  {isReadOnly && (
                    <span>
                      {" "}
                      <FontAwesomeIcon icon={faLock} />{" "}
                    </span>
                  )}
                </span>
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="p-3 text-muted">
            <TabPane tabId="1">
              <Row>
                <Col lg="4" md="12" style={{ margin: "2px 0px" }}>
                  <div style={{ border: "1px solid", height: "100%" }}>
                    <AccountDetail account={account} />
                  </div>
                </Col>
                <Col lg="4" md="6" style={{ margin: "2px 0px" }}>
                  <div style={{ border: "1px solid", height: "100%" }}>
                    <AccountAdminList />
                  </div>
                </Col>
                <Col lg="4" md="12" style={{ margin: "2px 0px" }}>
                  <div
                    style={{
                      border: "1px solid",
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    Branding Placeholder
                  </div>
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col sm="12">
                  <BuildingManager
                    account={account}
                    buildings={buildings}
                    setBuildings={setBuildings}
                    loading={loading}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col sm="12">
                  <div style={{ border: "1px solid", height: "100%" }}>
                    <BuildingPermissionManager
                      account={account}
                      buildings={buildings}
                      buildingError={buildingError}
                      readOnly={isReadOnly}
                    ></BuildingPermissionManager>
                  </div>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </CardBody>
      </Card>
    </div>
  );
}

export default withErrorBoundary(AccountPage);
