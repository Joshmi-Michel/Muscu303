import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import AbonnementPage from '../views/AbonnementPage.vue';
import HistoriquePage from '../views/HistoriquePage.vue';
import SettingsPages  from '../views/SettingsPage.vue';
import NotificationsPage from '../views/NotificationsPage.vue';
import MembersPage from '../views/MembresPage.vue';
import DetailMembrePage from '../views/DetailMembrePage.vue';
import DetailAbonnementPage from '../views/DetailAbonnementPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },{
    path: '/home',
    name: 'Home',
    component: HomePage
  },{
    path:'/register',
    name:'Register',
    component: RegisterPage
  },{
    path: '/login',
    name: 'Login',
    component:LoginPage
  },{
    path:'/forgot-password',
    name:'ForgotPassword',
    component: ForgotPasswordPage
  },{
    path:'/dashboard',
    name:'Dashboard',
    component:DashboardPage,
    meta: { requiresAuth:true }
  },{
    path:'/abonnement',
    name:'Abonnement',
    component:AbonnementPage
  },{
      path:'/detail-abonnement',
      name:'DetailAbonnement',
      component:DetailAbonnementPage
  },{
    path:'/historique',
    name:'Historique',
    component:HistoriquePage
  },{
    path:'/settings',
    name:'Paramètres',
    component:SettingsPages
  },{
    path:'/notification',
    name:'Notifications',
    component:NotificationsPage
  },{
    path:'/members',
    name:'Membres',
    component:MembersPage
  },{
    path: '/members/detail/:id',
    name:'DetailMembre',
    component:DetailMembrePage
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to)=>{
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
  if(to.metarequiresAuth && !token){
    return '/login'
  }
  if(to.path === '/login' && token){
    return '/dashboard'
  }
})

export default router
