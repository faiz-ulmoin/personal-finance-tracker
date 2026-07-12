export interface Budget {
  id?: number;
  category: string;
  monthlyLimit: number;
  month: string; // format YYYY-MM
  spent?: number;
}
