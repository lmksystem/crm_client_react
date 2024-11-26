import React, { useEffect, useState } from "react";
import { FormFeedback, Input } from "reactstrap";
import Dropzone, { useDropzone } from "react-dropzone";
import { SalaryService } from "../../services";

function DropFileComponents({ values = "", setValues = () => {}, touched, errors, label = "" }) {
  const [pdf, setPdf] = useState(null);

  function handleAcceptedFiles(files) {
    setValues(files[0]);
    setPdf(window.URL.createObjectURL(files[0]));
  }

  function handleDeleteFile() {
    setValues(null);
    setPdf(null);
  }

  useEffect(() => {
    if (values) {
      SalaryService.download(values).then((linkPdf) => {
        setPdf(linkPdf);
      });
    }
  }, [values]);

  return (
    <div>
      <Dropzone
        multiple={false}
        accept={{ "application/pdf": [] }}
        onDrop={(acceptedFiles) => {
          handleAcceptedFiles(acceptedFiles);
        }}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              position: "relative",
              zIndex: 0
            }}>
            <div
              className="dropzone dz-clickable"
              style={{
                height: 450,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                zIndex: -2
              }}>
              {pdf && (
                <iframe
                  src={pdf}
                  className="img-fluid"
                  alt="..."
                  onLoad={() => {
                    URL.revokeObjectURL(pdf);
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                    zIndex: -1
                  }}
                />
              )}
              {pdf && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    opacity: 1,
                    zIndex: 0
                  }}>
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteFile}>
                    <i className="ri-delete-bin-2-line"></i>
                    Supprimer le pdf
                  </button>
                </div>
              )}
              {pdf == null && (
                <div
                  className="dz-message needsclick"
                  style={{
                    position: "absolute",
                    backgroundColor: "#00000045",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    padding: 5,
                    zIndex: -1
                  }}
                  {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div
                    className="mb-3"
                    style={{ color: "#FFFFFF" }}>
                    <i className="display-4 ri-upload-cloud-2-fill" />
                  </div>
                  <h4 style={{ color: "#FFFFFF" }}>{label}</h4>
                  <h6 style={{ color: "#FFFFFF" }}>Glisser un pdf ici ou cliquer pour le télécharger.</h6>
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
      {touched && errors ? (
        <FormFeedback
          type="invalid"
          style={{ display: "block" }}>
          {errors}
        </FormFeedback>
      ) : null}
    </div>
  );
}

export default DropFileComponents;
