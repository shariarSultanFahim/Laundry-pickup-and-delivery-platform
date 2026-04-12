import { isAxiosError } from "axios";
import { toast } from "sonner";

import type {
  CreateLegalDocumentRequest,
  CreateLegalDocumentResponse,
  GetLegalDocumentNotFoundResponse,
  GetLegalDocumentResponse,
  LegalDocument,
  LegalType
} from "@/types/legal";

import { get, post } from "@/lib/api";

import type { TermsConditionsFormData } from "../schema/terms-conditions.schema";

const TERMS_AND_CONDITIONS_TYPE: LegalType = "TERMS_AND_CONDITIONS";

export async function getTermsConditions(): Promise<LegalDocument | null> {
  try {
    const response = await get<GetLegalDocumentResponse>(`/legal/${TERMS_AND_CONDITIONS_TYPE}`);
    return response.data;
  } catch (error) {
    if (isAxiosError<GetLegalDocumentNotFoundResponse>(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createTermsConditions(data: TermsConditionsFormData): Promise<LegalDocument> {
  try {
    const payload: CreateLegalDocumentRequest = {
      type: TERMS_AND_CONDITIONS_TYPE,
      content: data.content
    };
    const response = await post<CreateLegalDocumentResponse, CreateLegalDocumentRequest>(
      "/legal",
      payload
    );

    toast.success("Terms and conditions saved successfully!", {
      position: "top-center"
    });

    return response.data;
  } catch (error) {
    const message = isAxiosError<{ message?: string }>(error)
      ? (error.response?.data?.message ?? error.message)
      : "Failed to save terms and conditions. Please try again.";

    toast.error(message, {
      position: "top-center"
    });

    throw error;
  }
}
