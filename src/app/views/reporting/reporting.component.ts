import { Component, OnInit } from '@angular/core';
//import {Message} from 'primeng/components/common/api';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit {
  dataday: any;
  datamonth: any;
  datayearly: any;
  currentdate: Date;
  dayArr:Array <any> = [];
  dayWiseUserArr:Array <any> = [];
  dayWiseEventArr:Array <any> = [];
  monthWiseUserArr:Array <any> = [];
  monthWiseEventArr:Array <any> = [];
  //msgs: Message[];

  constructor() {   
    this.currentdate = new Date();
  }

  ngOnInit() {
    this.dayWiseData();
    this.monthWiseData();
    this.yearlyData();
  }

  public dayWiseData() {
    
    let todayDay = this.currentdate.getDate();
    for(let day = 1; day <= todayDay ; day++){
      this.dayArr.push(day);
    }
    this.dayArr.forEach((val: any) => {
      this.dayWiseUserArr.push(this.RandomNum(1, 100));
      this.dayWiseEventArr.push(this.RandomNum(1, 200));
    });
    
    this.dataday = {
        //labels: ['1', '2', '3', '4', '5', '6', '7'],
        labels: this.dayArr,
        datasets: [
            {
                label: 'User',
                //data: [65, 59, 80, 81, 56, 55, 40],
                data: this.dayWiseUserArr,
                fill: false,
                borderColor: '#4bc0c0'
            },
            {
                label: 'Event',
                data: this.dayWiseEventArr,
                fill: false,
                borderColor: '#565656'
            }
        ]
    }
  }

  public monthWiseData() {
    let dateofMonth = new Date();
    let months = [],
        monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    //let getcurMonth = this.currentdate.getMonth() + 1;
    dateofMonth.setMonth(dateofMonth.getMonth() - 11);
    for(let i = 0; i < 12; i++) {
        months.push(monthNames[dateofMonth.getMonth()] + ' ' + dateofMonth.getFullYear());      dateofMonth.setMonth(dateofMonth.getMonth() + 1);
        this.monthWiseUserArr.push(this.RandomNum(1, 90));
        this.monthWiseEventArr.push(this.RandomNum(1, 150));
    }


    this.datamonth = {
        labels: months,
        datasets: [
            {
                label: 'User',
                data: this.monthWiseUserArr,
                fill: false,
                borderColor: '#4bc0c0'
            },
            {
                label: 'Event',
                data: this.monthWiseEventArr,
                fill: false,
                borderColor: '#565656'
            }
        ]
    }
  }

  public yearlyData() {
    let getFullYear = this.currentdate.getFullYear();
    this.datayearly = {
        labels: ['2012', '2013', '2014', '2015', '2016', '2017', '2018'],
        datasets: [
            {
                label: 'User',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#4bc0c0'
            },
            {
                label: 'Event',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: '#565656'
            }
        ]
    }
    
  }

  public RandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // public selectData(event) {
  //   this.msgs = [];
  //   this.msgs.push({severity: 'info', summary: 'Data Selected', 'detail': this.data.datasets[event.element._datasetIndex].data[event.element._index]});
  // }
}
