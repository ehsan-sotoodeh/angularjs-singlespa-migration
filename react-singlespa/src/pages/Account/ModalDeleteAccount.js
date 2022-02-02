import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Label } from 'reactstrap';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

import ResponseAlert from '../../common/ResponseAlert';

export default function ModalDeleteAccount(props) {
  const { config, onClose, onSubmit } = props;

  const { t } = useTranslation();

  const formRef = useRef();
  const account = config.account;
  const [show, setShow] = useState(config.show);
  const [isSubmitting, setSubmitting] = useState(false);

  function close() {
    onClose();
  }

  function submit() {
    if (!Object.keys(formRef.current.state.invalidInputs).length) {
      setSubmitting(true);
      onSubmit(account._id);
    }
  }

  useEffect(() => {
    if (config.error) {
      setSubmitting(false);
    } else if (config.succeeded) {
      setSubmitting(false);
      setTimeout(() => setShow(false), 2000);
    } else {
      setShow(config.show);
    }
  }, [config])


  const nameValidation = (name) => {
    if (account && name !== account.name) {
      return t('Account name is not correct')
    }
    return true;
  }

  return (
    <Modal centered={true} isOpen={show} >
      <ModalHeader toggle={close}>{t('Delete Account')}</ModalHeader>

      <AvForm ref={formRef}>
        <ModalBody>
          <ResponseAlert config={config} successMessage="Account deleted succeessfully" />
          <p className="text-center">
            <div>{t('You are about to delete this Account')}!</div>
            <div>{t('Enter the name of the Account to continue')}:</div>
          </p>

          <div className="mb-4">
            <Label>{t('Account Name')}</Label>
            <AvField name="accoutname" type="text" placeholder={t("Enter Account Name")}
              errorMessage={t("Enter Account Name")}
              validate={{
                required: { value: true },
                nameValidation: nameValidation
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>

          <Button type="submit" color="primary" onClick={submit}>
            {t('Delete')}
            {isSubmitting && <Spinner className="ml-2" color="light" size="sm" />}
          </Button>{' '}
          <Button color="secondary" onClick={close}>{t('Cancel')}</Button>
        </ModalFooter>
      </AvForm>
    </Modal>
  );
}