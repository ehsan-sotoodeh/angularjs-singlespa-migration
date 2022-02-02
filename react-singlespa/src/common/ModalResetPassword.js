import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label } from 'reactstrap';
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

const ResetPassword = (props) => {
  const { show, onClose, onSubmit } = props;

  const { t } = useTranslation();

  function close() {
    onClose();
  }

  function submit() {
    onSubmit ? onSubmit() : onClose();
  }

  return (
    <Modal isOpen={show} >
      <ModalHeader toggle={close}>{'Reset Password'}</ModalHeader>
      <ModalBody>
        <AvForm>
          <div className="mb-4">
            <Label>{t('Current password')}</Label>
            <AvField
              name="currPassword"
              type="password"
              placeholder={t("Current password")}
              errorMessage={t("Enter password")}
              validate={{ required: { value: true } }}
            />
          </div>
          <div className="mb-3">
            <p>{t('Password must be a minimum of 12 characters and maximum of 24 characters, and includes at least one of each of teh following')}:</p>
            <ul>
              <li>{t('Uppercase letter')}</li>
              <li>{t('Lowercase letter')}</li>
              <li>{t('Symbol')}</li>
              <li>{t('Number')}</li>
            </ul>
          </div>
          <div className="mb-3">
            <Label>{t('New Password')}</Label>
            <AvField
              name="password"
              type="password"
              placeholder={t("Password")}
              validate={{
                required: { value: true, errorMessage: t('Please enter a password') },
                pattern: { value: '^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])', errorMessage: t('New password is not acceptable') },
                minLength: { value: 12, errorMessage: t('Your password must be between x and x characters', { min: 12, max: 24 }) },
                maxLength: { value: 24, errorMessage: t('Your password must be between x and x characters', { min: 12, max: 24 }) }
              }}
            />
          </div>
          <div className="mb-3">
            <AvField
              name="password1"
              type="password"
              placeholder={t("Repeat above password")}
              errorMessage={t("Passwords not matched")}
              validate={{
                required: { value: true },
                match: { value: "password" },
              }}
            />
          </div>
        </AvForm>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={submit}>{t('OK')}</Button>{' '}
        <Button color="secondary" onClick={close}>{t('Cancel')}</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ResetPassword;