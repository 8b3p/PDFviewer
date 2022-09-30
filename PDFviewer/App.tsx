import * as React from "react";
import { useEffect, useState } from "react";
import { EntityReference, Attachment, FileToDownload } from "./classes";
import { IInputs } from "./generated/ManifestTypes";

export interface props {
  context: ComponentFramework.Context<IInputs>;
  clientWidth: number;
  clientHeight: number;
}

const App = (props: props) => {
  const [file, setFile] = useState<FileToDownload>({} as FileToDownload);
  const [isLoading, setisLoading] = useState<boolean>();
  const [isThereData, setIsThereData] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const getAttachments = async (
    reference: EntityReference
  ): Promise<FileToDownload | undefined> => {
    setisLoading(true);
    //webapi query to find any attachments
    let query = `?$select=annotationid,filename,filesize,createdon,mimetype&$filter=filename ne null and _objectid_value eq ${reference.id} and objecttypecode eq '${reference.typeName}' &$orderby=createdon desc`;
    let fileMetaData: Attachment;
    try {
      const result = await props.context.webAPI.retrieveMultipleRecords(
        "annotation",
        query
      );
      let items: Attachment[] = [];
      for (let i = 0; i < result.entities.length; i++) {
        let ent = result.entities[i];
        let item = new Attachment(
          new EntityReference("annotation", ent["annotationid"].toString()),
          ent["filename"].split(".")[0],
          ent["filename"].split(".")[1].toLowerCase(),
          false
        );
        console.log(item.extension);
        if (item.extension === "pdf") {
          items.push(item);
        }
        //* do something with the items, add to state or something !
      }
      fileMetaData = items[0];
      try {
        console.log(fileMetaData);
        if (fileMetaData === undefined) {
          setisLoading(false);
          setIsThereData(false);
          setIsError(false);
          return;
        }
        const result = await props.context.webAPI.retrieveRecord(
          "annotation",
          fileMetaData.attachmentId.id
        );
        let file: FileToDownload = new FileToDownload();
        file.fileContent =
          fileMetaData.attachmentId.typeName == "annotation"
            ? result["documentbody"]
            : result["body"];
        file.fileName = result["filename"];
        file.fileSize = result["filesize"];
        file.mimeType = result["mimetype"];
        console.log(file);
        setFile(file);
        setisLoading(false);
        setIsThereData(true);
        setIsError(false);
        return file;
      } catch (e: any) {
        console.error(e);
        setisLoading(false);
        setIsThereData(false);
        setIsError(true);
        return {} as FileToDownload;
      }
    } catch (e: any) {
      console.error(e);
      setisLoading(false);
      setIsThereData(false);
      setIsError(true);
      return {} as FileToDownload;
    }
  };

  const base64ToArrayBuffer = (data: string): Uint8Array => {
    console.log(data);
    const bString = window.atob(data);
    const bLength = bString.length;
    const bytes = new Uint8Array(bLength);
    for (let i = 0; i < bLength; i++) {
      let ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  };

  const base64toPdfUrl = (data: string): string => {
    const bString = window.atob(data);
    const bLength = bString.length;
    const bytes = new Uint8Array(bLength);
    for (let i = 0; i < bLength; i++) {
      let ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    const bufferArray = bytes;
    const blobStore = new Blob([bufferArray], { type: "application/pdf" });
    const file = window.URL.createObjectURL(blobStore);
    return file;
  };

  const requestURL = (data: string) => {
    const url =
      base64toPdfUrl(data) + "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0";
    console.log(url);
    return url;
  };

  useEffect(() => {
    let reference: EntityReference = new EntityReference(
      (props.context as any).page.entityTypeName,
      (props.context as any).page.entityId
    );
    if ((props.context as any).page.entityId != null) {
      getAttachments(reference);
    }
  }, []);

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
      ) : (
        <embed
          src={requestURL(file.fileContent)}
          type='application/pdf'
          width={props.clientWidth}
          height={props.clientWidth * 2.6}
        />
      )}
    </div>
  );
};

export default App;
