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

import type { PrivacyPolicyFormData } from "../schema/privacy-policy.schema";

const PRIVACY_POLICY_TYPE: LegalType = "PRIVACY_POLICY";

export async function getPrivacyPolicy(): Promise<LegalDocument | null> {
  try {
    const response = await get<GetLegalDocumentResponse>(`/legal/${PRIVACY_POLICY_TYPE}`);
    return response.data;
  } catch (error) {
    if (isAxiosError<GetLegalDocumentNotFoundResponse>(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createPrivacyPolicy(data: PrivacyPolicyFormData): Promise<LegalDocument> {
  try {
    const payload: CreateLegalDocumentRequest = {
      type: PRIVACY_POLICY_TYPE,
      content: data.content
    };
    const response = await post<CreateLegalDocumentResponse, CreateLegalDocumentRequest>(
      "/legal",
      payload
    );

    toast.success("Privacy policy saved successfully!", {
      position: "top-center"
    });

    return response.data;
  } catch (error) {
    const message = isAxiosError<{ message?: string }>(error)
      ? (error.response?.data?.message ?? error.message)
      : "Failed to save privacy policy. Please try again.";

    toast.error(message, {
      position: "top-center"
    });

    throw error;
  }
}
