import React, { useRef } from "react";
import { Card, Col, CardBody, Label } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { useTranslation } from "react-i18next";

import RequiredField from "../../common/RequiredField";

import { Countries } from '../../assets/Globals';

export default function AccountInfo(props) {
  const { mode, onChange, info } = props;

  const { t } = useTranslation();

  const formRef = useRef();

  async function changeHandler(event) {
    const { name, value } = event.target;
    const isValid = await getValidation(name, value);
    const superField = (name === 'name')? null: 'address';
    onChange(name, value, superField, isValid);
  }

  async function getValidation(name, value) {
    await formRef.current._validators[name](value);
    return !Object.keys(formRef.current.state.invalidInputs).length;
  }

  const countryValidation = (value) => {
    if (!value) {
      return t("Select Country");
    }
    return true;
  }

  return (
    <Card>
      <CardBody>
        <AvForm ref={formRef}>
          <div className="row mb-1">
            <Label htmlFor="accountname" className="col-3 col-form-label" >{t('Account Name')} <RequiredField /> </Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="name" id="accountname" className="custom-field" value={info.name} disabled={mode === 'view'} onChange={changeHandler}
                errorMessage={t("Enter Account Name")}
                validate={{ required: { value: true } }}
              />
            </Col>
          </div>
          <div className="row mb-1">
            <Label className="col-12 col-form-label" >{t('Address')}:</Label>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="street" id="street" className="custom-field" value={info.address.street} disabled={mode === 'view'} onChange={changeHandler}
                errorMessage={t("Enter Address")}
                validate={{ required: { value: true } }}
              />
            </Col>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Label htmlFor="street_address" className="col-3 col-form-label" >{t('Address Line')} 2</Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="street_address" id="street_address" className="custom-field" value={info.address.street_address} disabled={mode === 'view'} onChange={changeHandler}
              />
            </Col>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Label htmlFor="city" className="col-3 col-form-label" >{t('City')} <RequiredField /></Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="city" id="city" className="custom-field" value={info.address.city} disabled={mode === 'view'}
                onChange={changeHandler}
                errorMessage={t("Enter City Name")}
                validate={{ required: { value: true } }}
              />
            </Col>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Label htmlFor="province" className="col-3 col-form-label" >{t('Prov/State')} <RequiredField /></Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="province_state" id="province" className="custom-field" value={info.address.province_state} disabled={mode === 'view'} onChange={changeHandler}
                errorMessage={t("Enter Province/State Name")}
                validate={{ required: { value: true } }}
              />
            </Col>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Label htmlFor="postalcode" className="col-3 col-form-label" >{t('Postal Code')} <RequiredField /></Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="text" name="postal_code" id="postalcode" className="custom-field" value={info.address.postal_code} disabled={mode === 'view'} onChange={changeHandler}
                errorMessage={t("Enter Postal/Zip Code")}
                validate={{ required: { value: false } }}
              />
            </Col>
          </div>
          <div className="row mb-1 justify-content-md-end">
            <Label htmlFor="country" className="col-3 col-form-label" >{t('Country')} <RequiredField /></Label>
            <Col sm={9} className="userprofile-field">
              <AvField type="select" name="country" id="country" className="custom-select" value={info.address.country} disabled={mode === 'view'} onChange={changeHandler}
                validate={{ countryValidation: countryValidation }} >
                <option hidden> {info.address.country} </option>
                {
                  Countries.map((element) => {
                    return <option key={element.id} value={element.id} >"{element.id}"-{element.name}</option>
                  })
                }
              </AvField>
            </Col>
          </div>
        </AvForm>
      </CardBody>
    </Card>
  )

}
