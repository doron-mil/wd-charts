import {OnDestroy, OnInit} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';

export class BaseComponent implements OnInit, OnDestroy {

  protected onDestroy$ = new Subject<boolean>();

  ngOnInit() {
    this.listenForUpdates();
    this.hookOnInit();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  protected listenForUpdates() {
  }

  protected hookOnInit() {
  }
}
