import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export type FileTypeForTemp = {
  file?: File;
};

export const useFileUploadTempFolder = () => {
  return useMutation({
    mutationKey: ["/file-upload/single"],
    mutationFn: (body: FileTypeForTemp) => {
      const formData = new FormData();
      if (body.file instanceof File) {
        formData.append("file", body.file);
      }
      return api.post("/file-upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};
