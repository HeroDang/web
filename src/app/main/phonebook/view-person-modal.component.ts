import { AppConsts } from '@shared/AppConsts';
import { Component, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GetPeopleForViewDto_PhoneBook, PersonDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';

@Component({
    selector: 'viewPersonModal',
    templateUrl: './view-person-modal.component.html',
})
export class ViewPersonModalComponent extends AppComponentBase {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    item: GetPeopleForViewDto_PhoneBook;

    constructor(injector: Injector) {
        super(injector);
        this.item = new GetPeopleForViewDto_PhoneBook();
        this.item.person = new PersonDto();
    }

    show(item: GetPeopleForViewDto_PhoneBook): void {
        this.item = item;
        this.active = true;
        this.modal.show();
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
