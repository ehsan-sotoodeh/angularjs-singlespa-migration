import React,{useEffect,useState} from "react";
import MetaTags from 'react-meta-tags';
import { Link,useHistory } from "react-router-dom"
import { Row, Col, CardBody, Card, Container } from "reactstrap"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import {login,auth$ } from "@react-mf/root-config";
import lightlogo from "../../assets/images/logo-light.png"

export default function Login() {
    const {t} = useTranslation();
    const history = useHistory();
    const [isLoggedIn,setIsLoggedIn] = useState(false)


    useEffect(()=>{
      auth$.subscribe(status => {
        if(!status.pending && status.authCode === 200){
          setIsLoggedIn(true);
        }
      })
    },[])

    


    return (
        <React.Fragment >
            <MetaTags>
              <title>{t('Login')}</title>
            </MetaTags>
            <div className="home-btn d-none d-sm-block">
              <Link to="/" className="text-dark">
                <i className="bx bx-home h2" />
              </Link>
            </div>
            <div className="account-pages my-3 pt-sm-5" >
              <Container>
                <Row className="justify-content-center">
                  <Col md={8} lg={6} xl={8}>
                    <Card className="overflow-hidden">
                      <div className="bg-primary bg-soft">
                        <Row>
                          <Col className="col-7">
                            <div className="text-primary p-4">
                              <h5 className="text-primary">{t('Welcome Back')} !</h5>
                              <p>{t('Login to K2')}</p>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      <CardBody className="pt-0">
                        <div className="auth-logo">
                          <Link to="/" className="auth-logo-light">
                            <div className="avatar-md profile-user-wid mb-4">
                              <span className="avatar-title rounded-circle bg-light">
                                <img
                                  src={lightlogo}
                                  alt={t('Logo')}
                                  className="rounded-circle"
                                  height="34"
                                />
                              </span>
                            </div>
                          </Link>
                          <Link to="/" className="auth-logo-dark">
                            <div className="avatar-md profile-user-wid mb-4">
                              <span className="avatar-title rounded-circle bg-light">
                                <img
                                  src={lightlogo}
                                  alt={t('Logo')}
                                  className="rounded-circle"
                                  height="34"
                                />
                              </span>
                            </div>
                          </Link>
                        </div>
                        <div className="">
                          {!isLoggedIn &&
                            <div className="d-grid d-flex justify-content-center pb-5">
                              <div  className="btn btn-outline-primary" 
                                    style={{minWidth:'300px'}}
                                    onClick={() => login('/admin/login')}
                                    >

                                <Row>
                                  <Col sm={3}>
                                    <FontAwesomeIcon icon={faKey} style={{fontSize:'2rem'}}/>
                                  </Col>
                                  <Col sm={9} >
                                    <span className="d-flex justify-content-start">
                                      Click here to Login <br/>
                                    </span>
                                    <span className="d-flex justify-content-start">
                                      Or create an Account
                                    </span>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          }
                          {isLoggedIn &&
                            <div className="text-center">
                              <h6>
                                { t("You're already Logged in")}...

                              </h6>
                              <h5 className="mt-3">
                                <Link to="/"> 
                                  { t('Click here to go to Homepage')}
                                </Link>
                              </h5>
                            </div>
                          }
                        </div>
                      </CardBody>
                    </Card>

                  </Col>
                </Row>
              </Container>
            </div>
        </React.Fragment>
      )
}