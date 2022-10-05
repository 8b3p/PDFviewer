import base64toPdfUrl from "./base64toPdfUrl";

export default function requestUrlPdf(data: string) {
  const url =
    base64toPdfUrl(data) + "#toolbar=0&navpanes=0&scrollbar=0&statusbar=0";
  return url;
}
