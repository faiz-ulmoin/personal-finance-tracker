import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;

  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  transactions: Transaction[] = [];

  constructor(private txService: TransactionService) {}

  ngOnInit(): void {
    this.txService.getAll().subscribe(txs => {
      this.transactions = txs;
      this.computeTotals(txs);
    });
  }

  ngAfterViewInit(): void {
    this.txService.getAll().subscribe(txs => this.renderCharts(txs));
  }

  private computeTotals(txs: Transaction[]): void {
    this.totalIncome = txs.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
    this.totalExpense = txs.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
    this.balance = this.totalIncome - this.totalExpense;
  }

  private renderCharts(txs: Transaction[]): void {
    const categoryMap = new Map<string, number>();
    txs.filter(t => t.type === 'EXPENSE').forEach(t => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: Array.from(categoryMap.keys()),
        datasets: [{ data: Array.from(categoryMap.values()), backgroundColor: ['#2563eb','#22c55e','#f59e0b','#ef4444','#a855f7','#14b8a6','#64748b'] }]
      }
    });

    const monthMap = new Map<string, { income: number; expense: number }>();
    txs.forEach(t => {
      const month = t.date.substring(0, 7);
      const entry = monthMap.get(month) || { income: 0, expense: 0 };
      if (t.type === 'INCOME') entry.income += t.amount; else entry.expense += t.amount;
      monthMap.set(month, entry);
    });
    const months = Array.from(monthMap.keys()).sort();

    new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Income', data: months.map(m => monthMap.get(m)!.income), backgroundColor: '#22c55e' },
          { label: 'Expense', data: months.map(m => monthMap.get(m)!.expense), backgroundColor: '#ef4444' }
        ]
      },
      options: { responsive: true }
    });
  }
}
