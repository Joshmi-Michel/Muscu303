<template>
  <ion-page>
    <ion-content :fullscreen="true" class="dashboard-content">
      <div class="dashboard-screen">

        <!-- En-tête -->
        <header class="app-header">
          <div class="brand">
            <div class="brand-logo"><img :src="logo" alt="logoApp" class="app-logo" /></div>
            <div>
              <h1><span>MUSCULATION</span></h1>
              <p>Fitness</p>
            </div>
          </div>

          <button class="profile-button" aria-label="Profil" @click="openMore">
            <ion-icon :icon="personCircleOutline" />
          </button>
        </header>

        <div class="welcome">
          <div>
            <p class="eyebrow">ESPACE ADMINISTRATEUR</p>
            <h2>Tableau de bord</h2>
            <p class="date-text">{{ today }}</p>
          </div>
          <div class="status-dot"></div>
        </div>

        <!-- Statistiques principales -->
        <section class="stats-grid">
          <article class="stat-card members">
            <div class="stat-top">
              <span>Membres</span>
              <ion-icon :icon="peopleOutline" />
            </div>
            <strong>{{ stats.members }}</strong>
            <small>Total inscrits</small>
          </article>

          <article class="stat-card active">
            <div class="stat-top">
              <span>Actifs</span>
              <ion-icon :icon="checkmarkCircleOutline" />
            </div>
            <strong>{{ stats.active }}</strong>
            <small>Abonnements actifs</small>
          </article>

          <article class="stat-card expired">
            <div class="stat-top">
              <span>Expirés</span>
              <ion-icon :icon="alertCircleOutline" />
            </div>
            <strong>{{ stats.expired }}</strong>
            <small>À renouveler</small>
          </article>
        </section>

        <!-- Présences et revenus -->
        <section class="overview-grid">
          <article class="overview-card attendance">
            <div class="overview-heading">
              <ion-icon :icon="fingerPrintOutline" />
              <span>Présences aujourd'hui</span>
            </div>
            <strong>{{ stats.attendance }}</strong>
            <p>Visites enregistrées</p>
          </article>

          <article class="overview-card revenue">
            <div class="overview-heading">
              <ion-icon :icon="walletOutline" />
              <span>Revenus du jour</span>
            </div>
            <strong>{{ formatMoney(stats.revenue) }}</strong>
            <p>Recettes encaissées</p>
          </article>
        </section>

        <!-- Graphique du chiffre d'affaires -->
        <section class="chart-card">
          <div class="section-heading">
            <div>
              <p class="eyebrow">PERFORMANCE</p>
              <h3>Chiffre d'affaires</h3>
            </div>

            <select v-model="period" aria-label="Période du graphique">
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>

          <div class="chart-summary">
            <strong>{{ formatMoney(chartTotal) }}</strong>
            <span class="chart-unit">Ar</span>
          </div>

          <div class="chart">
            <div class="y-labels">
              <span>300k</span>
              <span>200k</span>
              <span>100k</span>
              <span>0</span>
            </div>

            <div class="chart-body">
              <div class="grid-line line-1"></div>
              <div class="grid-line line-2"></div>
              <div class="grid-line line-3"></div>
              <div class="grid-line line-4"></div>

              <div
                v-for="(item, index) in chartData"
                :key="item.label"
                class="bar-column"
              >
                <div class="bar-area">
                  <div
                    class="bar"
                    :class="{ today: index === chartData.length - 1 }"
                    :style="{ height: barHeight(item.value) + '%' }"
                    :title="formatMoney(item.value) + ' Ar'"
                  ></div>
                </div>
                <span class="bar-label">{{ item.label }}</span>
              </div>
            </div>
          </div>

          <p class="chart-note">
            <ion-icon :icon="informationCircleOutline" />
            Montants indicatifs : relie ce graphique à tes données réelles.
          </p>
        </section>

        <!-- Activités récentes -->
        <section class="activity-section">
          <div class="section-heading">
            <div>
              <p class="eyebrow">SUIVI DU CLUB</p>
              <h3>Accès rapides</h3>
            </div>
          </div>

          <div class="quick-actions">
            <button @click="navigate('/members')">
              <span class="action-icon red">
                <ion-icon :icon="peopleOutline" />
              </span>
              <span class="action-text">
                <strong>Membres</strong>
                <small>Gérer les adhérents</small>
              </span>
              <ion-icon :icon="chevronForwardOutline" class="chevron" />
            </button>

            <button @click="navigate('/payments')">
              <span class="action-icon orange">
                <ion-icon :icon="cardOutline" />
              </span>
              <span class="action-text">
                <strong>Paiements</strong>
                <small>Suivre les recettes</small>
              </span>
              <ion-icon :icon="chevronForwardOutline" class="chevron" />
            </button>

            <button @click="navigate('/attendance')">
              <span class="action-icon purple">
                <ion-icon :icon="timeOutline" />
              </span>
              <span class="action-text">
                <strong>Présences</strong>
                <small>Consulter les visites</small>
              </span>
              <ion-icon :icon="chevronForwardOutline" class="chevron" />
            </button>
          </div>
        </section>

      </div>
    </ion-content>

    <!-- Navigation fixe en bas -->
    <ion-footer class="bottom-footer">
      <nav class="bottom-nav">
        <button
          v-for="item in navItems"
          :key="item.label"
          :class="{ selected: activeTab === item.label || (item.label === 'Plus' && isMoreOpen) }"
          @click="selectTab(item)"
        >
          <ion-icon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </button>
        <!--Sous-menu Plus-->
       <Transition name="menu">
           <div v-if="isMoreOpen" class="more-submenu">
            <button v-for="subItem in navItems[4].children" :key="subItem.label" @click="selectSubMenu(subItem)">
              <ion-icon :icon="subItem.icon" />
              <span>{{ subItem.label }}</span>
            </button>
           </div>
        </Transition>
      </nav>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonFooter,
  IonIcon
} from '@ionic/vue'

import {
  personCircleOutline,
  peopleOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  fingerPrintOutline,
  walletOutline,
  informationCircleOutline,
  chevronForwardOutline,
  cardOutline,
  timeOutline,
  home,
  ellipsisHorizontal,
  calendarOutline,
  settingsOutline,
  personOutline,
  notificationsOutline,
  logOutOutline
} from 'ionicons/icons'
import logo from '@/assets/img/303Logo.png'
const router = useRouter()

// Données de démonstration : remplace-les par les données de ton backend.
const stats = ref({
  members: 245,
  active: 198,
  expired: 12,
  attendance: 67,
  revenue: 185000
})

const period = ref('week')
const activeTab = ref('Dashboard')
const isMoreOpen = ref(false)
const today = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date())

const weeklyData = [
  { label: 'Lun', value: 90000 },
  { label: 'Mar', value: 40000 },
  { label: 'Mer', value: 60000 },
  { label: 'Jeu', value: 120000 },
  { label: 'Ven', value: 70000 },
  { label: 'Sam', value: 160000 },
  { label: 'Dim', value: 180000 }
]

const monthlyData = [
  { label: 'S1', value: 420000 },
  { label: 'S2', value: 580000 },
  { label: 'S3', value: 350000 },
  { label: 'S4', value: 720000 }
]

const chartData = computed(() =>
  period.value === 'week' ? weeklyData : monthlyData
)

const chartTotal = computed(() =>
  chartData.value.reduce((total, item) => total + item.value, 0)
)

function formatMoney(value) {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(value) + ' Ar'
}

function barHeight(value) {
  const maximum = 300000
  return Math.max(3, Math.min(100, (value / maximum) * 100))
}

const navItems = [
  { label: 'Dashboard', icon: home, path: '/dashboard' },
  { label: 'Membres', icon: peopleOutline, path: '/members' },
  { label: 'Paiements', icon: walletOutline, path: '/payments' },
  { label: 'Abonnements', icon: cardOutline, path: '/abonnement' },
  { label: 'Plus', icon: ellipsisHorizontal, path: '/more', 
    children:[
      { label: 'Présences', icon:calendarOutline, path:'/attendance' },
      { label:'Historiques', icon:timeOutline, path:'/historique' },
      { label:'Paramètres', icon:settingsOutline, path:'/settings' },
      { label:'Profile', icon:personOutline, path:'profile' },
      { label:'Notifications', icon:notificationsOutline, path:'/notifications' },
      { label:'Déconnexion', icon:logOutOutline, path:'/logout' }
    ]
  }
]

function navigate(path) {
  router.push(path)
}

function selectTab(item) {
  //activeTab.value = item.label
  //navigate(item.path)
  if(item.label==='Plus'){
    isMoreOpen.value = !isMoreOpen.value
    return
  }
  isMoreOpen.value=false
  activeTab.value = item.label
  router.push(item.path)
}

function openMore() {
  activeTab.value = 'Plus'
  router.push('/more')
}
async function logout(){
  try{
    //supprimer les information d'authentification
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    //supprimer également les données de session temporaire
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    //fermer le sous-menu Plus
    isMoreOpen.value =false
    //rediriger vers la connexion et remplacer l'historique courant
    await router.replace('/login')
  }catch(error){
    console.error('Erreur lors de la déconnection:', error)
  }
}
 async function selectSubMenu(subItem){
  //verification  element
  if(!subItem || !subItem.label){
    console.error('Erreur: élément de sous-menu manquant', subItem)
    return
  }
    isMoreOpen.value=false
    if(subItem.label==='Déconnexion'){
      await logout()
      return
    }
    if(subItem.path){
      await router.push(subItem.path)
    }else{
      console.error('Route manquant pour', subItem)
    }
    
 }

</script>

<style scoped>
.dashboard-content {
  --background: #0a0a0d;
}

.dashboard-screen {
  box-sizing: border-box;
  min-height: 100%;
  padding: max(22px, env(safe-area-inset-top)) 17px 30px;
  color: #f8f8fb;
  background:
    radial-gradient(ellipse at 90% 0%, rgba(255, 23, 68, 0.09), transparent 35%),
    #0a0a0d;
}

.app-header,
.brand,
.welcome,
.stat-top,
.overview-heading,
.section-heading,
.chart-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header {
  margin-bottom: 29px;
}

.brand {
  justify-content: flex-start;
  gap: 11px;
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid #ff3157;
  border-radius: 15px;
  background: #211016;
  color: #ff3157;
  font-size: 19px;
  font-weight: 900;
  box-shadow: 0 0 20px #ff17441a;
}

.brand h1 {
  margin: 0;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: 1px;
}

.brand h1 span {
  color: #ff3157;
}

.brand p,
.date-text {
  margin: 5px 0 0;
  color: #9696a5;
  font-size: 11px;
}

.profile-button {
  display: grid;
  place-items: center;
  width: 43px;
  height: 43px;
  border: 1px solid #292932;
  border-radius: 50%;
  background: #17171d;
  color: #ff5373;
  font-size: 27px;
}

.welcome {
  margin-bottom: 21px;
}

.eyebrow {
  margin: 0 0 7px;
  color: #ff5474;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.welcome h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
}

.date-text {
  text-transform: capitalize;
  font-size: 12px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #48dba0;
  box-shadow: 0 0 12px #48dba055;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
}

.stat-card {
  min-width: 0;
  padding: 13px 10px;
  border: 1px solid #ffffff0b;
  border-radius: 16px;
}

.members {
  background: linear-gradient(145deg, #152e49, #102237);
}

.active {
  background: linear-gradient(145deg, #15382f, #10251f);
}

.expired {
  background: linear-gradient(145deg, #45212c, #2c151d);
}

.stat-top {
  align-items: flex-start;
  gap: 4px;
  color: #d2d6e2;
  font-size: 11px;
  font-weight: 700;
}

.stat-top ion-icon {
  flex-shrink: 0;
  font-size: 16px;
}

.members .stat-top ion-icon {
  color: #57aaff;
}

.active .stat-top ion-icon {
  color: #4be0a1;
}

.expired .stat-top ion-icon {
  color: #ff6c87;
}

.stat-card strong {
  display: block;
  margin-top: 15px;
  font-size: clamp(22px, 6vw, 30px);
  font-weight: 900;
}

.stat-card small {
  display: block;
  margin-top: 5px;
  color: #9da6b8;
  font-size: 9px;
  line-height: 1.4;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 13px;
}

.overview-card,
.chart-card {
  border: 1px solid #ffffff0b;
  border-radius: 18px;
  background: #15151c;
}

.overview-card {
  min-width: 0;
  padding: 16px 13px;
}

.overview-heading {
  justify-content: flex-start;
  align-items: flex-start;
  gap: 7px;
  color: #b9bac9;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.5;
}

.overview-heading ion-icon {
  flex-shrink: 0;
  color: #ff5274;
  font-size: 17px;
}

.overview-card strong {
  display: block;
  margin-top: 16px;
  font-size: clamp(22px, 5vw, 29px);
  font-weight: 850;
  overflow-wrap: anywhere;
}

.attendance strong {
  color: #f5f5fa;
}

.revenue strong {
  color: #67aaff;
  font-size: clamp(16px, 4vw, 22px);
}

.overview-card p {
  margin: 6px 0 0;
  color: #777887;
  font-size: 10px;
}

.chart-card {
  margin-top: 15px;
  padding: 19px 15px 13px;
}

.section-heading {
  gap: 10px;
}

.section-heading h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

.section-heading select {
  max-width: 125px;
  padding: 8px 6px;
  border: 1px solid #343440;
  border-radius: 9px;
  background: #202029;
  color: #d7d7e2;
  font-size: 10px;
}

.chart-summary {
  justify-content: flex-start;
  gap: 7px;
  margin: 17px 0 15px;
}

.chart-summary strong {
  font-size: 25px;
  font-weight: 900;
}

.chart-unit {
  color: #ff6480;
  font-size: 12px;
  font-weight: 700;
}

.chart {
  display: grid;
  grid-template-columns: 33px minmax(0, 1fr);
  gap: 5px;
  height: 160px;
}

.y-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 22px;
  color: #717181;
  font-size: 9px;
}

.chart-body {
  position: relative;
  display: flex;
  justify-content: space-around;
  gap: 6px;
  min-width: 0;
}

.grid-line {
  position: absolute;
  right: 0;
  left: 0;
  border-top: 1px dashed #ffffff10;
  pointer-events: none;
}

.line-1 { top: 0; }
.line-2 { top: 33.3%; }
.line-3 { top: 66.6%; }
.line-4 { bottom: 22px; }

.bar-column {
  z-index: 1;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.bar-area {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: calc(100% - 22px);
}

.bar {
  width: min(22px, 70%);
  min-height: 4px;
  border-radius: 5px 5px 2px 2px;
  background: linear-gradient(180deg, #4da6ff, #2764bc);
  box-shadow: 0 0 13px #3d8cf51c;
  transition: height 0.25s ease;
}

.bar.today {
  background: linear-gradient(180deg, #ff6685, #e92550);
  box-shadow: 0 0 14px #ff31572a;
}

.bar-label {
  margin-top: 8px;
  color: #9292a2;
  font-size: 9px;
}

.chart-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 16px 0 0;
  color: #898998;
  font-size: 10px;
  line-height: 1.5;
}

.chart-note ion-icon {
  flex-shrink: 0;
  color: #ff6480;
  font-size: 15px;
}

.activity-section {
  margin-top: 25px;
}

.activity-section .section-heading {
  margin-bottom: 13px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.quick-actions button {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 13px;
  border: 1px solid #ffffff0b;
  border-radius: 14px;
  background: #15151c;
  color: #fff;
  text-align: left;
}

.action-icon {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 21px;
}

.action-icon.red {
  background: #391822;
  color: #ff5877;
}

.action-icon.orange {
  background: #39291b;
  color: #ffb45c;
}

.action-icon.purple {
  background: #28203e;
  color: #bd9aff;
}

.action-text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.action-text strong {
  font-size: 13px;
}

.action-text small {
  color: #8d8d9c;
  font-size: 10px;
}

.chevron {
  color: #858593;
  font-size: 18px;
}

.bottom-footer {
  border-top: 1px solid #292932;
  background: #101015;
}

.bottom-nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 8px 3px max(8px, env(safe-area-inset-bottom));
}

.bottom-nav button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  padding: 6px 1px;
  border: 0;
  background: transparent;
  color: #81818f;
}

.bottom-nav button ion-icon {
  font-size: 21px;
}

.bottom-nav button span {
  font-size: 9px;
  font-weight: 600;
}

.bottom-nav button.selected {
  color: #ff5274;
}

.bottom-nav button.selected ion-icon {
  filter: drop-shadow(0 0 7px #ff315755);
}

@media (min-width: 600px) {
  .dashboard-screen {
    max-width: 650px;
    margin: 0 auto;
    padding-right: 25px;
    padding-left: 25px;
  }

  .bottom-nav {
    max-width: 650px;
    margin: 0 auto;
  }
}
.bottom-nav-item {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: #a9b6d0;
  font-size: 12px;
}

.bottom-nav-item ion-icon {
  font-size: 25px;
}

.bottom-nav-item.selected {
  color: #ff4f91;
}

.more-submenu {
  position: absolute;
  right: 10px;
  bottom: calc(100% + 10px);
  width: 240px;
  max-height: 70vh;
  overflow-y:auto ;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  padding: 12px;
  background: #101015;
  border: 1px solid #344563;
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.submenu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;

  width: 100%;
  min-height: 52px;
  padding:0 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: white;
  text-align: left;
  font-size: 14px;
}

.submenu-item ion-icon {
  flex: 0 0 24px ;
  width: 24px;
  height: 24px;
  font-size: 22px;
  color: #8da8ff;
}
.submenu-item span {
  flex:1;
  text-align: left;
  white-space: nowrap;
}

.submenu-item.active{
  background: red;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.app-logo{
  width: 40px;
  height:40px;
  object-fit: contain;
  border-radius: 8px;
}

</style>