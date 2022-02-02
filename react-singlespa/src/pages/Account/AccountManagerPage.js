import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import { useErrorHandler } from "react-error-boundary";

// import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faUndo } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import ModalCreateAccount from "./ModalCreateAccount";
import ModalDeleteAccount from "./ModalDeleteAccount";
import {
  getAccounts,
  createAccount,
  deleteAccount,
  recoverAccount,
} from "../../services/accountService";

export default function AccountManagerPage() {
  const { t } = useTranslation();

  const [accounts, setAccounts] = useState([]);
  const [deleteAccountConfig, setDeleteAccountConfig] = useState({
    show: false,
  });
  const [createAccountConfig, setCreateAccountConfig] = useState({
    show: false,
  });
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const handleError = useErrorHandler()
  useEffect(async () => {
    setLoading(true);
    try {
      
      const response = await getAccounts();
      setAccounts(response.data);
      if (!response.succeeded) {
        console.error('>>>'+response.error);
        console.error(response);
        throw new Error(response.error || "Error")
      }

    } catch (error) {
      handleError(error)
    }
    setLoading(false);

  }, []);

  async function submitCreateAccount(info) {
    setCreateAccountConfig({ ...createAccountConfig, error: undefined });

    const response = await createAccount(info);

    if (response.succeeded) {
      setAccounts(accounts.concat(response.data));
      setCreateAccountConfig({ show: false, succeeded: true });
    } else {
      setCreateAccountConfig({ ...createAccountConfig, error: response.error });
    }
  }

  async function submitDeleteAccount(accountId) {
    setDeleteAccountConfig({ ...deleteAccountConfig, error: undefined });

    const response = await deleteAccount(accountId);

    if (response.succeeded) {
      setDeleteAccountConfig({ show: false, succeeded: true });
      const data = response.data;
      setLoading(true);
      setAccounts(
        accounts.map((e) => {
          if (e._id === data._id) {
            e.status = data.status;
            e.status_expiry = data.status_expiry;
          }
          return e;
        })
      );
      setLoading(false);
    } else {
      setDeleteAccountConfig({ ...deleteAccountConfig, error: response.error });
    }
  }

  async function submitRecoverAccount(accountId) {
    setRecovering(true);
    await setLoading(true);
    setLoading(false);
    try {
      const response = await recoverAccount(accountId);
      
    } catch (error) {
      
    }
    const recoveredAccount = response.data;
    setLoading(true);
    setAccounts(
      accounts.map((e) => {
        if (e._id === recoveredAccount._id) {
          e.status = recoveredAccount.status;
          e.status_expiry = null;
        }
        return e;
      })
    );
    setRecovering(false);
    setLoading(false);
  }

  const columns = [
    {
      dataField: "_id",
      text: "ID",
      hidden: true,
    },
    {
      dataField: "name",
      text: "Account Name",
      sort: true,
      formatter: (cellContent, account) => (
        <>
          <h5 className="font-size-14 mb-1">
            {account.status === "active" && (
              <Link to={"/admin/account/" + account._id} className="text-dark">
                {account.name}
              </Link>
            )}
            {account.status === "deleted" && (
              <span className="text-muted">
                {account.name}
                <small>
                  {" "}
                  (
                  {t("will be deleted at {{x}}", {
                    x: new Date(account.status_expiry),
                  })}
                  )
                </small>
              </span>
            )}
          </h5>
        </>
      ),
    },
    {
      dataField: "branding.app_name",
      text: "App Name",
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: "20%" };
      },
    },
    {
      dataField: "menu",
      isDummyField: true,
      editable: false,
      text: "Action",
      headerStyle: (colum, colIndex) => {
        return { width: "50px" };
      },
      formatter: (cellContent, account) => (
        <div className="d-flex gap-3">
          {account.status === "deleted" && (
            <Link to="#" title={t("Recover Account")}>
              {!recovering && (
                <FontAwesomeIcon
                  icon={faUndo}
                  onClick={() => submitRecoverAccount(account._id)}
                />
              )}
              {recovering && (
                <Spinner
                  color="primary"
                  style={{ width: "1rem", height: "1rem" }}
                />
              )}
            </Link>
          )}
          {account.status === "active" && (
            <Link className="text-danger" to="#" title={t("Delete Account")}>
              <i
                className="mdi mdi-delete font-size-18"
                onClick={() => submitDeleteAccount(account._id)}                
              ></i>
            </Link>
          )}
        </div>
      ),
    },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "asc",
    },
  ];

  const pageOptions = {
    sizePerPage: 10,
    totalSize: accounts.length, // replace later with size(customers),
    custom: true,
  };

  // Custom Pagination Toggle
  const sizePerPageList = [
    { text: "5", value: 5 },
    { text: "10", value: 10 },
    { text: "15", value: 15 },
    { text: "20", value: 20 },
    { text: "25", value: 25 },
    { text: "All", value: accounts.length },
  ];

  const { SearchBar } = Search;

  return (
    <div className="">
      {/* <FakeComponent /> */}
      <Row>
        <Col className="col-12">
          <Card>
            <CardBody>
              <CardTitle className="h4 text-center">Account Manager </CardTitle>
              {!loading && (
                <PaginationProvider
                  pagination={paginationFactory(pageOptions)}
                  keyField="_id"
                  columns={columns}
                  data={accounts}
                >
                  {({ paginationProps, paginationTableProps }) => (
                    <ToolkitProvider
                      keyField="_id"
                      columns={columns}
                      data={accounts}
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

                            <Col md="8" className="text-right">
                              <Button
                                color="primary"
                                title={t("Create Account")}
                                onClick={() =>
                                  setCreateAccountConfig({ show: true })
                                }
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </Col>
                          </Row>

                          <Row>
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  keyField={"_id"}
                                  responsive
                                  bordered={true}
                                  striped={true}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-nowrap"}
                                  headerWrapperClasses={"thead-light"}
                                  {...toolkitProps.baseProps}
                                  {...paginationTableProps}
                                />
                              </div>
                            </Col>
                          </Row>
                          {pageOptions.totalSize > pageOptions.sizePerPage && (
                            <Row className="align-items-md-center mt-30">
                              <Col className="inner-custom-pagination d-flex justify-content-end">
                                <div className="text-md-right ms-auto">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
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
              )}
              {loading && (
                <div className="text-center">
                  <Spinner
                    className="ml-2"
                    color="primary"
                    style={{ width: "3rem", height: "3rem" }}
                  />
                  <div>Loading...</div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ModalCreateAccount
        config={createAccountConfig}
        onClose={() => setCreateAccountConfig({ show: false })}
        onSubmit={submitCreateAccount}
      ></ModalCreateAccount>
      <ModalDeleteAccount
        config={deleteAccountConfig}
        onClose={() => setDeleteAccountConfig({ show: false })}
        onSubmit={submitDeleteAccount}
      ></ModalDeleteAccount>
    </div>
  );
}


const FakeComponent = ({message}) => {
  return(
    <h1>
      {message.length}
    </h1>
  )
}