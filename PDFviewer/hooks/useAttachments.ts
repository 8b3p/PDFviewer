import { useState } from "react";
import { EntityReference, FileToDownload, Attachment } from "../classes";
import { IInputs } from "../generated/ManifestTypes";

export default function useAttachments(): {
  getAttachments: (
    reference: EntityReference,
    context: ComponentFramework.Context<IInputs>
  ) => Promise<FileToDownload | undefined>;
  file: FileToDownload;
  isLoading: boolean | undefined;
  isThereData: boolean;
  isError: boolean;
} {
  const [file, setFile] = useState<FileToDownload>({} as FileToDownload);
  const [isLoading, setisLoading] = useState<boolean>();
  const [isThereData, setIsThereData] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  /**
   * This function gets all the attachments of the entity, and sets only the last attachments to the "file" state, and sets the rest of the state variables accordingly.
   * @param reference Holding the entity reference in the form of {id, logicalName}, type EntityReference
   * @param context The context of the component, type ComponentFramework.Context<IInputs>
   * @returns Nothing, it sets the state in the hook, type Promise<void>
   */

  const getAttachments = async (
    reference: EntityReference,
    context: ComponentFramework.Context<IInputs>
  ): Promise<FileToDownload | undefined> => {
    setisLoading(true);
    //webapi query to find all attachments
    let query = `?$select=annotationid,filename,filesize,createdon,mimetype&$filter=filename ne null and _objectid_value eq ${reference.id} and objecttypecode eq '${reference.typeName}' &$orderby=createdon desc`;
    let fileMetaData: Attachment;
    try {
      const result = await context.webAPI.retrieveMultipleRecords(
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
        if (
          item.extension === "pdf" ||
          item.extension === "png" ||
          item.extension === "jpg" ||
          item.extension === "jpeg"
        ) {
          items.push(item);
        }
        //* do something with the items, add to state or something !
      }
      // fileMetaData = items[items.length - 1];
      fileMetaData = items[0];

      try {
        if (fileMetaData === undefined) {
          setisLoading(false);
          setIsThereData(false);
          setIsError(false);
          return;
        }
        const result = await context.webAPI.retrieveRecord(
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
        setFile(file);
        setisLoading(false);
        setIsThereData(true);
        setIsError(false);
        return;
      } catch (e: any) {
        console.error(e);
        setisLoading(false);
        setIsThereData(false);
        setIsError(true);
        return;
      }
    } catch (e: any) {
      console.error(e);
      setisLoading(false);
      setIsThereData(false);
      setIsError(true);
      return;
    }
  };

  return { getAttachments, file, isLoading, isThereData, isError };
}
