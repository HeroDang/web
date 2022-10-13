import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    
                    {
                        path: 'admin/peoples',
                        loadChildren: () => import('./admin/peoples/people.module').then(m => m.PeopleModule),
                        data: { permission: 'Pages.Peoples' }
                    },
                
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                        data: { permission: 'Pages.Tenant.Dashboard' }
                    },

                    {
                        path: 'phonebook',
                        loadChildren: () => import('./phonebook/phonebook.module').then(m => m.PhoneBookModule),
                        data: { permission: 'Pages.Tenant.PhoneBook' }
                    },

                    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
                    { path: '**', redirectTo: 'dashboard' }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
