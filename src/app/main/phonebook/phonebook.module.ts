import {NgModule} from '@angular/core';
import { AdminSharedModule } from '@app/admin/shared/admin-shared.module';
import {AppSharedModule} from '@app/shared/app-shared.module';
import { CreatePersonModalComponent } from './create-person-modal.component';
import { EditPersonModalComponent } from './edit-person-modal.component';
import {PhoneBookRoutingModule} from './phonebook-routing.module';
import {PhoneBookComponent} from './phonebook.component';
import { ViewPersonModalComponent } from './view-person-modal.component';

@NgModule({
    declarations: [PhoneBookComponent, CreatePersonModalComponent, EditPersonModalComponent, ViewPersonModalComponent],
    imports: [AppSharedModule, AdminSharedModule ,PhoneBookRoutingModule]
})
export class PhoneBookModule {}
