import { Component, EventEmitter, Inject, Input, Output, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'home-component',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {



  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnInit(): void {
    this.renderer.addClass(this.document.body, 'home-background');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'home-background');
  }
}
