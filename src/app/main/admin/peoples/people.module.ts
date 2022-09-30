import { NgModule } from '@angular/core';
import { AppSharedModule } from '@app/shared/app-shared.module';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import { PeopleRoutingModule } from './people-routing.module';
import { PeoplesComponent } from './peoples.component';
import { CreateOrEditPeopleModalComponent } from './create-or-edit-people-modal.component';
import { ViewPeopleModalComponent } from './view-people-modal.component';

@NgModule({
    declarations: [PeoplesComponent, CreateOrEditPeopleModalComponent, ViewPeopleModalComponent],
    imports: [AppSharedModule, PeopleRoutingModule, AdminSharedModule],
})
export class PeopleModule {}
