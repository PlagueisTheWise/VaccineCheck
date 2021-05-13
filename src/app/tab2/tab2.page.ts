import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { VaccineInfo, VaccineService } from '../services/vaccine.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tab2Page {
  vaccineInfo$: Observable<VaccineInfo>;
  vaccines: VaccineInfo = {} as VaccineInfo;

  constructor(public vaccineService: VaccineService) {
    console.log('-------------------- STARTING --------------------');
    this.vaccineInfo$ = this.vaccineService.getAllVaccines();
    this.vaccines = this.vaccineService.resultData;
  }
}
