import React, { useState, useEffect } from "react";

import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Container
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";


import SavingsToDate from  "./SavingsToDate";
import PortfolioManager from "./PortfolioManager";
import AssignedInsights from "./AssignedInsights";
import SharedPortfolios from "./SharedPortfolios";
import RecentActivity from "./RecentActivity";

export default function PortfolioPage() {
  return (
    <div className="">
    <div className="flex justify-content-center pb-0">
    <Row>
      	<Col className="col-12">
      		<h3 className="text-center">Portfolio page</h3>
      	</Col>
      </Row>
     </div>
        <Container >
     	<Row noGutters >	
     	<Col>
     		<Row noGutters >
      	<Col md={4} sm={6} lg={6}>
      		<SavingsToDate />
      	</Col>
      	<Col md={4} sm={6} lg={6}>
      		<PortfolioManager />
      	</Col>
      		</Row>
      		<Row noGutters >
      	<Col md={4} sm={6} lg={6}>
      		<AssignedInsights />
      	</Col>
      	<Col md={4} sm={6} lg={6}>
      		<SharedPortfolios />
      	</Col>
      		</Row>  	   
     	</Col>
     	<Col md={4} sm={6}>
     		<RecentActivity />
     	</Col> 	
     	</Row>
     	</Container>
    </div>
  );
}
