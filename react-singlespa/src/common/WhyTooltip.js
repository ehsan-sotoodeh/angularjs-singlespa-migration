import React, { useState } from "react";
import { Tooltip } from "reactstrap";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function WhyTooltip({ children, tooltipId }) {
  const { t } = useTranslation();

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  tooltipId += "-tooltip";
  return (
    <Link className="text-primary ml-2" to="#">
      <em id={tooltipId}>{t("Why")}?</em>

      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        autohide={false}
        target={tooltipId}
        toggle={toggleTooltip}
      >
        {children}
      </Tooltip>
    </Link>
  );
}
