import { ChangeDetectorRef, Component } from '@angular/core';
import { Task } from '../../models/task';
import { Tasks } from '../../core/services/tasks';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  // =========================
  // TASK STATE
  // =========================
  tasks: Task[] = [];

  // Selected task for edit mode
  selected: Task | null = null;

  // Form fields
  title = '';
  description = '';

  // UI filters
  filter = 'all';
  search = '';
  sort = 'title';

  constructor(
    private service: Tasks,                 // 📡 API service for tasks
    private cdr: ChangeDetectorRef,         // 🔄 Force UI refresh when needed
    private snackBar: MatSnackBar           // 🔔 Material snackbar notifications
  ) {
    this.load(); // Load tasks on component start
  }

  // =========================
  // TOAST NOTIFICATION HELPERS
  // =========================

  showSuccess(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 2000,
      panelClass: ['snack-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  showError(msg: string) {
    this.snackBar.open(msg, '', {
      duration: 3000,
      panelClass: ['snack-error'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  // =========================
  // LOAD ALL TASKS
  // =========================
  load() {
    this.service.getAll().subscribe({
      next: (res) => {
        this.tasks = [...res];     // create new reference for change detection
        this.cdr.detectChanges();  // force UI update
      },
      error: () => {
        this.showError('Failed to load tasks');
      }
    });
  }

  // =========================
  // SAVE TASK (CREATE / UPDATE)
  // =========================
  save() {

    // UPDATE EXISTING TASK
    if (this.selected) {

      this.service.update(this.selected.id, {
        id: this.selected.id,
        title: this.title,
        description: this.description,
        isCompleted: this.selected.isCompleted
      }).subscribe({
        next: () => {
          this.showSuccess('Task updated successfully');
          this.reset();
          this.load();
        },
        error: () => {
          this.showError('Failed to update task');
        }
      });

    }

    // CREATE NEW TASK
    else {

      this.service.create({
        title: this.title,
        description: this.description,
        isCompleted: false
      }).subscribe({
        next: () => {
          this.showSuccess('Task created successfully');
          this.reset();
          this.load();
        },
        error: () => {
          this.showError('Failed to create task');
        }
      });

    }
  }

  // =========================
  // EDIT TASK
  // =========================
  edit(task: Task) {
    this.selected = task;
    this.title = task.title;
    this.description = task.description || '';
  }

  // =========================
  // 🗑 DELETE TASK
  // =========================
  delete(id: number) {
    this.service.delete(id).subscribe({
      next: () => {
        this.showSuccess('Task deleted');
        this.load();
      },
      error: () => {
        this.showError('Delete failed');
      }
    });
  }

  // =========================
  // TOGGLE TASK STATUS
  // =========================
  toggle(task: Task) {
    this.service.update(task.id, {
      ...task,
      isCompleted: !task.isCompleted
    }).subscribe({
      next: () => {
        this.showSuccess('Task updated');
        this.load();
      },
      error: () => {
        this.showError('Update failed');
      }
    });
  }

  // =========================
  // RESET FORM
  // =========================
  reset() {
    this.selected = null;
    this.title = '';
    this.description = '';
  }

  // =========================
  // LOGOUT USER
  // =========================
  logout() {
    localStorage.clear();
    window.location.href = '/';
  }

  // =========================
  // FILTER + SEARCH LOGIC
  // =========================
  filteredTasks() {

    let result = this.tasks;

    // Filter completed tasks
    if (this.filter === 'completed') {
      result = result.filter(x => x.isCompleted);
    }

    // Filter pending tasks
    if (this.filter === 'pending') {
      result = result.filter(x => !x.isCompleted);
    }

    // Search by title
    if (this.search) {
      result = result.filter(x =>
        x.title.toLowerCase().includes(this.search.toLowerCase())
      );
    }

    // Sort by title
    return result.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }
}