/** "USTO-MB (Master’s Degree in …)" reads better as degree over institution. */
export const splitName = (company: string) => {
  const match = company.match(/^(.*?)\s*\((.*)\)$/);
  return match ? { name: match[2], org: match[1] } : { name: company, org: null };
};
