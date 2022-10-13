import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AddPhoneInput, PersonListDto, PersonServiceProxy, PhoneType, PersonDto } from '@shared/service-proxies/service-proxies';

import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from 'primeng/api';
import { FileDownloadService } from '@shared/utils/file-download.service';
import { filter as _filter } from 'lodash-es';

import { NotifyService } from 'abp-ng2-module';
import { TokenAuthServiceProxy } from '@shared/service-proxies/service-proxies';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewPersonModalComponent } from './view-person-modal.component';


import { remove as _remove } from 'lodash-es';


@Component({
    templateUrl: './phonebook.component.html',
    //code add
    encapsulation: ViewEncapsulation.None,
    styleUrls: ["./phonebook.component.less"],
    //
    animations: [appModuleAnimation()]
})

export class PhoneBookComponent extends AppComponentBase implements OnInit {
    // export class PhoneBookComponent extends AppComponentBase{
    //navigate page number: start
    @ViewChild('viewPersonModalComponent', { static: true }) viewPeopleModal: ViewPersonModalComponent;


    @ViewChild('dataTable', { static: true }) dataTable: Table;
    @ViewChild('paginator', { static: true }) paginator: Paginator;
    //navigate page number: end

    people: PersonListDto[] = [];
    filter: string = '';

    editingPerson: PersonListDto = null;
    newPhone: AddPhoneInput = null;
    // AdvancedFilters: Start
    advancedFiltersAreShown = false;
    filterText = '';
    nameFilter = '';
    //AdvancedFilters: Start
    constructor(
        injector: Injector,
        // private _personService: PersonServiceProxy
        private _peoplesServiceProxy: PersonServiceProxy,
        private _notifyService: NotifyService,
        private _tokenAuth: TokenAuthServiceProxy,
        private _activatedRoute: ActivatedRoute,
        private _fileDownloadService: FileDownloadService,
        private _dateTimeService: DateTimeService
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.getPeople();
    }

    getPeople(): void {
        this._peoplesServiceProxy
            .getPeople(
                this.filter
            )
            .subscribe((result) => {
                this.people = result.items;
                //add by me
                this.reloadPage();
            });
    }

    getPeoples(event?: LazyLoadEvent) {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
            if (this.primengTableHelper.records && this.primengTableHelper.records.length > 0) {
                return;
            }
        }

        this.primengTableHelper.showLoadingIndicator();

        this._peoplesServiceProxy
            .getAll(
                this.filterText,
                this.nameFilter,
                this.primengTableHelper.getSorting(this.dataTable),
                this.primengTableHelper.getSkipCount(this.paginator, event),
                this.primengTableHelper.getMaxResultCount(this.paginator, event)
            )
            .subscribe((result) => {
                this.primengTableHelper.totalRecordsCount = result.totalCount;
                this.primengTableHelper.records = result.items;
                this.primengTableHelper.hideLoadingIndicator();
            });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    deletePerson(person: PersonListDto): void {
        this.message.confirm(
            this.l('AreYouSureToDeleteThePerson'),
            this.l('AreYouSureToDeleteThePerson'),
            (isConfirmed: any) => {
                if (isConfirmed) {
                    this._peoplesServiceProxy.deletePerson(person.id).subscribe(() => {
                        this.reloadPage();
                        this.notify.info(this.l('SuccessfullyDeleted'));
                        _remove(this.people, person);
                    });
                }
            }
        );
    }
    // deletePerson(person: PersonDto): void {
    //     this.message.confirm(
    //         this.l('AreYouSureToDeleteThePerson', person.name),
    //         this.l('AreYouSureToDeleteThePerson', person.name),
    //         (isConfirmed) => {
    //             if (isConfirmed) {
    //                 this._peoplesServiceProxy.deletePerson(person.id).subscribe(() => {
    //                     //this.reloadPage();
    //                     this.notify.info(this.l('SuccessfullyDeleted'));                   
    //                 });
    //             }
    //         }
    //     );
    // }


    editPerson(person: PersonListDto): void {
        if (person === this.editingPerson) {
            this.editingPerson = null;
        } else {
            this.editingPerson = person;

            this.newPhone = new AddPhoneInput();
            this.newPhone.type = PhoneType.Mobile;
            this.newPhone.personId = person.id;
        }
    };

    getPhoneTypeAsString(phoneType: PhoneType): string {
        switch (phoneType) {
            case PhoneType.Mobile:
                return this.l('PhoneType_Mobile');
            case PhoneType.Home:
                return this.l('PhoneType_Home');
            case PhoneType.Business:
                return this.l('PhoneType_Business');
            default:
                return '?';
        }
    };

    deletePhone(phone, person): void {
        this._peoplesServiceProxy.deletePhone(phone.id).subscribe(() => {
            this.notify.success(this.l('SuccessfullyDeleted'));
            _remove(person.phones, phone);
        });
    };

    savePhone(): void {
        if (!this.newPhone.number) {
            this.message.warn('Please enter a number!');
            return;
        }

        this._peoplesServiceProxy.addPhone(this.newPhone).subscribe(result => {
            this.editingPerson.phones.push(result);
            this.newPhone.number = '';

            this.notify.success(this.l('SavedSuccessfully'));
        });
    };

    exportToExcel(): void {
        this._peoplesServiceProxy.getPeoplesToExcel(this.filterText, this.nameFilter).subscribe((result) => {
            this._fileDownloadService.downloadTempFile(result);
        });
    }
}