export type DownloadFileOptions = {
  output: string;
  content: ArrayBuffer;
};

export const downloadFile = (options: DownloadFileOptions): void => {
  const blob = new Blob([options.content], { type: 'application/octet-stream' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = options.output;
  link.click();
  URL.revokeObjectURL(blobUrl);
};
