import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue';
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
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
