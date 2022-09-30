export class EntityReference {
  id: string;
  typeName: string;
  constructor(typeName: string, id: string) {
    this.id = id;
    this.typeName = typeName;
  }
}

export class Attachment {
  attachmentId: EntityReference;
  name: string;
  extension: string;
  entityType: string;
  deleted: boolean;
  constructor(
    attachmentId: EntityReference,
    name: string,
    extension: string,
    deleted: boolean
  ) {
    this.attachmentId = attachmentId;
    this.name = name;
    this.extension = extension;
    this.deleted = deleted;
  }
}

export class AttachmentRef {
  id: string;
  type: string;
  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}

export class FileToDownload implements ComponentFramework.FileObject {
  fileContent: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}
