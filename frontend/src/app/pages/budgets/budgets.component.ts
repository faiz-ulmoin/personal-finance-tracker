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
  categories = ['Food', 'Transport', 'Rent', 'Shopping', 'Bills', 'Other'];
  budgets: Budget[] = [];
  currentMonth = new Date().toISOString().substring(0, 7);
  form: Budget = this.emptyForm();

  constructor(private budgetService: BudgetService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.budgetService.getAll(this.currentMonth).subscribe(b => this.budgets = b);
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
