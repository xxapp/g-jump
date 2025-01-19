declare const Papa: any;

export function extractTransactionList(csvContent: string, identifier: string): string {
  const lines = csvContent.split('\n');
  const headerIndex = lines.findIndex((line) => line.includes(identifier));

  if (headerIndex === -1) {
    return '';
  }

  return lines.slice(headerIndex + 1).join('\n');
}

export function parseCsv<T>(csvData: string): T[] {
  const result = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  return result.data as T[];
} 