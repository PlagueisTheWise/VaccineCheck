import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subject, timer } from 'rxjs';
import { retry, share, switchMap, takeUntil, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

export type VaccineType =
  | 'Sinopharm'
  | 'Sputnik V'
  | 'AstraZeneca'
  | 'Janssen'
  | 'Pfizer'
  | 'Moderna';

export interface VaccineInfo {
  errorCode?: string;
  errorMsg?: string;
  IsPfizerAvailable?: string;
  lastModTime?: string;
  AvailableVaccineTypes?: string;
  loadTime?: string;
}

@Injectable()
export class VaccineService implements OnDestroy {
  private allVaccines$: Observable<VaccineInfo>;
  private stopPolling = new Subject();
  public resultData: VaccineInfo = {} as VaccineInfo;
  data: any;

  constructor(
    private http: HttpClient,
    private nativeHttp: HTTP,
    private plt: Platform
  ) {
    if (this.plt.is('cordova')) {
      let nativeCall = this.nativeHttp.get(
        'https://vaneeszt.bluesoft.hu/loadStatus.php',
        {},
        {
          'Content-Type': 'application/json',
        }
      );

      this.allVaccines$ = timer(0, 5000).pipe(
        switchMap(async () =>
          from(nativeCall)
            .pipe()
            .subscribe((data) => {
              this.allVaccines$ = JSON.parse(data.data);
              this.resultData.AvailableVaccineTypes = JSON.parse(data.data).AvailableVaccineTypes;
              this.resultData.IsPfizerAvailable = JSON.parse(data.data).IsPfizerAvailable;
              this.resultData.errorCode = JSON.parse(data.data).errorCode;
              this.resultData.errorMsg = JSON.parse(data.data).errorMsg;
              this.resultData.lastModTime = JSON.parse(data.data).lastModTime;
              this.resultData.loadTime = JSON.parse(data.data).loadTime;
              console.log(this.resultData.lastModTime);
            })
        ),
        retry(),
        tap(console.log),
        share(),
        takeUntil(this.stopPolling)
      );
    } else {
      this.allVaccines$ = timer(1, 30000).pipe(
        switchMap(() =>
          http.get<VaccineInfo>('https://vaneeszt.bluesoft.hu/loadStatus.php')
        ),
        retry(),
        tap(console.log),
        share(),
        takeUntil(this.stopPolling)
      );
    }
  }

  public getAllVaccines(): Observable<VaccineInfo> {
    return this.allVaccines$.pipe(
      tap(() => console.log('data sent to subscriber:')),
    );
  }

  ngOnDestroy(): void {
    this.stopPolling.next();
  }
}
