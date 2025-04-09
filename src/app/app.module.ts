import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { provideHttpClient } from '@angular/common/http';
import { CampaignListComponent } from './campaigns/campaign-list/campaign-list.component';
import { CampaignItemComponent } from './campaigns/campaign-item/campaign-item.component';
import { CampaignAddComponent } from './campaigns/campaign-add/campaign-add.component';
import { CampaignEditComponent } from './campaigns/campaign-edit/campaign-edit.component';
import { CampaignComponent } from './campaigns/campaign.component';
import { CampaignDetailComponent } from './campaigns/campaign-detail/campaign-detail.component';
import { CharacterComponent } from './characters/character.component';
import { CharacterListComponent } from './characters/character-list/character-list.component';
import { CharacterItemComponent } from './characters/character-item/character-item.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { CharacterEditComponent } from './characters/character-edit/character-edit.component';
import { ScenarioComponent } from './scenarios/scenario.component';
import { ScenarioListComponent } from './scenarios/scenario-list/scenario-list.component';
import { ScenarioItemComponent } from './scenarios/scenario-item/scenario-item.component';
import { ScenarioDetailComponent } from './scenarios/scenario-detail/scenario-detail.component';
import { ScenarioEditComponent } from './scenarios/scenario-edit/scenario-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CampaignListComponent,
    CampaignItemComponent,
    CampaignAddComponent,
    CampaignEditComponent,
    CampaignComponent,
    CampaignDetailComponent,
    CharacterComponent,
    CharacterListComponent,
    CharacterItemComponent,
    CharacterDetailComponent,
    CharacterEditComponent,
    ScenarioComponent,
    ScenarioListComponent,
    ScenarioItemComponent,
    ScenarioDetailComponent,
    ScenarioEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
