import { FormType, OptionSchemaType, URLParamsType } from "@/types/global";
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const SEARCH_PARAMS: URLParamsType = {
  page: 1,
  per_page: 10,
  search: "",
};
export const ICON_ATTRS = {
  size: 16,
  className: "opacity-60",
  "aria-hidden": true,
};
export const PRODUCT_TYPE = {
  general: "General",
  intermediate: "Intermediate",
};
export const FORM_DATA: FormType = {
  type: "default",
  title: "",
  description: "",
  buttonText: "default",
};
export const EMPTY_OPTIONS_DATA: OptionSchemaType = {
  id: "",
  value: "",
  label: "",
};
export const PR_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_purchase_request",
  },
  {
    id: 2,
    value: "2",
    label: "Approved",
    permissions: "set_status_approved_purchase_request",
  },
  {
    id: 3,
    value: "3",
    label: "Rejected",
    permissions: "set_status_rejected_purchase_request",
  },
];
export const TRANSFER_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
  request_type: string[];
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_transfer",
    request_type: ["stock_in", "stock_out"],
  },
  {
    id: 2,
    value: "2",
    label: "Approved",
    permissions: "set_status_approved_transfer",
    request_type: ["stock_out"],
  },
  {
    id: 3,
    value: "3",
    label: "Rejected",
    permissions: "set_status_rejected_transfer",
    request_type: ["stock_in", "stock_out"],
  },
  {
    id: 6,
    value: "6",
    label: "Received",
    permissions: "set_status_received_transfer",
    request_type: ["stock_in"],
  },
];

export const PO_STATUS_DATA: (OptionSchemaType & {
  permissions: string;
})[] = [
  {
    id: 1,
    value: "1",
    label: "Pending",
    permissions: "set_status_pending_purchase",
  },

  {
    id: 4,
    value: "4",
    label: "Received",
    permissions: "set_status_received_purchase",
  },
];
export const INVOICE_STATUS_DATA: OptionSchemaType[] = [
  {
    id: 1,
    value: "1",
    label: "Unpaid",
  },
  {
    id: 2,
    value: "2",
    label: "Paid",
  },
];
