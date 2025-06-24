import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

export interface ColumnConfig {
  key: string;
  header: string;
  sortable?: boolean;
  pipe?: any;
  pipeArgs?: any[];
  isBoolean?: boolean;
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  standalone: false,
})
export class GenericTableComponent {
  private _data: any[] = [];

  @Input()
  set data(data: any[]) {
    this._data = data;
    this.dataSource.data = this._data;
  }
  get data(): any[] {
    return this._data;
  }

  @Input() columnConfig: ColumnConfig[] = [];
  @Input() isLoading = false;
  @Input() noDataMessage = 'Nenhum dado encontrado.';

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<any>();

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort)
  set sort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  get displayedColumns(): string[] {
    return [...this.columnConfig.map(c => c.key), 'actions'];
  }

  onEdit(element: any): void {
    console.log('Edit:', element);
    this.edit.emit(element);
  }

  onDelete(element: any): void {
    this.delete.emit(element);
  }

  onStatusChange(event: MatSlideToggleChange, element: any): void {
    this.statusChange.emit(element);
  }
}
