import React, { useState, useEffect } from "react";

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
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
} from "react-bootstrap-table2-paginator";
import avatar from "./avatar.jpg"
import A1 from './a1.jpg';

export default function RecentActivity() {

   const items =  [
    {
      id: 1,
      username:"dcf gfd",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"
    },
    {
      id: 2,
      username:"sdfg bgf",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"
    },
    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"   
    },

    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"   
    },
    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"   
    },
    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"   
    },
    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "Completed"   
    },
    {
      id: 3,
      username:"sdfg gfcv",
      date: "2021-01-12",
      action: "Project A",
      comment: "sdfghjzxcvbnsdfghjxcvb"   
    }
   ];


  const pageTitle = "Recent Activity"
  return (
          
         
            <Card  style={{border:'black solid 1px', marginBottom:"0px",overflow:"scroll", height:"800px"}}>
                <CardTitle className="text-center" style={{marginTop:'10px'}}>Recent Activity</CardTitle>
                <Row className="d-flex justify-content-center">
                  {items.map(item =>(
                    <CardBody className="justify-content-center" >
                    <div className="m-2 p-2">
                  <div className="m-2"><img src={avatar} height={30} width={30} /><b>{item.username}</b>{'\t\t' + item.date}</div>
                    <div><b>action : </b>{item.action}</div>
                    <div><b>comment : </b>{item.comment}</div>
                    </div>
                    </CardBody>
                    ))}
                  </Row>
            </Card>
          
           );
}
