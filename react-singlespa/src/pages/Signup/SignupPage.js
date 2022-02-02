import React,{useState, useEffect} from "react";
import { auth$ } from "@react-mf/root-config";
import MetaTags from 'react-meta-tags';
import { Link,useHistory } from "react-router-dom"
import { Row, Col, CardHeader,CardBody, Card, CardTitle,CardText,Container } from "reactstrap"


import UserDetailsForm from '../../common/UserDetailsForm'
import {createNewUser} from '../../services/userService';

let token = '';

export default function SignupPage(props) {
    const history = useHistory();

    const [config, setConfig] = useState({});
    const [user, setUser] = useState();
    const [postSignup, setPostSignup] = useState();

    useEffect(()=>{
        auth$.subscribe(status => {

            if(!status.pending && status.authCode === 404){
                console.log(status.currentUser)
                token = status.accessToken
                setUser({
                    ...status.currentUser,
                    email: status.currentUser.email,
                });             
            }else if(!status.pending && status.authCode === 200){
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const invitedBy = urlParams.get('invitedBy');
                const invitedTo = urlParams.get('invitedTo');
                if(!!invitedBy && !!invitedTo){
                    setPostSignup({
                        invitedBy,
                        invitedTo
                    });
                }else{
                    setPostSignup({})
                }

                //http://localhost:9000/admin/signup?hasInvitation=true&invitedBy=Joe%20Smith&invitedTo=Building|myCoolBuilding|987978
            }
    
        })
    },[])


    async function saveHandler(result) {
        const user = {
            email:result.email,
            first_name:result.first_name,
            last_name:result.last_name,
            phone_number:result.phone_number,
            country:result.country,
            time_zone:result.time_zone,
            organization:result.organization,
            clear_after:result.clear_after,
            status_notification:result.status_notification,
            language:result.language,
            avatar:"https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.seekpng.com%2Fpng%2Fdetail%2F204-2043527_free-high-quality-male-icon-user-stock.png&imgrefurl=https%3A%2F%2Fwww.seekpng.com%2Fipng%2Fu2w7w7u2o0i1o0w7_free-high-quality-male-icon-user-stock%2F&tbnid=Sw_-mnNW5QIiwM&vet=12ahUKEwiwste_hY71AhWp_jgGHfpcAJ0QMygAegUIARCzAQ..i&docid=D3SbPghjMamsgM&w=820&h=1030&itg=1&q=user%20icon%20png&ved=2ahUKEwiwste_hY71AhWp_jgGHfpcAJ0QMygAegUIARCzAQ",
            location:result.location
        }
        try {
            const result = await createNewUser(user);
            setConfig({succeeded: true});
            auth$.next({
                errorMessage: null,
                authCode: 200,
                pending: false,
                currentUser : {...result},
                accessToken: token
            });
        } catch (error) {
            setConfig({succeeded: false});
            //TODO handle error
            console.log(error);
        }  
    }
  


    return(
        <div>
                {(user && !postSignup)?
                    <UserDetailsForm 
                        user={user} 
                        config={config} 
                        onSave={saveHandler} 
                        action={"signup"}
                    >
                    </UserDetailsForm>
                    :<></>
                }
                {
                postSignup && 
                <PostSingup data={postSignup}/>
                }
        </div>
    )
}

const PostSingup = ({data}) => {
    const inviter = data.invitedBy
    const invitedTo = (data.invitedTo)? data.invitedTo.split('|'):null;
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
        {
            (inviter&&invitedTo) &&
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
                            You were invited by <b>{inviter}</b> to join {invitedTo?.[0]}
                            <b> &lt;{invitedTo?.[1]}&gt;</b>.
                        </CardText>
                        <CardText className="mt-2">
                            Click "Go There" to see what's going on
                        </CardText>
                        <Row className="d-flex justify-content-end ">
                            <Link to={'/'+invitedTo?.[0]?.toLowerCase()+'/'+invitedTo?.[2]} className="btn btn-primary" >
                                Go There
                            </Link>
                        </Row>
                        </CardBody>
                    </Card>
                    </Col>
                </Row>
        
        }
        {
            !(inviter&&invitedTo) &&
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
                        <p>
                            Welcome to Kaizen!
                        </p>
                    </CardTitle>
                    <CardText className="text-center mt-2 ">
                        <Link to="/guide">Click here</Link> to see step by step guide on how to use this service.
                    </CardText>
                    <Row className="d-flex justify-content-end mt-4">
                        <Link to="/admin/" className="btn btn-primary px-4" >
                            Home
                        </Link>
                    </Row>
                    </CardBody>
                </Card>
                </Col>
            </Row>
        }


    
    </React.Fragment>
    
    )
}