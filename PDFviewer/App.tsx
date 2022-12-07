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
  const { context, clientWidth } = props;
  const { getAttachments, file, isLoading, isThereData, isError } =
    useAttachments();

  useEffect(() => {
    let reference: EntityReference = new EntityReference(
      (context as any).page.entityTypeName,
      (context as any).page.entityId
    );
    if ((context as any).page.entityId != null) {
      getAttachments(reference, context);
    }
  }, [context]);

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
          width={clientWidth}
          height={clientWidth * 1.3}
          onError={e => {
            console.log(e);
          }}
        />
      ) : file.mimeType === "image/png" || "image/jpeg" || "image/jpg" ? (
        <img src={requestUrlPdf(file.fileContent)} width={clientWidth} />
      ) : (
        <>This file type is not supported</>
      )}
    </div>
  );
};

export default App;
