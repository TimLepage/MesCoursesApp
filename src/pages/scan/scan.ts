import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

export interface ICheckPoint {
  id?: number;
  heure?: string;
  user?: number;
  course?: number;
}

@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  private cp: ICheckPoint;
  private isSaving: Boolean;
  constructor(public navCtrl: NavController, public barcodeScanner: BarcodeScanner, private http: HttpClient) {
    this.barcodeScanner = barcodeScanner;
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<ICheckPoint>>) {
      result.subscribe((res: HttpResponse<ICheckPoint>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  private onSaveSuccess() {
      this.isSaving = false;
  }

  private onSaveError() {
      this.isSaving = false;
  }

  sendData(str: String) {
    if (str.slice(-1) === '}') {
      str = str.slice(0, -1); //enlève le dernier char
    }
    let currentdate = new Date();
    let text: string = str + ',\"heure\":\"' + currentdate.getDate() + '/'
      + (currentdate.getMonth() + 1) + '/'
      + currentdate.getFullYear() + ' @ '
      + currentdate.getHours() + ':'
      + currentdate.getMinutes() + ':'
      + currentdate.getSeconds() + '\"}';
    this.cp = JSON.parse(text);
    this.subscribeToSaveResponse(this.http.post<ICheckPoint>('http://mes-courses-2018.herokuapp.com/api/check-points', this.cp, { observe: 'response' })); // http://192.168.43.102:9000/api/check-points
  }

  scanCode() {
    this.barcodeScanner.scan()
      .then((result) => {
        this.sendData(result.text);
      })
      .catch((error) => {
        alert(error);
      })
  }


}
