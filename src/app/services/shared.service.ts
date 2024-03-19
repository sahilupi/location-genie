import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { City } from '../models/find-location.model';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private headerImageUrl = new BehaviorSubject<string>('');
  headerImageUrl$ = this.headerImageUrl.asObservable();

  private isStickyHeader = new Subject<boolean>();
  private isUserLoggedIn = new Subject<boolean>();
  private isHostLoggedIn = new BehaviorSubject<boolean>(false);
  private hasHostRole = new BehaviorSubject<boolean>(false);
  private hideHeader = new Subject<boolean>();
  private selectedProjectListings = new Subject<number[]>();
  private cities = new Subject<City[]>();
  private isProjectTeamChanged = new BehaviorSubject<boolean>(false);
  citiesData: City[] = [];

  constructor() {}

  setStickyHeader(value: boolean): void {
    this.isStickyHeader.next(value);
  }

  getStickyHeader(): Observable<boolean> {
    return this.isStickyHeader.asObservable();
  }

  setUserLoggedIn(value: boolean): void {
    this.isUserLoggedIn.next(value);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.isUserLoggedIn.asObservable();
  }

  setHostLoggedIn(value: boolean): void {
    this.isHostLoggedIn.next(value);
  }

  getHostLoggedIn(): Observable<boolean> {
    return this.isHostLoggedIn.asObservable();
  }

  setHasHostRole(value: boolean): void {
    this.hasHostRole.next(value);
  }

  getHasHostRole(): Observable<boolean> {
    return this.hasHostRole.asObservable();
  }

  updateHeaderImageUrl(url: string) {
    this.headerImageUrl.next(url);
  }

  setHideHeader(value: boolean): void {
    this.hideHeader.next(value);
  }

  getHideHeader(): Observable<boolean> {
    return this.hideHeader.asObservable();
  }

  setSelectedProjectListings(value: number[]): void {
    this.selectedProjectListings.next(value);
  }

  getSelectedProjectListings(): Observable<number[]> {
    return this.selectedProjectListings.asObservable();
  }

  setCities(cities: City[]): void {
    this.cities.next(cities);
  }

  getCities(): Observable<City[]> {
    return this.cities.asObservable();
  }

  setIsProjectTeamChanged(changed: boolean): void {
    this.isProjectTeamChanged.next(changed);
  }

  getIsProjectTeamChanged(): Observable<boolean> {
    return this.isProjectTeamChanged.asObservable();
  }
}
