import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../../services/events.service';
import { DataTableResource } from 'angular-4-data-table';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
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

  constructor(private router: Router, private eventService: EventService) { }

  ngOnInit() {
    this.getAllEvents();
  }

  public getAllEvents(){
    this.eventService.getEvent().subscribe(res=>{
      this.items = [];
      this.itemResource = new DataTableResource(res);
      this.itemResource.count().then(count => this.itemCount = count);
      res.forEach((val: any) => {
        if(this.defaultMarker && val.latitude != '' && val.longitude != ''){
          this.markers.push({
            lat: Number(val.latitude),
            lng: Number(val.longitude),
            label: '',
            draggable: true
          });
          this.lat=Number(val.latitude);
          this.lng=Number(val.longitude);
          this.defaultMarker = false;
        }
        val.tot_user = val.eventuser.length;
      });
      this.items=res;
      this.allDataList=res;
      if(this.items.length<10){
        this.defaultRec=this.items.length;
      }
      //console.log(this.items);
    })
  }

  public reloadItems(params) {
    //console.log(params);
      this.itemResource.query(params).then(items => this.items = items);
  }

  public deleteEvent(id){
    //console.log(id);
    let confirmMessage = confirm('Do you want to delete?')
    if(confirmMessage){      
      this.eventService.deleteEvent(id).subscribe(res=>{
        this.getAllEvents();
      },err=>{

      })
      let DeljsonData = {"event_id":id};
      this.eventService.deleteAllGrpInterestData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
      this.eventService.deleteAllGrpUserData(DeljsonData).subscribe(res=>{
        
      },err=>{

      });
    }
  }

  public changeStatus(event){    
    let event_status
    if(event.is_active){
      event_status = {
        is_active:false
      }
    }else{
      event_status = {
        is_active:true
      }
    }    
    const confirmMessage = confirm('Do you want to change status?')
    if(confirmMessage ){    
      let editJson = {is_active:event_status.is_active, name:event.name}; 
      this.eventService.editEvent(editJson,event.id).subscribe(res=>{
        this.getAllEvents();
      },err=>{
      })
    }
  }

  public CustomSearch(data: any){
    let searchVal=data.target.value;
    if(searchVal !=''){
      this.items=this.searchPipe(this.allDataList, searchVal);
    }else{
      this.getAllEvents();
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
                  if (item.grpinterest[nestedproperty].interest.name.toString().toLowerCase().includes(toCompare)) {
                      return true;
                  }
                  if (item.grpinterest[nestedproperty].interest.description.toString().toLowerCase().includes(toCompare)) {
                      return true;
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
        if(item.latitude != '' && item.longitude != ''){
          let distance = this.calcDistance(this.lat, this.lng, Number(item.latitude), Number(item.longitude));
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