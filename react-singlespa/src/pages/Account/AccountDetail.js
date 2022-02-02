import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardTitle, Table, Button, Tooltip, Spinner, Label } from 'reactstrap';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faTimes, faCog } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from "react-i18next";

import AccountInfo from './AccountInfo';
import ModalDeleteAccount from './ModalDeleteAccount';

import { deleteAccount } from "../../services/accountService";

export default function AccountDetail(props) {
  const { t } = useTranslation();
  const { account } = props;

  const [mode, setMode] = useState('view');
  const [deleteAccountConfig, setDeleteAccountConfig] = useState({ show: false });

  const history = useHistory();

  async function submitDeleteAccount(accountId) {
    const response = await deleteAccount(accountId);

    if (response.succeeded)  {
      setDeleteAccountConfig({ show: false, succeeded: true });
      setMode('view');
      setTimeout(() => {
        history.push("/admin/account");
      }, 1000);
    } else {
      setDeleteAccountConfig({ ...deleteAccountConfig, error: r });
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="d-flex justify-content-between">
          <CardTitle>
            {t('Account Detail')}
          </CardTitle>
          <div>
            {
              (mode === 'view') &&
              <Button size="sm" outline color="primary" aria-label='edit' title={t('Edit')} onClick={() => setMode('edit')}>
                <FontAwesomeIcon icon={faCog} />
              </Button>
            }
            {
              (mode === 'edit') &&
              <>
                <Button size="sm" outline color="secondary" aria-label='cancel' title={t('Cancel')} className="mr-2" onClick={() => setMode('view')}>
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
                <Button size="sm" outline color="danger" aria-label='delete' title={t('Delete')}
                  onClick={() => setDeleteAccountConfig({ show: true, account: account })}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </Button>
              </>
            }

          </div>
        </CardHeader>
        {
          !(account && account.name) &&
          <div className="d-flex justify-content-center mt-5">
            <Spinner className="mr-2" color="dark" size="lg" />
          </div>
        }
        {
          (account && account.name) &&
          <AccountInfo mode={mode} info={account} />
        }
      </Card>

      <ModalDeleteAccount config={deleteAccountConfig} onClose={() => setDeleteAccountConfig({ show: false })} onSubmit={submitDeleteAccount}></ModalDeleteAccount>
    </>
  )
}