import { ResolveFn, Routes } from '@angular/router';
import { DashboardComponent } from '../component/dashboard/dashboard.component';
import { HomeComponent } from '../component/home/home.component';
import { PageNotFoundComponent } from '../component/page-not-found/page-not-found.component';
import { PostListComponent } from '../component/post-list/post-list.component';
import { PostDetailComponent } from '../component/post-detail/post-detail.component';
import { OptionComponent } from '../component/option/option.component';
import { PostCreateEditComponent } from '../component/post-create-edit/post-create-edit.component';
import { authGuard } from '../guard/auth.guard';
import { CategoryComponent } from '../component/category/category.component';
import { MenuComponent } from '../component/menu/menu.component';
import { ArchiveComponent } from '../component/archive/archive.component';
import { ClientHomeComponent } from '../component/client-home/client-home.component';
import { LoginComponent } from '../component/login/login.component';
import { UserComponent } from '../component/user/user.component';
import { PageBuilderComponent } from '../component/page-builder/page-builder.component';

//const titleResolver: ResolveFn<string> = (route) => route.params['id'];
const postTitleResolver: ResolveFn<string> = (route) => {
    let title = route.params['postTitle'];
    return title;
};
const archiveTitleResolver: ResolveFn<string> = (route) => {
    let title = route.params['archiveType'];
    return title;
};

export const routes: Routes = [
    { path: '', component: HomeComponent, pathMatch:'full',title:'Mike'},
    { path: ':username', component: ClientHomeComponent,title:(route)=>route.params['username']},
    { path: ':username/login', component: LoginComponent,title:'Login'},
    { path: ':username/:postTitle/:id', component: PostDetailComponent,title:postTitleResolver},
    { path: ':username/archive/:archiveType/:id', component: ArchiveComponent,title:archiveTitleResolver},
    
    { path: 'sp/app/admin/dashboard/:username', component: DashboardComponent,title:'Dashboard', canActivate:[authGuard], children:[
        { path: 'post-list/:postType', component: PostListComponent },
        {path:'category/:type/:id',component:CategoryComponent},
        { path: 'post-update/:postType/:id', component: PostCreateEditComponent },
        { path: 'option', component: OptionComponent },
        { path: 'menu', component: MenuComponent },
        { path: 'user/:type/:id', component: UserComponent },
        { path: 'page-builder', component: PageBuilderComponent },
    ] },
   
    { path: '**', component: PageNotFoundComponent },
    
];
