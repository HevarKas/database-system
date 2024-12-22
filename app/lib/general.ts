export const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const getDateRange = (timeRange: string) => {
    const today = new Date();
    let from = today;
    const to = today;

    switch (timeRange) {
      case 'week':
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from = new Date(today);
        from.setMonth(today.getMonth() - 1);
        break;
      case 'year':
        from = new Date(today);
        from.setFullYear(today.getFullYear() - 1);
        break;
      case 'day':
      default:
        from = today;
        break;
    }
  
    const formattedFrom = formatDate(from);
    const formattedTo = formatDate(to);
    
    return { from: formattedFrom, to: formattedTo };
};


export const convertArabicToEnglishNumbers = (input: string) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = input;
  arabicNumbers.forEach((arabic, index) => {
    result = result.replace(new RegExp(arabic, 'g'), englishNumbers[index]);
  });
  return result;
};

export const filterNumericInput = (input: string) => {
  return input.replace(/[^0-9٠-٩]/g, '');  // Remove any non-numeric characters except Arabic numerals
};