import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { LoadingController, Platform } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { VaccineInfo, VaccineService } from '../services/vaccine.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab3Page {

  data = "";
  dataResult: VaccineInfo = {
    IsPfizerAvailable : 'false',
    AvailableVaccineTypes: 'none',
    errorCode: '0',
    errorMsg: 'no data',
    loadTime: '0',
    lastModTime: 'now'
  } as VaccineInfo

  constructor(private http: HttpClient, private nativeHttp: HTTP, private plt: Platform,
    private loadingCtrl: LoadingController) { }

  async getDataNativeHttp() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    let nativeCall = this.nativeHttp.get('https://vaneeszt.bluesoft.hu/loadStatus.php', {}, {
      'Content-Type': 'application/json'
    })

    from(nativeCall).pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(data => {
        console.log('native data: ', data.data);
        this.data = JSON.stringify(data.data);
        console.log(this.data);
        this.dataResult.IsPfizerAvailable = JSON.parse(data.data).IsPfizerAvailable;
        this.dataResult.AvailableVaccineTypes = JSON.parse(data.data).AvailableVaccineTypes;
        this.dataResult.errorMsg = JSON.parse(data.data).errorMsg;
        this.dataResult.errorCode = JSON.parse(data.data).errorCode;
        this.dataResult.lastModTime = JSON.parse(data.data).lastModTime;
        this.dataResult.loadTime = JSON.parse(data.data).loadTime;

        console.log(this.dataResult);

      }, err => {
        console.log('JS call error: ', err);
      })
  }
}
