import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { BudgetService } from '../../core/services/budget.service';
import { Budget } from '../../core/models/budget.model';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent implements OnInit {
  categories = ['Food', 'Transport', 'Rent', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other Expense'];
  budgets: Budget[] = [];
  viewDate = new Date();
  form: Budget = this.emptyForm();

  get currentMonth(): string {
    return this.viewDate.toISOString().substring(0, 7);
  }

  get monthLabel(): string {
    return this.viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get isCurrentMonth(): boolean {
    const now = new Date();
    return this.viewDate.getFullYear() === now.getFullYear() && this.viewDate.getMonth() === now.getMonth();
  }

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.budgetService.getAll(this.currentMonth).subscribe(b => this.budgets = b);
  }

  changeMonth(offset: number): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + offset, 1);
    this.form = this.emptyForm();
    this.load();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.form = this.emptyForm();
    this.load();
  }

  emptyForm(): Budget {
    return { category: '', monthlyLimit: 0, month: this.currentMonth };
  }

  onSubmit(): void {
    this.budgetService.create(this.form).subscribe(() => { this.load(); this.form = this.emptyForm(); });
  }

  delete(id: number): void {
    this.budgetService.delete(id).subscribe(() => this.load());
  }

  percentUsed(b: Budget): number {
    if (!b.spent || !b.monthlyLimit) return 0;
    return Math.min((b.spent / b.monthlyLimit) * 100, 100);
  }

  isOverBudget(b: Budget): boolean {
    return !!b.spent && b.spent > b.monthlyLimit;
  }
}
