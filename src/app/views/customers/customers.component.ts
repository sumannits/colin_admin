import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CustomerService } from '../../services/customer.service';
import { DataTableResource } from 'angular-4-data-table';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customerList=[];
  itemResource:any;
  items = [];
  itemCount = 0;
  public defaultRec:number=10;
  public allDataList = [];

  public zoom: number = 9;
  public lat: number = 51.673858;
  public lng: number = 7.815982;
  public markers: marker[] =[];
  public defaultMarker:boolean = true;
  public radious: number = 20000;

  constructor(private router: Router, private customerService: CustomerService) { }

  ngOnInit() {
    this.getAllCustomers();
  }

  public getAllCustomers(){
    this.customerService.getCustomer().subscribe(res=>{
      this.items = [];
      res.forEach((val: any) => {
        if(this.defaultMarker && val.lat != '' && val.lng != ''){
          this.markers.push({
            lat: Number(val.lat),
            lng: Number(val.lng),
            label: '',
            draggable: true
          });
          this.lat=Number(val.lat);
          this.lng=Number(val.lng);
          this.defaultMarker = false;
        }
      });
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      this.items=res;
      this.allDataList=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
    })
  }

  public reloadItems(params) {
    //console.log(params);
      this.itemResource.query(params).then(items => this.items = items);
  }

  /*public rowClick(rowEvent) {
      //console.log('Clicked: ' + rowEvent.row.item.name);
  }

  public rowDoubleClick(rowEvent) {
      //alert('Double clicked: ' + rowEvent.row.item.name);
  }*/

  //public rowTooltip(item) { return item.name; }

  public deleteCustomer(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.customerService.deleteCustomer(id).subscribe(res=>{
        this.customerService.getCustomerNodsList(id).subscribe((res1)=>{
          if(res1.length>0)
          {
            this.customerService.deleteCustomerNode(res1[0].id).subscribe((res2)=>{

            })
          }
        })
        this.getAllCustomers();
      },err=>{

      })
    }
  }

  public changeStatus(customer){    
    //console.log(customer);
    let customer_status
    if(customer.is_active){
      customer_status = {
        is_active:0
      }
    }else{
      customer_status = {
        is_active:1
      }
    }    
    const confirmMessage = confirm('Do you want to change status?')
    if(confirmMessage ){      
      this.customerService.editCustomer(customer_status,customer.id).subscribe(res=>{
        this.getAllCustomers();
      },err=>{
      })
    }
  }


  public CustomSearch(data: any){
    let searchVal=data.target.value;
    //console.log(searchVal);
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getAllCustomers();
    }
  }

  public searchPipe(items, sdata){
      const /** @type {?} */ toCompare = sdata.toLowerCase();
      return items.filter(function (item) {
          for (let /** @type {?} */ property in item) {
              if (item[property] === null) {
                  continue;
              }
              if (item[property].toString().toLowerCase().includes(toCompare)) {
                  return true;
              }
              if (item.grpinterest.length > 0) {
                for (let /** @type {?} */ nestedproperty in item.grpinterest) {
                  if (item.grpinterest[nestedproperty].interest_text && item.grpinterest[nestedproperty].interest_text != null && item.grpinterest[nestedproperty].interest_text.toString().toLowerCase().includes(toCompare)) {
                      return true;
                  }
                  if(item.grpinterest[nestedproperty].interestId != null){
                    if (item.grpinterest[nestedproperty].interest.name && item.grpinterest[nestedproperty].interest.name != null && item.grpinterest[nestedproperty].interest.name.toString().toLowerCase().includes(toCompare)) {
                        return true;
                    }
                    //console.log(item.grpinterest[nestedproperty].interest.description);
                    //console.log(toCompare);
                    if (item.grpinterest[nestedproperty].interest.description !='' && item.grpinterest[nestedproperty].interest.description !== null && toCompare != null) {
                      //console.log(item.grpinterest[nestedproperty].interest);
                      //console.log(item.grpinterest[nestedproperty].interest.description);
                        if (item.grpinterest[nestedproperty].interest.description.toString().toLowerCase().includes(toCompare)) {
                            return true;
                        }
                    }
                  }
                }
              }
          }
          return false;
      });
  }


  public markerDragEnd(m: marker, $event: MouseEvent) {
    //console.log('dragEnd', m, $event);
    let changeLat=Number($event.coords.lat);
    let changeLong=Number($event.coords.lng);
    this.lat=changeLat;
    this.lng=changeLong;
    this.zoom = 9;
    this.filterDataRespectToLoc();
    
  }

  public circleDragEnd($event:MouseEvent) {
    this.markers[0].lat = $event.coords.lat;
    this.markers[0].lng = $event.coords.lng;
    this.lat=$event.coords.lat;
    this.lng=$event.coords.lng;
    //this.zoom = 8;
    this.filterDataRespectToLoc();
  }
  
  public radiousChangeMap(event) {
    this.radious = event;
    this.filterDataRespectToLoc();
  }

  public zoomChangeEvent(event) {
    this.zoom = event;
    //console.log(event);
  }
  
  public filterDataRespectToLoc(){
    let distanceInKm = this.radious / 1000 ; 
    //console.log(distanceInKm);
    if(this.allDataList.length>0){
      this.items=this.allDataList.filter(item => {
        if(item.lat != '' && item.lng != ''){
          let distance = this.calcDistance(this.lat, this.lng, Number(item.lat), Number(item.lng));
          if (distance < distanceInKm) {
            return item;
          }
        }
      });
    }
  }

  calcDistance(lat1, lon1, lat2, lon2) {
    let R = 6371; // km
    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);
    let latitude1 = this.toRad(lat1);
    let latitude2 = this.toRad(lat2);

    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latitude1) * Math.cos(latitude2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    return d;
  }


  toRad(Value) {
    return Value * Math.PI / 180;
  }
}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}