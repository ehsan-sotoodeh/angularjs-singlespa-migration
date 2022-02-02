import React from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "reactstrap";

export default function Loading({ message }) {

  return (
    <div className="">
      <center>
        <Spinner size="md" className="pt-4" />
        {message && (
          <span className="ml-3 font-size-16">{message}</span>
        )}
      </center>
    </div>
  );
}
