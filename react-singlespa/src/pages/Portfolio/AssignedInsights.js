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
  Table,
  InputGroup,
  FormControl
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import A1 from './a1.jpg';

export default function PortfolioManager(){
	  const { t } = useTranslation();
   const items =  [
   	{
   		id: 1,
   		message:"dcf",
   		building: "Building 1",
   		project: "Project A",
      status: "Completed"
    },
   	{
   		id: 2,
   		message:"sdfg",
   		building: "Building 1",
   		project: "Project A",
      status: "Completed"
   	},
   	{
   		id: 3,
   		message:"sdfg",
   		building: "Building 1",
   		project: "Project A",
      status: "Completed"  	
    }
   ];

	return(
 		<div>
 			<Card style={{border:'black solid 1px', marginTop:"0px", height:"400px"}}>
      			<CardTitle className="text-center" style={{marginTop:'10px'}}>Assigned Insights</CardTitle>
      			<CardBody>
      				<Row className="justify-content-md-start">
      					   <Col sm={1}>
                  <input type="text" name="searchBar" placeholder="Search" id="searchBar" style={{width:"100px"}}/>
                   </Col>
      				</Row>
  					<br />
      				<Table responsive>
      					<thead>
      						<tr>
      							<th>Message</th>
      							<th>Building</th>
      							<th>Project</th>
                    <th>Status</th>
      						</tr>
      					</thead>
      					<tbody>
      						{items.map(item =>(
      							<tr>
      							<td>{item.message}</td>
      							<td>{item.building}</td>
      							<td>{item.project}</td>
      							<td>{item.status  }</td>
      						</tr>
      							))}
      					</tbody>
      				</Table>

      			</CardBody>
      		</Card>
 		</div>




		);
}