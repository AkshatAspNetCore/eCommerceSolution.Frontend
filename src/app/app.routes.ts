import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

import { ShowCaseComponent } from './components/show-case/show-case.component';
import { SearchComponent } from './components/search/search.component';
import { ProductsComponent } from './components/products/products.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { CartComponent } from './components/cart/cart.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';

export const routes: Routes = [
    // === Public routes (no guard) ===
    { path: 'products/showcase', component: ShowCaseComponent },
    { path: 'products/search/:str', component: SearchComponent },
    { path: 'products/search', component: SearchComponent },

    // === Protected routes (require sign-in) ===
    { path: 'cart', component: CartComponent, canActivate: [MsalGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [MsalGuard] },

    // === Admin routes (require sign-in; role check comes in Step 10) ===
    { path: 'admin/products', component: ProductsComponent, canActivate: [MsalGuard] },
    { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [MsalGuard] },
    { path: 'products/edit/:productID', component: EditProductComponent, canActivate: [MsalGuard] },
    { path: 'products/delete/:productID', component: DeleteProductComponent, canActivate: [MsalGuard] },
    { path: 'products/create', component: NewProductComponent, canActivate: [MsalGuard] },

    // === Default redirects ===
    { path: '', redirectTo: '/products/showcase', pathMatch: 'full' },
    { path: '**', redirectTo: '/products/showcase' },
];
