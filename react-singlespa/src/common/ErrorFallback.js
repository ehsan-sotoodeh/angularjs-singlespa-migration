import React, { useState } from "react";
import { UncontrolledCollapse, Button, Alert, Spinner } from "reactstrap";
import { saveLog } from "../services/logService";

import { getBrowserDetails } from "../helpers/utils";
import { useTranslation } from "react-i18next";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const { t } = useTranslation();

  const [reportSent, setReportSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const report = async () => {
    setLoading(true);
    try {
      const res = await saveLog({
        title: error.message,
        stack: encodeURIComponent(error.stack),
        browser_details: JSON.stringify(getBrowserDetails()),
        url: encodeURIComponent(window.location.href),
      });
      setReportSent(true);
      setLoading(false);
    } catch (error) {
      // Handle saving error in localstorage and sending them
      // on the next try
      console.log(error);
    }
  };

  return (
    <Alert color="light" className="w-100" role="alert">
      <div className="d-flex text-danger">
        <span>
          <i className="bx bxs-error" style={{ fontSize: "20px" }} />
        </span>
        <span className="ml-2">
          {t("Error")}: {error.message}
        </span>
      </div>
      <div className="py-2">
        <span id="toggler" className="pl-2 pointer">
          <i className="bx bxs-right-arrow" style={{ fontSize: "9px" }} />
          {t("Details")}...
        </span>
      </div>
      <UncontrolledCollapse toggler="#toggler">
        <pre>{error.stack}</pre>
      </UncontrolledCollapse>
      <Button
        outline
        color="primary"
        className="mt-2"
        onClick={resetErrorBoundary}
      >
        <div className="d-flex">
          <span>
            <i className="bx bx-revision" style={{ fontSize: "18px" }}></i>
          </span>
          <span className="ml-1"> {t("Try Again")}</span>
        </div>
      </Button>
      <Button
        outline
        color="danger"
        className="mt-2 ml-2"
        onClick={report}
        disabled={reportSent || loading}
      >
        <div className="d-flex">
          {loading ? (
            <Spinner className="mr-2" color="danger" size="sm" />
          ) : (
            <span>
              <i className="bx bx-shield-quarter" style={{ fontSize: "18px" }}></i>
            </span>
          )}
          <span className="ml-1">{t("Report the error")} </span>
        </div>
      </Button>
    </Alert>
  );
}
