/**
 * Formats CPF with mask (xxx.xxx.xxx-xx) but keeps only numbers in state
 */
export const formatCPF = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Apply CPF mask
    let formattedValue = numericValue;
    if (numericValue.length > 3) {
      formattedValue = numericValue.slice(0, 3) + '.' + numericValue.slice(3);
    }
    if (numericValue.length > 6) {
      formattedValue = formattedValue.slice(0, 7) + '.' + numericValue.slice(6);
    }
    if (numericValue.length > 9) {
      formattedValue = formattedValue.slice(0, 11) + '-' + numericValue.slice(9, 11);
    }
    
    return formattedValue;
  };
  
  /**
   * Formats CEP with mask (xxxxx-xxx) but keeps only numbers in state
   */
  export const formatCEP = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Apply CEP mask
    let formattedValue = numericValue;
    if (numericValue.length > 5) {
      formattedValue = numericValue.slice(0, 5) + '-' + numericValue.slice(5);
    }
    
    return formattedValue;
  };
  
  /**
   * Removes all non-numeric characters from a string
   */
  export const getNumericValue = (value: string): string => {
    return value.replace(/\D/g, '');
  };