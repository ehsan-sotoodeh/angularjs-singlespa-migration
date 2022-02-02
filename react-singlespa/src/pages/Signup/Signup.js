import React,{useState,useRef} from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom";
import { AvForm, AvField } from "availity-reactstrap-validation"
import { Row, Col, CardBody, Card, Container,Button,Spinner } from "reactstrap"
import { useTranslation } from "react-i18next"


import lightlogo from "../../assets/images/logo-light.png"


export default function Signup() {
  const {t} = useTranslation();
  const formEl = useRef(null);
  const history = useHistory();

  const [hasError,setHasError] = useState(true);
  const [formData,setFormData] = useState({});
  const [formSubmitted,setFormSubmitted] = useState(false);

  const handleChange = event => {
    const targetName = event.target.name;
    const targetValue = event.target.value;
    setFormData({...formData, [targetName]:targetValue})
    const hasInvalidInputs = !!Object.keys(formEl.current.state.invalidInputs).length
    setHasError(hasInvalidInputs)
    
  }

  const handleSubmit = () => {
    // setFormSubmitted(true);
    // //TODO fake server delay (to be removed)
    // setTimeout(() => {
    //   history.push("/admin/post-signup");
    // },3000)
  }

    return (
      <React.Fragment>
      <MetaTags>
           <title>{t('Signup')}</title>
         </MetaTags>
         <div className="home-btn d-none d-sm-block">
           <Link to="/" className="text-dark">
             <i className="bx bx-home h2" />
           </Link>
         </div>
         <div className="my-3 pt-sm-5">
           <Container>

             <Row className="justify-content-center">
               <Col md={8} lg={8} xl={8}>
                 <Card className="overflow-hidden">
                   <div className="bg-primary bg-soft">
                     <Row>
                       <Col className="col-7">
                         <div className="text-light p-4">
                           <h5 className="text-primary">{t('Welcome to')} K2</h5>
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
                     <div className="p-2">
                       <AvForm className="form-horizontal" ref={formEl}>
                         <div className="mb-3">
                           <AvField
                             name="email"
                             label={t('Email')}
                             value={""}
                             onChange={handleChange}
                             onFocus={handleChange}
                             onBlur={handleChange}
                             className="form-control"
                             placeholder={t('Enter email')}
                             type="email"
                             required
                             disabled={formSubmitted}
                           />
                         </div>
                         <div className="mb-3">
                           <AvField
                             name="first_name"
                             label={t('Firstname')}
                             value=""
                             onChange={handleChange}
                             onFocus={handleChange}
                             onBlur={handleChange}
                             className="form-control"
                             placeholder={t('Enter firstname')}
                             type="text"
                             validate={{
                              required: {value: true, errorMessage: t('Please enter a name')} ,
                              minLength: {value: 2, errorMessage: t('Your name must be between x and x characters',{min:2 , max:16})} ,
                              maxLength: {value: 16, errorMessage: t('Your name must be between x and x characters',{min:2 , max:16})} 
                            }}
                            disabled={formSubmitted}

                           />
                         </div>
                         <div className="mb-3">
                           <AvField
                             name="last_name"
                             label={t('Lastname')}
                             value=""
                             className="form-control"
                             placeholder={t('Enter lastname')}
                             type="text"
                             onChange={handleChange}
                             onFocus={handleChange}
                             onBlur={handleChange}
                             validate={{
                              required: {value: true, errorMessage: t('Please enter a lastname')},
                              minLength: {value: 2, errorMessage: t('Your lastname must be between x and x characters',{min:2 , max:16})},
                              maxLength: {value: 16, errorMessage: t('Your lastname must be between x and x characters',{min:2 , max:16})}
                            }}
                            disabled={formSubmitted}

                           />
                         </div>
 
                         <div className="mb-3">
                          <AvField
                            name="password"
                            label={t('Password')}
                            type="password"
                            placeholder={t('Enter password')}
                            onChange={handleChange}
                            onFocus={handleChange}
                            onBlur={handleChange}
                            validate={{
                              required: {value: true, errorMessage: t('Please enter a password')},
                              pattern: {value: '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{12,24})', errorMessage:  t('Your name must be composed only with letter and numbers and',{chars: ' ! @ # $ % ^ & *'})},
                              minLength: {value: 12, errorMessage: t('Your password must be between x and x characters',{min:12 , max:24})},
                              maxLength: {value: 24, errorMessage: t('Your password must be between x and x characters',{min:12 , max:24})}
                            }} 
                            disabled={formSubmitted}

                          />
                        </div>
                        <div className="mb-3">
                          <AvField
                            name="repeatPassword"
                            label={t('Repeat Password')}
                            type="password"
                            required
                            placeholder={t('Repeat above password')}
                            onChange={handleChange}
                            onFocus={handleChange}
                            onBlur={handleChange}
                            validate={{
                              required: {value: true, errorMessage:t('Please enter a reenter the password') },
                              match: { value: "password" },
                            }}
                            disabled={formSubmitted}

                          />
                        </div>
 

 
                         <div className="mt-3 d-grid">
                           {
                             (formSubmitted)?
                             <Button to="/admin/post-signup" disabled={hasError} onClick={handleSubmit}
                              className="btn btn-success btn-block ">
                                {t('Submitted')} 
                              <Spinner className="ml-2" color="light" size="sm" />
                            </Button>
                           :
                            <Button to="/admin/post-signup" disabled={hasError} onClick={handleSubmit}
                              className="btn btn-primary btn-block "
                            >{t('Signup')} </Button>
                           }


                         </div>

                       </AvForm>
                     </div>
                   </CardBody>
                 </Card>
                 <div className="mt-2 text-center">
                  <p>
                  {t('Already have an account?')}
                    <Link to="login" className="font-weight-medium text-primary ml-2" >
                      {t('Login')}                     
                    </Link>
                  </p>
                 </div>
                 
               </Col>
             </Row>
           </Container>
         </div>
     </React.Fragment>
   
      )
}