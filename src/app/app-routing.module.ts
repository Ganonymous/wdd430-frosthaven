import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignComponent } from './campaigns/campaign.component';
import { CampaignEditComponent } from './campaigns/campaign-edit/campaign-edit.component';
import { CampaignDetailComponent } from './campaigns/campaign-detail/campaign-detail.component';
import { CharacterComponent } from './characters/character.component';
import { CharacterEditComponent } from './characters/character-edit/character-edit.component';
import { CharacterDetailComponent } from './characters/character-detail/character-detail.component';
import { ScenarioComponent } from './scenarios/scenario.component';
import { ScenarioEditComponent } from './scenarios/scenario-edit/scenario-edit.component';
import { ScenarioDetailComponent } from './scenarios/scenario-detail/scenario-detail.component';

const routes: Routes = [
  {path: '', redirectTo: '/campaigns', pathMatch: 'full'},
  {path: 'campaigns', component: CampaignComponent, children: [
    {path: ':id/edit', component: CampaignEditComponent},
    {path: ':id', component: CampaignDetailComponent}
  ]},
  {path: 'characters', component: CharacterComponent, children: [
    {path: 'new', component: CharacterEditComponent},
    {path: ':id/edit', component: CharacterEditComponent},
    {path: ':id', component: CharacterDetailComponent}
  ]},
  {path: 'scenarios', component: ScenarioComponent, children: [
    {path: 'new', component: ScenarioEditComponent},
    {path: ':id/edit', component: ScenarioEditComponent},
    {path: ':id', component: ScenarioDetailComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
