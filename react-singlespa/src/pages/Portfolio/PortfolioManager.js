import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import { faPlus, faExpandArrowsAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
  Table
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";

export default function PortfolioManager(){
	  const { t } = useTranslation();
   const items =  [
   	{
   		id: 1,
   		name:"Portfolio 1",
   		buildingCount: 2,
   		sharedWith: "John"
   	},
   	{
   		id: 2,
   		name:"Portfolio 2",
   		buildingCount: 2,
   		sharedWith: "Steve"
   	},
   	{
   		id: 3,
   		name:"Portfolio 3",
   		buildingCount: 65,
   		sharedWith: "John Smith"
   	}
   ];

	return(
 		<React.Fragment>
 			<Card style={{border:'black solid 1px', marginBottom:"0px", height:"400px"}}>
      			<CardTitle className="text-center" style={{marginTop:"10px"}}>My Portfolio Manager</CardTitle>
      			<CardBody height={250} width={250}>
      				<Row className="justify-content-md-center">
      					<input className="mt-2 m-2" name="searchBar" id="searchBar" placeholder="Search ..." style={{width:"80px", height:"25px"}} />
      					<Button className="m-2" color="primary" size="sm">Manage</Button>
      					<Button className="ml-auto mt-2" color="primary" size="sm" style={{height:'25px'}} ><FontAwesomeIcon icon={faPlus} /></Button>
      				</Row>
      				<Table responsive >
      					<thead>
      						<tr>
      							<th>#</th>
      							<th>Name</th>
      							<th>Building Count</th>
      							<th>Shared With</th>
      						</tr>
      					</thead>
      					<tbody>
      						{items.map(item =>(
      							<tr key={item.id}>
      							<td><input type="checkbox" /></td>
      							<td>{item.name}</td>
      							<td>{item.buildingCount}</td>
      							<td>{item.sharedWith}</td>
      						</tr>
      							))}
      					</tbody>
      				</Table>

      			</CardBody>
      		</Card>
 		</React.Fragment>




		);
}