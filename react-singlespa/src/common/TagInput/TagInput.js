import React, { useState } from "react";
import { Badge } from "reactstrap";
import { useTranslation } from "react-i18next";

import "./TagInput.css";

export default function TagInput({ tags, setTags }) {
  const { t } = useTranslation();

  const [invalid, setInvalid] = useState(false);
  const removeTagData = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const whitelist = /^\w*$/;

  const addTagData = (event) => {
    const newTag = event.target.value.toLowerCase().trim();
    if (newTag.length && whitelist.test(newTag) && !tags.includes(newTag)) {
      setInvalid(false);
      setTags([...tags, newTag]);
      event.target.value = "";
    } else {
      event.target.value = newTag;
      setInvalid(true);
    }
  };

  const handleKeyup = (event) => {
    if (event.key === " ") {
      addTagData(event);
    } else {
      const newTag = event.target.value.toLowerCase().trim();
      setInvalid((!newTag.length || !whitelist.test(newTag)))
    }
  };
  return (
    <div
      className="tag-input"
      style={{ borderColor: invalid ? "red" : "#ced4da" }}
    >
      <input
        type="text"
        onKeyUp={handleKeyup}
        placeholder={t("Press space to add a tag")}
        style={{ textTransform: "lowercase" }}
      />
      <div className="">
        {tags.map((tag, index) => (
          <h6 className="d-inline-block" key={index+tag}>
            <Badge  color="primary" className="ml-1 font-size-11">
              <span className="">{tag}</span>
              <span
                className="ml-2"
                onClick={() => removeTagData(index)}
                style={{ cursor: "pointer" }}
              >
                | x
              </span>
            </Badge>
          </h6>
        ))}
      </div>
    </div>
  );
}
