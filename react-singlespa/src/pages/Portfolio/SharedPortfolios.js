import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

import { faPlus, faExpandArrowsAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import A1 from './a1.jpg';

export default function SharedPortfolios(){
	  const { t } = useTranslation();
   const items =  [
   	{
   		id: 1,
   		name:"Portfolio 1",
   		buildingCount: 2,
   		sharedBy: "John"
   	},
   	{
   		id: 2,
   		name:"Portfolio 2",
   		buildingCount: 2,
   		sharedBy: "Steve"
   	},
   	{
   		id: 3,
   		name:"Portfolio 3",
   		buildingCount: 65,
   		sharedBy: "John Smith"
   	}
   ];

	return(
 		<div>
 			<Card style={{border:'black solid 1px', marginBottom:"0px", height:"400px"}}>
      			<CardTitle className="text-center" style={{marginTop:'10px'}}>Shared Portfolio</CardTitle>
      			<CardBody>
      				<Row>
      					<input className="m-2" name="searchBar" id="searchBar" placeholder="Search ..." style={{width:"80px", height:"25px"}} />
      				</Row>
      				<Table bordered>
      					<thead>
      						<tr>
      							<th>Name</th>
      							<th>Building Count</th>
      							<th>Shared By</th>
                    <th>Delete</th>     
      						</tr>
      					</thead>
      					<tbody>
      						{items.map(item =>(
      							<tr>
      							<td>{item.name}</td>
      							<td>{item.buildingCount}</td>
      							<td>{item.sharedBy}</td>
                    <td><Button color="danger" size="sm"><FontAwesomeIcon icon={faTrash} /></Button></td>
      						</tr>
      							))}
      					</tbody>
      				</Table>

      			</CardBody>
      		</Card>
 		</div>




		);
}