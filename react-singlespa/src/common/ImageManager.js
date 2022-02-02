import React from 'react';
import ReactFileReader from 'react-file-reader';
import { Row, Col, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-regular-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";

const SimpleImageManager = (props) => {
  const { mode, user, defaultImage, onError, onUpload, onClear, imageClass, buttonClass, btnContainerClass } = props;

  return (
    <Row md={1}>
      <Col>
        <img className={imageClass} alt="Not Found" src={user.avatar ? user.avatar : defaultImage}
          onError={onError} />
      </Col>
      <Col className={btnContainerClass}>
        {mode === 'edit' &&
          <>
            <ReactFileReader base64={true} handleFiles={onUpload}>
              <Button className={buttonClass}><FontAwesomeIcon icon={faUpload}></FontAwesomeIcon></Button>
            </ReactFileReader>
            {onClear && user.avatar && user.avatar !== defaultImage &&
              <Button color="danger" className={buttonClass} onClick={onClear}><FontAwesomeIcon icon={faWindowClose} /></Button>
            }
          </>
        }
      </Col>
    </Row>
  )
}

const DragnDropImageManager = (props) => {
  const { mode, avatar, defaultImage, onError, onUpload, onClear,imageClass } = props;
  const { t } = useTranslation()

  function handleAcceptedFiles(files) {
    files.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        onUpload(reader.result);
      }
      // reader.readAsArrayBuffer(file)
      reader.readAsDataURL(file);
    })
  }
  return (
    <Row>
      <Col sm={4}>
        <div style={{ position: 'relative' }} className="avatar-lg ">
          {mode === 'edit' && avatar && avatar !== defaultImage &&
            <Button title="Remove Image" className="close close-image" onClick={onClear}>
              <span>x</span>
            </Button>
          }
          <img src={avatar || defaultImage} alt="" className={imageClass} onError={onError} />
        </div>
      </Col>
      <Col sm={8}>
        <div style={{maxWidth: '30rem'}}>
          {mode === 'edit' &&
            <Dropzone onDrop={acceptedFiles => { handleAcceptedFiles(acceptedFiles) }} >
              {({ getRootProps, getInputProps }) => (
                <div className="dropzone col" style={{ minHeight: '30px' }}>
                  <div style={{ padding: '1px' }} className="dz-message needsclick mt-2" {...getRootProps()} >
                    <input {...getInputProps()} />
                    <div>
                      <i className="display-5 text-muted bx bxs-cloud-upload" />
                    </div>
                    <h6>{t('Drop files here or click to upload')}.</h6>
                  </div>
                </div>
              )}
            </Dropzone>
          }

        </div>
      </Col>
    </Row>
  )
}

export { DragnDropImageManager, SimpleImageManager };