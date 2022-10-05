import * as React from "react";
import { useEffect } from "react";
import { EntityReference } from "./classes";
import { IInputs } from "./generated/ManifestTypes";
import useAttachments from "./hooks/useAttachments";
import requestUrlPdf from "./utils/requestURL";

export interface props {
  context: ComponentFramework.Context<IInputs>;
  clientWidth: number;
  clientHeight: number;
}

const App = (props: props) => {
  const { getAttachments, file, isLoading, isThereData, isError } =
    useAttachments();

  useEffect(() => {
    let reference: EntityReference = new EntityReference(
      (props.context as any).page.entityTypeName,
      (props.context as any).page.entityId
    );
    if ((props.context as any).page.entityId != null) {
      getAttachments(reference, props.context);
    }
  }, [props.context]);

  const onError = (e: Error) => {
    console.error(e);
  };

  return (
    <div className='container'>
      {isLoading ? (
        <>Loading the file</>
      ) : isError ? (
        <>Couldn't show documents, please try again</>
      ) : !isThereData ? (
        <>There is no documents to show</>
      ) : file.mimeType === "application/pdf" ? (
        <embed
          src={requestUrlPdf(file.fileContent)}
          type={file.mimeType}
          width={props.clientWidth}
          height={props.clientWidth * 2.6}
        />
      ) : file.mimeType === "image/png" || "image/jpeg" || "image/jpg" ? (
        <img src={requestUrlPdf(file.fileContent)} width={props.clientWidth} />
      ) : (
        <>This file type is not supported</>
      )}
    </div>
  );
};

export default App;
