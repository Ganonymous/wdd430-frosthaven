import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Scenario } from './scenario.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CampaignService } from '../campaigns/campaign.service';
import { Campaign } from '../campaigns/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService implements OnInit, OnDestroy{
  scenarios: Scenario[] = [];
  scenarioListChangedEvent = new Subject<{category: string, members: Scenario[]}[]>();
  campaignId: string;
  focusCampaignSubscription: Subscription;

  constructor(private http: HttpClient, private campaignService: CampaignService) {
    this.retrieveScenarios();
  }

  ngOnInit(): void {
    this.campaignId = this.campaignService.getfocusCampaign().id;
    this.focusCampaignSubscription = this.campaignService.focusCampaignChangedEvent.subscribe(
      (newFocus: Campaign) => {
        this.campaignId = newFocus.id;
        this.filterAndSend();
      }
    )
  }

  ngOnDestroy(): void {
    this.focusCampaignSubscription.unsubscribe();
  }

  retrieveScenarios() {
    this.http.get('http://localhost:3000/scenarios').subscribe({
      next: (scenarios: Scenario[]) => {
        this.scenarios = scenarios;
        this.filterAndSend();
      },
      error: (err) => console.error(err),
      complete: () => console.log('Scenario GET complete')
    })
  }

  filterAndSend(){
    const relevantScenarios = this.scenarios.filter(
      scenario => scenario.campaign == this.campaignId
    )
    const returnarray: {category: string, members: Scenario[]}[] = [];
    const availableScenarios = this.filterStatus(relevantScenarios, 'Available');
    if(availableScenarios.length > 0){
      availableScenarios.sort(this.scenarioSort);
      returnarray.push({category: 'Available', members: availableScenarios});
    }
    const completedScenarios = this.filterStatus(relevantScenarios, 'Completed');
    if(completedScenarios.length > 0){
      completedScenarios.sort(this.scenarioSort);
      returnarray.push({category: 'Completed', members: completedScenarios});
    }
    const blockedScenarios = this.filterStatus(relevantScenarios, 'Blocked');
    if(blockedScenarios.length > 0){
      blockedScenarios.sort(this.scenarioSort);
      returnarray.push({category: 'Blocked', members: blockedScenarios});
    }
    const lockedScenarios = this.filterStatus(relevantScenarios, 'Locked Out');
    if(lockedScenarios.length > 0){
      lockedScenarios.sort(this.scenarioSort);
      returnarray.push({category: 'Locked Out', members: lockedScenarios});
    }
    const skippedScenarios = this.filterStatus(relevantScenarios, 'Skipped');
    if(skippedScenarios.length > 0){
      skippedScenarios.sort(this.scenarioSort);
      returnarray.push({category: 'Skipped', members: skippedScenarios});
    }

  
    this.scenarioListChangedEvent.next(returnarray);
  }

  filterStatus(source: Scenario[], status: string): Scenario[]{
    return source.filter(character => character.status == status)
  }

  scenarioSort(a: Scenario, b: Scenario) {
    if(a.status == "Completed" && b.status == "Completed"){
      if(a.completionDate.year != b.completionDate.year){
        return a.completionDate.year - b.completionDate.year;
      } else {
        return a.completionDate.week - b.completionDate.week;
      }
    } else {
      return a.scenarioNumber - b.scenarioNumber;
    }
  }


  getScenarios(): Scenario[] {
    return this.scenarios.filter(
      scenario => scenario.campaign == this.campaignId
    );
  }
  
  getScenario(id: string): Scenario {
    let returnVal: Scenario = null;
    this.scenarios.forEach(scenario => {
      if(scenario.id == id) returnVal = scenario;
    });
    return returnVal;
  }

  addScenario(newScenario: Scenario){
    if(!newScenario){return}

    newScenario.id = "";

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: String, scenario: Scenario}>('http://localhost:3000/scenarios', newScenario, {headers: headers})
      .subscribe(responseData => {
        this.scenarios.push(responseData.scenario);
        this.filterAndSend();
      })
  }

  updateScenario(originalScenario: Scenario, newScenario: Scenario){
    if(!originalScenario || !newScenario){return}

    const pos = this.scenarios.indexOf(originalScenario);

    if(pos < 0){return}

    newScenario.id = originalScenario.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(`http://localhost:3000/scenarios/${originalScenario.id}`, newScenario, {headers: headers})
      .subscribe((response: Response) => {
        this.scenarios[pos] = newScenario;
        this.filterAndSend();
      });
  }

  deleteScenario(scenario: Scenario){
    if(!scenario){return}

    const pos = this.scenarios.indexOf(scenario);

    if(pos < 0){return}

    this.http.delete(`http://localhost:3000/scenarios/${scenario.id}`)
      .subscribe((response: Response) => {
        this.scenarios.splice(pos, 1);
        this.filterAndSend();
      })
  }
}
