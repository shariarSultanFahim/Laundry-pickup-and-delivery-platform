export interface PrivacyPolicyData {
  content: string;
  lastUpdatedOn: string;
}

export const defaultPrivacyPolicy: PrivacyPolicyData = {
  content: "<h1 className='text-2xl font-bold text-center'>Privacy Policy Goes Here</h1>",
  lastUpdatedOn: new Date().toISOString()
};
