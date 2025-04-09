import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Character } from './character.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CampaignService } from '../campaigns/campaign.service';
import { Campaign } from '../campaigns/campaign.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService implements OnInit, OnDestroy{
  characters: Character[] = [];
  characterListChangedEvent = new Subject<{category: string, members: Character[]}[]>();
  campaignId: string;
  focusCampaignSubscription: Subscription;

  constructor(private http: HttpClient, private campaignService: CampaignService) {
    this.retrieveCharacters();
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

  retrieveCharacters() {
    this.http.get('http://localhost:3000/characters').subscribe({
      next: (characters: Character[]) => {
        this.characters = characters;
        this.filterAndSend();
      },
      error: (err) => console.error(err),
      complete: () => console.log('Character GET complete')
    })
  }

  filterAndSend(){
    const relevantCharacters = this.characters.filter(
      character => character.campaign == this.campaignId
    )
    const returnarray: {category: string, members: Character[]}[] = [];
    const activeCharacters = this.filterStatus(relevantCharacters, 'Active');
    if(activeCharacters.length > 0){
      activeCharacters.sort(this.characterSort);
      returnarray.push({category: 'Active', members: activeCharacters});
    }
    const retiredCharacters = this.filterStatus(relevantCharacters, 'Retired');
    if(retiredCharacters.length > 0){
      retiredCharacters.sort(this.characterSort);
      returnarray.push({category: 'Retired', members: retiredCharacters});
    }
    const abandonedCharacters = this.filterStatus(relevantCharacters, 'Abandoned');
    if(abandonedCharacters.length > 0){
      abandonedCharacters.sort(this.characterSort);
      returnarray.push({category: 'Abandoned', members: abandonedCharacters});
    }
    const suspendedCharacters = this.filterStatus(relevantCharacters, 'Suspended');
    if(suspendedCharacters.length > 0){
      suspendedCharacters.sort(this.characterSort);
      returnarray.push({category: 'Suspended', members: suspendedCharacters});
    }

  
    this.characterListChangedEvent.next(returnarray);
  }

  filterStatus(source: Character[], status: string): Character[]{
    return source.filter(character => character.status == status)
  }

  characterSort(a: Character, b: Character) {
    let aName = a.name.toLowerCase();
      let bName = b.name.toLowerCase();
      if(aName == bName){return 0}
      return aName < bName ? -1 : 1
  }


  getCharacters(): Character[] {
    return this.characters.filter(
      character => character.campaign == this.campaignId
    );
  }
  
  getCharacter(id: string): Character {
    let returnVal: Character = null;
    this.characters.forEach(character => {
      if(character.id == id) returnVal = character;
    });
    return returnVal;
  }

  addCharacter(newCharacter: Character){
    if(!newCharacter){return}

    newCharacter.id = "";

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.post<{message: String, character: Character}>('http://localhost:3000/characters', newCharacter, {headers: headers})
      .subscribe(responseData => {
        this.characters.push(responseData.character);
        this.filterAndSend();
      })
  }

  updateCharacter(originalCharacter: Character, newCharacter: Character){
    if(!originalCharacter || !newCharacter){return}

    const pos = this.characters.indexOf(originalCharacter);

    if(pos < 0){return}

    newCharacter.id = originalCharacter.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put(`http://localhost:3000/characters/${originalCharacter.id}`, newCharacter, {headers: headers})
      .subscribe((response: Response) => {
        this.characters[pos] = newCharacter;
        this.filterAndSend();
      });
  }

  deleteCharacter(character: Character){
    if(!character){return}

    const pos = this.characters.indexOf(character);

    if(pos < 0){return}

    this.http.delete(`http://localhost:3000/characters/${character.id}`)
      .subscribe((response: Response) => {
        this.characters.splice(pos, 1);
        this.filterAndSend();
      })
  }
}
