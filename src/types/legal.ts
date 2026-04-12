export type LegalType = "PRIVACY_POLICY" | "TERMS_AND_CONDITIONS";

export interface LegalDocument {
  id: string;
  type: LegalType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegalErrorPayload {
  statusCode: number;
  isOperational: boolean;
}

export interface GetLegalDocumentResponse {
  success: boolean;
  message: string;
  data: LegalDocument;
}

export interface GetLegalDocumentNotFoundResponse {
  success: false;
  message: string;
  error: LegalErrorPayload;
}

export interface CreateLegalDocumentRequest {
  type: LegalType;
  content: string;
}

export interface CreateLegalDocumentResponse {
  success: boolean;
  message: string;
  data: LegalDocument;
}
