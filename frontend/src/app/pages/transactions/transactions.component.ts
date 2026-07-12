import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'];
  expenseCategories = ['Food', 'Transport', 'Rent', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other Expense'];
  editingId: number | null = null;

  form: Transaction = this.emptyForm();

  get categories(): string[] {
    return this.form.type === 'INCOME' ? this.incomeCategories : this.expenseCategories;
  }

  onTypeChange(): void {
    this.form.category = '';
  }

  constructor(private txService: TransactionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.txService.getAll().subscribe(txs => this.transactions = txs);
  }

  emptyForm(): Transaction {
    return { type: 'EXPENSE', category: '', amount: 0, date: new Date().toISOString().substring(0, 10), note: '' };
  }

  onSubmit(): void {
    if (this.editingId) {
      this.txService.update(this.editingId, this.form).subscribe(() => { this.load(); this.cancelEdit(); });
    } else {
      this.txService.create(this.form).subscribe(() => { this.load(); this.form = this.emptyForm(); });
    }
  }

  edit(tx: Transaction): void {
    this.editingId = tx.id!;
    this.form = { ...tx };
  }

  cancelEdit(): void {
    this.editingId = null;
    this.form = this.emptyForm();
  }

  delete(id: number): void {
    if (confirm('Delete this transaction?')) {
      this.txService.delete(id).subscribe(() => this.load());
    }
  }

  exportCsv(): void {
    this.txService.exportCsv().subscribe(blob => this.download(blob, 'transactions.csv'));
  }

  exportPdf(): void {
    this.txService.exportPdf().subscribe(blob => this.download(blob, 'transactions.pdf'));
  }

  private download(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    window.URL.revokeObjectURL(url);
  }
}
