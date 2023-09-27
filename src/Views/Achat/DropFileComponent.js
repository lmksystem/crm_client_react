import React from "react";
import { FormFeedback } from "reactstrap";
import Dropzone, { useDropzone } from "react-dropzone";
// import FileService from "../services/FileService";
import { ToastContainer, toast } from "react-toastify";
// import { api } from "../config";

function DropFileComponents({
  values = [],
  setValues = () => {},
  touched,
  errors,
  label = "",
}) {
  function handleAcceptedFiles(files) {
    let copyValues = {...values};
    let newArray = copyValues?.files?.concat(files);
    setValues({...values,files:newArray});
  }

  function deleteByIndex(index) {
    let temporyArrayForDelete = {...values};
    temporyArrayForDelete.files.splice(index, 1);
    setValues({...values,files:temporyArrayForDelete.files});

  }

  return (
    <div>
      <ToastContainer limit={1} closeButton={false} />
      <Dropzone
        accept={{
          "application/pdf": [".pdf"],
        }}
        onDrop={(acceptedFiles) => {
          handleAcceptedFiles(acceptedFiles);
        }}
        multiple={true}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              position: "relative",
            }}
          >
            <div
              className="dropzone dz-clickable"
              style={{
                height: 200,
                position: "relative",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
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
                }}
                {...getRootProps()}
              >
                <div className="mb-3" style={{ color: "#FFFFFF" }}>
                  <i className="display-4 ri-upload-cloud-2-fill" />
                </div>
                <h4 style={{ color: "#FFFFFF" }}>{label}</h4>
                <h6 style={{ color: "#FFFFFF" }}>
                  Glisser {"un pdf"} ici ou cliquer pour {"le"} télécharger.
                </h6>
              </div>
            </div>
          </div>
        )}
      </Dropzone>
      {touched && errors ? (
        <FormFeedback type="invalid" style={{ display: "block" }}>
          {"Veuillez choisir un/plusieurs fichier(s)"}
        </FormFeedback>
      ) : null}
      <div
        style={{
          height: "200px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {values?.files?.map((item, index) => (
          <div
            className="d-inline-flex d-flex justify-content-between align-items-center"
            style={{ alignItems: "center", height: 60 }}
            key={index}
          >
            <div
              style={{
                width: "80%",
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                padding: 5,
                backgroundColor: "#4bacc7",
                borderRadius: 5,
              }}
            >
              {" "}
              <i
                style={{ padding: 2, color: "white" }}
                className=" las la-file-alt "
              ></i>{" "}
              <p className="m-0 text-white">{item.name}</p>
            </div>
            <div
              style={{
                display: "flex",
                width: "20%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <i
                onClick={() => {
                  deleteByIndex(index);
                }}
                className="ri-delete-bin-fill align-bottom me-2 text-muted"
              ></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropFileComponents;
