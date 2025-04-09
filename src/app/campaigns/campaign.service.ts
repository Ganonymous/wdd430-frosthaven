import { Injectable } from '@angular/core';
import { Campaign } from './campaign.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  campaigns: Campaign[] = [];
  focusCampaign: Campaign = null;

  campaignListChangedEvent = new Subject<Campaign[]>;
  focusCampaignChangedEvent = new Subject<Campaign>;

  constructor(private http: HttpClient) {
    this.retrieveCampaigns();
  }

  retrieveCampaigns(){
    this.http.get('http://localhost:3000/campaigns').subscribe({
      next: (campaigns: Campaign[]) => {
        this.campaigns = campaigns;
        this.sortAndSend();
      },
      error: (err) => console.error(err),
      complete: () => console.log('Campaign GET complete')
    })
  }

  sortAndSend(){
    this.campaigns.sort((a, b) => {
      let aName = a.groupname.toLowerCase();
      let bName = b.groupname.toLowerCase();
      if(aName == bName){return 0}
      return aName < bName ? -1 : 1
    });
    this.campaignListChangedEvent.next(this.campaigns.slice());
  }

  getCampaigns(): Campaign[] {
    return this.campaigns.slice();
  }
  
  getCampaign(id: string): Campaign {
    let returnVal: Campaign = null;
    this.campaigns.forEach(campaign => {
      if(campaign.id == id) returnVal = campaign;
    });
    return returnVal;
  }

  getfocusCampaign(): Campaign {
    return this.focusCampaign;
  }

  setfocusCampaign(newFocus: Campaign) {
    if(!newFocus){return};
    if(!this.getCampaign(newFocus.id)){return};
    this.focusCampaign = newFocus;
    this.focusCampaignChangedEvent.next(this.focusCampaign);
  }

  addCampaign(groupName: string){
    if(!groupName){return}

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: String, campaign: Campaign}>('http://localhost:3000/campaigns', {groupName: groupName}, {headers: headers})
      .subscribe(responseData => {
        this.campaigns.push(responseData.campaign);
        this.sortAndSend();
      })
  }

  updateCampaign(originalCampaign: Campaign, newCampaign: Campaign){
    if(!originalCampaign || !newCampaign){return}

    const pos = this.campaigns.indexOf(originalCampaign);

    if(pos < 0){return}

    newCampaign.id = originalCampaign.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(`http://localhost:3000/campaigns/${originalCampaign.id}`, newCampaign, {headers: headers})
      .subscribe((response: Response) => {
        if(this.focusCampaign == originalCampaign) {
          this.focusCampaign = newCampaign;
        }
        this.campaigns[pos] = newCampaign;
        this.sortAndSend();
      });
  }

  deleteCampaign(campaign: Campaign){
    if(!campaign){return}

    const pos = this.campaigns.indexOf(campaign);

    if(pos < 0){return}

    this.http.delete(`http://localhost:3000/campaigns/${campaign.id}`)
      .subscribe((response: Response) => {
        if(this.focusCampaign == campaign){
          this.focusCampaign = null;
          this.focusCampaignChangedEvent.next(null);
        }
        this.campaigns.splice(pos, 1);
        this.sortAndSend();
      })
  }
}
