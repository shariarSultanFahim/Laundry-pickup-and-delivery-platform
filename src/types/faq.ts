export interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQPayload {
  question: string;
  answer: string;
  isActive: boolean;
}

export interface UpdateFAQPayload {
  question?: string;
  answer?: string;
  isActive?: boolean;
}

export interface FAQListResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    totalPage: number;
    page: number;
    limit: number;
  };
  data: FAQ[];
}

export interface FAQResponse {
  success: boolean;
  message: string;
  data: FAQ;
}
