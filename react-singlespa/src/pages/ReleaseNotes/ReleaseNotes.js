import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Container,
  Card,
  CardBody,
  Col,
  Row,
  Badge,
} from "reactstrap";

export default function ReleaseNotes() {
  const { t, i18n } = useTranslation();
  const [releaseNotes, setReleaseNotes] = useState([]);

  useEffect(async () => {
    try {
      const { releaseNotes } = await getReleaseNote(i18n.language);
      setReleaseNotes(releaseNotes);
    } catch (error) {
      // if it fails to get the release note in a specific language, it loads the English version
      const { releaseNotes } = await getReleaseNote("en");
      setReleaseNotes(releaseNotes);
    }
  }, []);

  const releaseNotesJsx = releaseNotes.map((note, index) => {
    const tagsJSX = note.tags.map((t, index) => (
      <Badge className="badge bg-primary font-size-12 mr-2" key={"tag" + index}>
        {t}
      </Badge>
    ));

    return (
      <div className="col-xl-8 m-3 mt-5" key={"release" + index}>
        <div>
          <div className="text-center">
            <h4>
              [ {note.version} ] - {note.title}
            </h4>
            <p className="text-muted mb-4">
              <i className="mdi mdi-calendar me-1"></i>{" "}
              {note.date.toUTCString()}
            </p>
          </div>
          <hr />

          <div className="mb-2">{tagsJSX}</div>

          <div className="mt-2">
            <div className="text-muted font-size-14">
              <p>{note.description}</p>
            </div>
            <Module
              title={t("Features")}
              items={note.features}
              icon={"bxs-rocket"}
            />
            <Module
              title={t("Bug Fixes")}
              items={note.fixes}
              icon={"bxs-wrench"}
            />
            <Module
              title={t("Changes")}
              items={note.changes}
              icon={"bx-shuffle"}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="">
      <div className="flex">
        <h3>{t("Release Notes")}</h3>
      </div>
      <Container fluid>
        {/* <Breadcrumbs title="Blog" breadcrumbItem="Blog Details" /> */}
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="pt-3">
                  <div className="row justify-content-center">
                    {releaseNotesJsx}
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

const Module = ({ title, items, icon }) => {
  const itemsJSX = items.map((change, index) => (
    <li key={"module" + index} className="my-1">
      {change}
    </li>
  ));

  return (
    <div className="media py-3">
      <div className="avatar-sm me-3">
        <div className="avatar-title rounded-circle bg-light text-primary h3">
          <i className={"bx " + icon}></i>
        </div>
      </div>
      <div className="media-body ml-3 mt-3">
        <h5 className="font-size-14 mb-3">{title}:</h5>
        <span className="text-muted">
          <ul>{itemsJSX}</ul>
        </span>
      </div>
    </div>
  );
};

const getReleaseNote = async (language) => {
  const filePath = `./${language}/releaseNotes.js`;
  const file = await require(`${filePath}`);
  return file;
};