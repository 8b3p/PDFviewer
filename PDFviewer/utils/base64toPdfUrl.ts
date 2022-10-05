export default function base64toPdfUrl(data: string): string {
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
}
