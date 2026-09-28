import { axiosClient } from "./axiosClient";

export const reportApi = {
  // Streams a PDF binary (not JSON), so this needs responseType: "blob" and
  // triggers a browser download directly rather than returning JSON data.
  download: async (jobId) => {
    const res = await axiosClient.get("/reports/download", {
      params: jobId ? { jobId } : {},
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `career-compass-report-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
};