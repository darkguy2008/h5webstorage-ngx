import { Component, OnInit } from '@angular/core';
import { LocalStorage, StorageProperty } from 'h5webstorage-ngx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'lib';

  @StorageProperty() prop: any;

  constructor(private ls: LocalStorage) { }

  ngOnInit() {
    console.log(":D");
    this.prop = 'OMG';
    setTimeout(() => {
      this.prop = undefined;
    }, 5000);
  }

}
