export interface TermsConditionsData {
  content: string;
  lastUpdatedOn: string;
}

export const defaultTermsConditions: TermsConditionsData = {
  content: '<h1 className="text-2xl font-bold">Default Terms and Conditions</h1>',
  lastUpdatedOn: new Date().toISOString()
};
