import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from '../models/budget.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private baseUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getAll(month: string): Observable<Budget[]> {
    return this.http.get<Budget[]>(`${this.baseUrl}?month=${month}`);
  }

  create(budget: Budget): Observable<Budget> {
    return this.http.post<Budget>(this.baseUrl, budget);
  }

  update(id: number, budget: Budget): Observable<Budget> {
    return this.http.put<Budget>(`${this.baseUrl}/${id}`, budget);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
