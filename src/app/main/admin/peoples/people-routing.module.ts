import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeoplesComponent } from './peoples.component';

const routes: Routes = [
    {
        path: '',
        component: PeoplesComponent,
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PeopleRoutingModule {}
