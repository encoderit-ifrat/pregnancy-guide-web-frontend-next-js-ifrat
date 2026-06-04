import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { serialize } from "object-to-formdata";

export type FileTypeForTemp = {
  file?: File | string;
};

export const useFileUploadTempFolder = () => {
  return useMutation({
    mutationKey: ["/file-upload/single"],
    mutationFn: (body: FileTypeForTemp) => {
      const formData = serialize(body, {
        indices: true, // Use indices for arrays: babies[0], babies[1]
        nullsAsUndefineds: false, // Keep nulls as nulls
      });

      return api.post("/file-upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
};
