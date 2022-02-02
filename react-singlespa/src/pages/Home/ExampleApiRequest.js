import React, { useState,useEffect } from "react";
import { Button,Input,Spinner} from "reactstrap"

import {getCurrentUserMetaData } from '../../services/userService';

export default function ExampleApiRequest(props) {
  const [queryParams, setQueryParams] = useState();
  const [fetchingData, setFetchingData] = useState(false);
  const [sampleDate, setSampleData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {

    if(!fetchingData && queryParams){
      setFetchingData(true);
      setError('');
      setSampleData(null);

      getCurrentUserMetaData(queryParams)
      .then(user => {
        setSampleData(user)
      }).catch((error) => {
        setError(error.message);

      }).finally(() =>{
        setFetchingData(false);
      })

    }

  },[queryParams]);

  const handleApiRequest = () => {
    setQueryParams({
      params: {
        ids:'some Params'
      }
    })
  }

  const userData = (sampleDate && !fetchingData)?
  Object.keys(sampleDate).map( i => {
  return <li key={i}><b>{i}</b> : {JSON.stringify(sampleDate[i])}</li>
  })
  : <></>;
  return (
    <div className="mt-5">
        <h3>Sample Api Request</h3>
        <div className="mt-1">

          <div className="mt-3">

            {
              (fetchingData)?
                <Button disabled={true} onClick={() => handleApiRequest()}
                className="btn  btn-block ">
                  <Spinner className="mr-3" color="light" size="sm" />

                  Fetch Current User...
              </Button>
              :
              <Button  disabled={false} onClick={() => handleApiRequest()}
                className="btn btn-success btn-block "
              >Fetch Current User...</Button>
            }
          </div>


          <div className="mt-5">
            {
                (error !== '')?
                <p className="text-danger mt-2">{error}</p>:''
            }
            {userData}
          </div>
        </div>
      </div>
  );



}

