import React from 'react';
import { Alert } from 'reactstrap';
import { useTranslation } from "react-i18next";

export default function ResponseAlert(props) {
  const { config, successMessage } = props;

  const { t } = useTranslation();

  return (
    <>
      {config.error &&
        <Alert className="text-center" color="danger">
          {config.error.data || config.error.statusText || 'Unknown Error'}
        </Alert>
      }
      {config.succeeded &&
        <Alert className="text-center" color="success">
          { t(successMessage) }
      </Alert>
      }
    </>
  )
}