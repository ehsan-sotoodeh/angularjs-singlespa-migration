import React, { useState, useEffect } from "react";

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

import A1 from './a1.jpg';

export default function SavingsToDate() {


  const pageTitle = "Savings To Date"
  return (
    <div>
      		<Card style={{border:'black solid 1px', marginBottom:"0px", height:"400px"}} >
      			<CardTitle className="text-center" style={{marginTop:'10px'}}>{pageTitle}</CardTitle>
      			<CardBody><img src={A1} height={250} width={250} /></CardBody>
      		</Card>
    </div>
  );
}
