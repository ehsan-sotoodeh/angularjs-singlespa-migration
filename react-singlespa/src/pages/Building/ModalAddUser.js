import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Label } from 'reactstrap';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

import { addBuildingsUser } from '../../services/buildingService';
import ResponseAlert from '../../common/ResponseAlert';
import { PermissionOptions } from '../../assets/Globals';

export default function ModalAddUser(props) {
  const { show, onClose, onSubmit, selectedRows, users } = props;

  const { t } = useTranslation();

  const formRef = useRef();
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState(1);
  const [isSubmitting, setSubmitting] = useState(false);
  const [role, setRole] = useState();
  const [emailValidation, setEmailValidation] = useState(false);
  const [currentEmails, setCurrentEmails] = useState([]);

  function close() {
    onClose();
  }

  async function submit() {
    setSubmitting(true);
    const params = {
      building_ids: selectedRows['building'],
      email: email,
      role: role
    };
    
    const response = await addBuildingsUser(params);
    setSubmitting(false);
    onSubmit(response);
  }

  useEffect(() => {
    setCurrentEmails(users && users.map(e => e.email) || []);
    setStage(1);
    setEmailValidation(false);
    setEmail('');
    setRole(undefined);
  }, [show]);



  function selChangeHandler(event) {
    setRole(event.target.value);
  }

  async function emailChangeHandler(event) {
    const { name, value } = event.target;
    setEmail(value);
    const isValid = await formRef.current._validators[name](value);
    setEmailValidation(isValid === true);
  }

  const existenceValidation = (email) => {
    if (email && currentEmails.includes(email.trim())) {
      return t('Email already exists in permission table')
    }
    return true;
  }

  return (
    <Modal centered={true} isOpen={show} >
      <ModalHeader toggle={close}>{t('Add User to Building(s)')}</ModalHeader>

      <AvForm ref={formRef}>
        <ModalBody>
          {stage === 1 &&
            <>
              <p>
                Enter the email address of the User:
              </p>
              <Label>{t('User Email')}:</Label>
              <AvField name="email" type="email" placeholder={"example@example.com"}
                onChange={emailChangeHandler}
                value={email}
                data-testid="email-input"
                errorMessage={t("Email not valid")}
                validate={{
                  required: { value: true },
                  email: { value: true },
                  existenceValidation: existenceValidation
                }}
              />
            </>
          }

          {stage === 2 &&
            <>
              <p>
                Select permission level:
              </p>
              <p>
                (Note: this can be changed on a per building basis later)
              </p>
              <AvField type="select" name="permission" id="permission" className="custom-select" value={role} onChange={selChangeHandler} >
                <option hidden> -- {t('select an option')} -- </option>
                {
                  PermissionOptions.map((element) => {
                    return <option key={element.id} value={element.id} >{element.name}</option>
                  })
                }
              </AvField>
            </>
          }
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={close}>{t('Cancel')}</Button>

          {stage === 1 &&
            <Button type="button" color="primary" disabled={!emailValidation} onClick={() => setStage(2)}>
              {t('Next')}
            </Button>
          }

          {stage === 2 &&
            <Button type="submit" color="primary" disabled={!role || isSubmitting} onClick={submit}>
              {isSubmitting &&
                <Spinner className="mr-2" size="sm" />
              }
              {t('Save')}
            </Button>
          }

        </ModalFooter>
      </AvForm>
    </Modal>
  );
}