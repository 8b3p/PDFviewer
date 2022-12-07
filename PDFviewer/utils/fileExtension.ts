export const GetFileExtension = (fileName: string): string => {
  return <string>fileName.split(".").pop();
};

export const TrimFileExtension = (fileName: string): string => {
  return <string>fileName.split(".")[0];
};
