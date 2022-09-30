import { Component, ViewChild, Injector, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { PeoplesServiceProxy, CreateOrEditPeopleDto } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { DateTime } from 'luxon';

import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Component({
    selector: 'createOrEditPeopleModal',
    templateUrl: './create-or-edit-people-modal.component.html',
})
export class CreateOrEditPeopleModalComponent extends AppComponentBase implements OnInit {
    @ViewChild('createOrEditModal', { static: true }) modal: ModalDirective;

    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    people: CreateOrEditPeopleDto = new CreateOrEditPeopleDto();

    constructor(
        injector: Injector,
        private _peoplesServiceProxy: PeoplesServiceProxy,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    show(peopleId?: number): void {
        if (!peopleId) {
            this.people = new CreateOrEditPeopleDto();
            this.people.id = peopleId;

            this.active = true;
            this.modal.show();
        } else {
            this._peoplesServiceProxy.getPeopleForEdit(peopleId).subscribe((result) => {
                this.people = result.people;

                this.active = true;
                this.modal.show();
            });
        }
    }

    save(): void {
        this.saving = true;

        this._peoplesServiceProxy
            .createOrEdit(this.people)
            .pipe(
                finalize(() => {
                    this.saving = false;
                })
            )
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    ngOnInit(): void {}
}
