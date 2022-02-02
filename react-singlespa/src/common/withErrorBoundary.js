import React, { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import ErrorFallback from "./ErrorFallback";
import { getBrowserDetails } from "../helpers/utils";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button, Spinner } from "reactstrap";
import { saveLog } from "../services/logService";

export default function (WrappedComponent) {
  // used for higher level components to prevent crash or whole applicationß
  return (props) => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ErrorComponent>
        <WrappedComponent {...props} />
      </ErrorComponent>
    </ErrorBoundary>
  );
}

const ErrorComponent = (props) => {
  const { t } = useTranslation();
  const [errorState, setErrorState] = useState(null);
  const handleError = (error, { asModal, hasReset, hasReport }) => {
    asModal = asModal === false ? false : true; //default as true;
    hasReset = !!hasReset; //default as false;
    hasReport = hasReport === false ? false : true; //default as true;
    setErrorState({ error, asModal, hasReset, hasReport });
  };
  if (errorState) {
    let errorObject = unifyErrors(
      errorState.error,
      t("Oops! Something went wrong")
    );
    if (!errorState.asModal) {
      return (
        <ErrorFallback
          error={errorObject}
          resetErrorBoundary={() => setErrorState(null)}
        />
      );
    }

    handleErrorWithToast(errorObject, errorState.hasReport);
  }
  return (
    <>
      {React.Children.map(props.children, (child) => {
        return React.cloneElement(child, { handleError });
      })}
    </>
  );
};

const handleErrorWithToast = (error, hasReport) => {
  let containerId;
  if (typeof error === "string") {
    containerId = error;
  } else {
    containerId = error?.message || "error";
  }

  toast.clearWaitingQueue({ containerId: containerId });

  toast.error(<ErrorMessage error={error} hasReport={hasReport} />, {
    position: toast.POSITION.TOP_CENTER,
    toastId: containerId,
    closeOnClick: false,
    autoClose: 20000,
  });
};

const ErrorMessage = ({ error, hasReport }) => {
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

  if (typeof error === "string") {
    return <div>{error}</div>;
  }

  const errorDetail = error?.data?.detail;
  return (
    <div>
      {error.message} <br />
      {errorDetail && (
        <div>
          <UncontrolledCollapse toggler="toggler">
            <div className="mt-2 text-muted" style={{ maxWidth: "95%" }}>
              {error.stack}
            </div>
          </UncontrolledCollapse>
          <div>
            <span id="toggler" className="pl-2 pointer">
              <i className="bx bxs-right-arrow" style={{ fontSize: "9px" }} />{" "}
              {t("Details")}...
            </span>
          </div>
        </div>
      )}
      {hasReport && (
        <Button
          outline
          color="danger"
          className="mt-2 ml-2"
          size="sm"
          onClick={report}
          disabled={reportSent || loading}
        >
          <div className="d-flex">
            {loading ? (
              <Spinner className="mr-2" color="danger" size="sm" />
            ) : (
              <span>
                <i
                  className="bx bx-shield-quarter"
                  style={{ fontSize: "14px" }}
                ></i>
              </span>
            )}
            <span className="ml-1">{t("Report the error")} </span>
          </div>
        </Button>
      )}
    </div>
  );
};

const unifyErrors = (error, defaultMessage) => {
  let errorObject = {};
  if (typeof error === "string") {
    errorObject.message = error;
  } else {
    const errorStatus = error?.data?.status ? `(${error?.data?.status})` : "";
    const errorMessage = error.message || error?.data?.title || defaultMessage;
    errorObject = {
      message: errorStatus + errorMessage,
      stack: error?.data?.detail || null,
    };
  }
  return errorObject;
};
