
import React from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { Row, Col, CardHeader,CardBody, Card, CardTitle,CardText } from "reactstrap"

export default function Singup() {
  const inviter = "Joe Smith"; //TODO make it dynamic
  const accountInvitedTo = "Account X"; //TODO make it dynamic
  const buildingInvitedTo = "Building X"; //TODO make it dynamic

    return (

      <React.Fragment>
      <MetaTags>
           <title>PostSignup</title>
         </MetaTags>
         <div className="home-btn d-none d-sm-block">
           <Link to="/" className="text-dark">
             <i className="bx bx-home h2" />
           </Link>
         </div>

         <b>New User (Invite flow)</b>
         <Row className="d-flex justify-content-center mt-5">
         <Col lg={8} >
              <Card outline color="success" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-success text-center">
                    <i className="mdi mdi-check-all me-3 mr-2" /><span>Registered Successfully!!!</span>
                  </h5>
                </CardHeader>
                <CardBody>
                  <CardTitle className="mt-0">
                    Welcome to Kaizen
                  </CardTitle>
                  <CardText className="mt-2">
                    You were invited by <b>{inviter}</b> to join <b>&lt;{accountInvitedTo}&gt;</b> | <b>&lt;{buildingInvitedTo}&gt;</b>.
                  </CardText>
                  <CardText className="mt-2">
                    Click "Go There" to see what's going on
                  </CardText>
                  <Row className="d-flex justify-content-end ">
                    <Link to="/admin/" className="btn btn-primary" >
                        Go There
                    </Link>
                  </Row>
                </CardBody>
              </Card>
            </Col>
         </Row>
     
        <b>New User (no invite flow)</b>
         <Row className="d-flex justify-content-center mt-5">
         <Col lg={8} >
              <Card outline color="success" className="border">
                <CardHeader className="bg-transparent">
                  <h5 className="my-0 text-success text-center">
                    <i className="mdi mdi-check-all me-3 mr-2" /><span>Registered Successfully!!!</span>
                  </h5>
                </CardHeader>
                <CardBody>
                  <CardTitle className="text-center mt-0 ">
                    Welcome to Kaizen
                  </CardTitle>
                  <Row className="d-flex justify-content-end mt-4">
                    <Link to="/admin/" className="btn btn-primary px-4" >
                        Ok
                    </Link>
                  </Row>
                </CardBody>
              </Card>
            </Col>
         </Row>
     
     </React.Fragment>
   
      )
}