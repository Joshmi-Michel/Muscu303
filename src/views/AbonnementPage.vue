<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="top-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/dashboard" text="" />
        </ion-buttons>
        <ion-title> <span class="red">GESTION</span> DES ABONNEMENTS</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <div class="page-container">
        <!-- Formulaire de souscription -->
        <section class="panel">
          <div class="section-heading">
            <ion-icon :icon="cardOutline" />
            <div>
              <h2>Nouvelle souscription</h2>
              <p>Informations de l'abonnement</p>
            </div>
          </div>

          <form @submit.prevent="ajouterAbonnement">
            <div class="form-grid">

              <div class="field">
                <label for="nom">Nom du membre</label>
                <div class="input-box">
                  <ion-icon :icon="personOutline" />
                  <input
                    id="nom"
                    v-model="form.nom"
                    type="text"
                    placeholder="Entrer le nom du membre"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label for="duree">Durée de l'abonnement</label>
                <div class="input-box">
                  <ion-icon :icon="calendarOutline" />
                  <select id="duree" v-model="form.duree">
                    <option
                      v-for="duree in durees"
                      :key="duree.value"
                      :value="duree.value"
                    >
                      {{ duree.label }}
                    </option>
                  </select>
                  <ion-icon :icon="chevronDownOutline" />
                </div>
              </div>

            </div>

            <!-- Prix calculé automatiquement -->
            <div class="price-panel">
              <ion-icon :icon="pricetagOutline" />
              <div>
                <p>Prix de l'abonnement</p>
                <strong>{{ formatPrix(prixSelectionne) }}</strong>
              </div>
              <ion-icon class="price-decoration" :icon="barbellOutline" />
            </div>

            <div class="form-grid">

              <div class="field">
                <label for="dateDebut">Date de début</label>
                <div class="input-box">
                  <ion-icon :icon="calendarOutline" />
                  <input
                    id="dateDebut"
                    v-model="form.dateDebut"
                    type="date"
                    required
                  />
                </div>
              </div>

              <div class="field">
                <label for="paiement">Mode de paiement</label>
                <div class="input-box">
                  <ion-icon :icon="walletOutline" />
                  <select id="paiement" v-model="form.modePaiement">
                    <option value="especes">Espèces</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="virement">Virement bancaire</option>
                  </select>
                  <ion-icon :icon="chevronDownOutline" />
                </div>
              </div>

            </div>

            <button type="submit" class="primary-button">
              <ion-icon :icon="checkmarkCircleOutline" />
              Enregistrer l'abonnement
            </button>

            <button
              type="button"
              class="reset-button"
              @click="reinitialiser"
            >
              <ion-icon :icon="refreshOutline" />
              Réinitialiser
            </button>
          </form>
        </section>

        <!-- Historique des abonnements -->
        <section class="panel history-panel">
          <div class="section-heading history-heading">
            <ion-icon :icon="timeOutline" />
            <h2>Historique des abonnements</h2>
            <span class="count-badge">{{ abonnements.length }}</span>
          </div>

          <div v-if="abonnements.length === 0" class="empty-state">
            <ion-icon :icon="documentTextOutline" />
            <p>Aucun abonnement enregistré.</p>
          </div>

          <article
            v-for="abonnement in abonnements"
            :key="abonnement.id"
            class="history-item"
          >
            <div class="avatar">
              {{ abonnement.nom.charAt(0).toUpperCase() }}
            </div>

            <div class="history-info">
              <h3>{{ abonnement.nom }}</h3>
              <p class="plan-name">{{ abonnement.dureeLabel }}</p>

              <p class="history-meta">
                <ion-icon :icon="calendarOutline" />
                Début : {{ abonnement.dateDebut }}
              </p>

              <p class="history-meta">
                <ion-icon :icon="walletOutline" />
                Paiement : {{ abonnement.modePaiementLabel }}
              </p>

              <div class="history-actions">
                <button
                  type="button"
                  class="details-button"
                  @click="voirDetails(abonnement)"
                >
                  <ion-icon :icon="eyeOutline" />
                  Détails
                </button>

                <button
                  type="button"
                  class="delete-button"
                  @click="confirmerSuppression(abonnement)"
                >
                  <ion-icon :icon="trashOutline" />
                  Supprimer
                </button>
              </div>
            </div>

            <div class="history-price">
              {{ formatPrix(abonnement.prix) }}
            </div>
          </article>
        </section>

      </div>
    </ion-content>

    
      <!-- NAVIGATION FIXE EN BAS -->
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import {
  alertController,
  toastController,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonIcon
} from '@ionic/vue'

import {
  barbellOutline,
  cardOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  walletOutline,
  chevronDownOutline,
  checkmarkCircleOutline,
  refreshOutline,
  timeOutline,
  documentTextOutline,
  eyeOutline,
  trashOutline,
  homeOutline, logOutOutline,
  peopleOutline, notificationsOutline,
  ellipsisHorizontalOutline,settingsOutline
} from 'ionicons/icons'

const router = useRouter()

const durees = [
  { label: 'Mensuel', value: 'mensuel', mois: 1, prix: 50000 },
  { label: 'Trimestriel', value: 'trimestriel', mois: 3, prix: 135000 },
  { label: 'Semestriel', value: 'semestriel', mois: 6, prix: 250000 },
  { label: 'Annuel', value: 'annuel', mois: 12, prix: 450000 }
]

const aujourdHui = () => new Date().toLocaleDateString('en-CA')

const form = ref({
  nom: '',
  duree: 'mensuel',
  dateDebut: aujourdHui(),
  modePaiement: 'especes'
})

// Charger l'historique sauvegardé.
function chargerAbonnements() {
  try {
    const donnees = JSON.parse(
      localStorage.getItem('abonnements') || '[]'
    )
    return Array.isArray(donnees) ? donnees : []
  } catch {
    return []
  }
}

const abonnements = ref(chargerAbonnements())

const prixSelectionne = computed(() => {
  const duree = durees.find(
    item => item.value === form.value.duree
  )
  return duree ? duree.prix : 0
})

function formatPrix(prix) {
  return new Intl.NumberFormat('fr-FR').format(
    Number(prix) || 0
  ) + ' Ar'
}

function sauvegarder() {
  localStorage.setItem(
    'abonnements',
    JSON.stringify(abonnements.value)
  )
}

function libellePaiement(mode) {
  const libelles = {
    especes: 'Espèces',
    mobile_money: 'Mobile Money',
    virement: 'Virement bancaire'
  }
  return libelles[mode] || mode
}

async function afficherMessage(message, color = 'success') {
  const toast = await toastController.create({
    message,
    duration: 2200,
    position: 'bottom',
    color
  })
  await toast.present()
}

function reinitialiser() {
  form.value = {
    nom: '',
    duree: 'mensuel',
    dateDebut: aujourdHui(),
    modePaiement: 'especes'
  }
}

async function ajouterAbonnement() {
  const nom = form.value.nom.trim()

  if (!nom) {
    await afficherMessage('Entre le nom du membre.', 'warning')
    return
  }

  const duree = durees.find(
    item => item.value === form.value.duree
  )

  if (!duree || !form.value.dateDebut) {
    await afficherMessage(
      'Vérifie la durée et la date de début.',
      'warning'
    )
    return
  }

  abonnements.value.unshift({
    id: Date.now(),
    nom,
    duree: duree.value,
    dureeLabel: duree.label,
    mois: duree.mois,
    prix: duree.prix,
    dateDebut: form.value.dateDebut,
    modePaiement: form.value.modePaiement,
    modePaiementLabel: libellePaiement(
      form.value.modePaiement
    )
  })

  sauvegarder()
  reinitialiser()

  await afficherMessage('Abonnement enregistré avec succès.')
}

function voirDetails(abonnement) {
  sauvegarder()

  router.push({
    name: 'DetailAbonnement',
    params: { id: abonnement.id }
  }).catch(() => {
    router.push(`/detail-abonnement/${abonnement.id}`)
  })
}

async function confirmerSuppression(abonnement) {
  const alert = await alertController.create({
    header: 'Confirmation',
    message: `Supprimer l'abonnement de ${abonnement.nom} ?`,
    buttons: [
      { text: 'Annuler', role: 'cancel' },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: () => {
          abonnements.value = abonnements.value.filter(
            item => item.id !== abonnement.id
          )
          sauvegarder()
        }
      }
    ]
  })

  await alert.present()
}

function naviguer(path) {
  router.push(path)
}
const activeTab = ref('Dashboard')
const isMoreOpen = ref(false)
const navItems = [
 { label: 'Dashboard', icon: homeOutline, path: '/dashboard' },
  { label: 'Membres', icon: peopleOutline, path: '/members' },
  { label: 'Paiements', icon: cardOutline, path: '/payments' },
  { label: 'Abonnements', icon: cardOutline, path: '/abonnement' },
  { label: 'Plus', icon: ellipsisHorizontalOutline, path: '/more', 
    children:[
      { label: 'Présences', icon:calendarOutline, path:'/attendance' },
      { label:'Historiques', icon:timeOutline, path:'/historique' },
      { label:'Paramètres', icon:settingsOutline, path:'/settings' },
      { label:'Profile', icon:personOutline, path:'profile' },
      { label:'Notifications', icon:notificationsOutline, path:'/notifications' },
      { label:'Déconnexion', icon:logOutOutline, path:'/logout' }
    ]
  }
];


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
ion-page {
  --ion-background-color: #f4f4f6;
}

.top-toolbar {
  --border-color: transparent;
  --background: #171719;
  --color: #ffffff;
  
}

.main-content {
  --background: #f4f4f6;
  --color: #17243a;
}

.page-container {
  width: 100%;
  max-width: 900px;
  margin: auto;
  padding: 12px;
}

.red {
  color: #ff303b;
}


/* Bannière */
.hero-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 145px;
  padding: 22px;
  margin-bottom: 18px;
  border-radius: 16px;
  background:
    linear-gradient(90deg, #ffffffef 10%, #ffffffd9 48%, #ffffff45),
    linear-gradient(135deg, #b7cce5, #eff4fb);
  box-shadow: 0 5px 18px #405d8010;
}

.hero-logo {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: #ed2735;
  border-radius: 50%;
}

.hero-logo ion-icon {
  font-size: 48px;
}

.hero-text h1 {
  margin: 0;
  font-size: clamp(22px, 5vw, 34px);
  font-weight: 900;
  color: #17243a;
}

.hero-text h1 span {
  color: #f12b38;
}

.hero-text p {
  margin: 5px 0 0;
  color: #405675;
  font-size: 14px;
  font-weight: 600;
}

/* Panneaux */
.panel {
  padding: 18px;
  margin-bottom: 18px;
  border-radius: 17px;
  background: #ffffffc9;
  box-shadow: 0 5px 20px #405d8010;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.section-heading > ion-icon {
  flex-shrink: 0;
  font-size: 29px;
  color: #ed2938;
}

.section-heading h2 {
  margin: 0;
  color: #1c2a42;
  font-size: 19px;
  font-weight: 800;
}

.section-heading p {
  margin: 4px 0 0;
  color: #72839c;
  font-size: 13px;
}

/* Formulaire */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  min-width: 0;
  margin-bottom: 14px;
}

.field label {
  display: block;
  margin-bottom: 7px;
  color: #293a55;
  font-size: 14px;
  font-weight: 700;
}

.input-box {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: 49px;
  padding: 0 12px;
  border: 1px solid #d5e0ef;
  border-radius: 13px;
  background: #f9fbff;
}

.input-box > ion-icon {
  flex-shrink: 0;
  color: #263650;
  font-size: 22px;
}

.input-box input,
.input-box select {
  width: 100%;
  min-width: 0;
  padding: 12px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #24344f;
  font: inherit;
  font-size: 14px;
}

.input-box input::placeholder {
  color: #7183a0;
}

.input-box select {
  appearance: none;
}

.price-panel {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  margin: 3px 0 15px;
  border: 1px solid #ffc3ca;
  border-radius: 15px;
  background: #fff0f1;
}

.price-panel > ion-icon {
  flex-shrink: 0;
  color: #ed2938;
  font-size: 32px;
}

.price-panel p {
  margin: 0 0 4px;
  color: #27364d;
  font-size: 14px;
}

.price-panel strong {
  color: #e92736;
  font-size: 26px;
  font-weight: 900;
}

.price-panel .price-decoration {
  margin-left: auto;
  font-size: 32px;
}

.primary-button,
.reset-button {
  width: 100%;
  min-height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 13px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.primary-button {
  margin-top: 4px;
  border: 0;
  color: white;
  background: linear-gradient(100deg, #ff303d, #e71d2c);
}

.primary-button ion-icon,
.reset-button ion-icon {
  font-size: 23px;
}

.reset-button {
  margin-top: 12px;
  border: 1px solid #f02c3b;
  color: #24344d;
  background: transparent;
}

/* Historique */
.history-heading {
  margin-bottom: 15px;
}

.history-heading h2 {
  flex: 1;
}

.count-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
  border-radius: 50%;
  color: white;
  background: #ef2938;
  font-weight: 800;
}

.history-item {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 12px;
  position: relative;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid #e3ebf6;
  border-radius: 17px;
  background: #ffffffd9;
}

.avatar {
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  background: #1c293d;
  font-size: 26px;
  font-weight: 800;
}

.history-info {
  min-width: 0;
}

.history-info h3 {
  margin: 0;
  padding-right: 110px;
  overflow-wrap: anywhere;
  color: #1c293d;
  font-size: 15px;
  font-weight: 800;
}

.plan-name {
  margin: 4px 0 9px;
  color: #ed2938;
  font-size: 14px;
  font-weight: 800;
}

.history-price {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 8px 12px;
  border-radius: 20px;
  color: white;
  background: #ed2938;
  font-size: 13px;
  font-weight: 800;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 5px 0;
  color: #647b9d;
  font-size: 12px;
  overflow-wrap: anywhere;
}

.history-meta ion-icon {
  flex-shrink: 0;
  font-size: 17px;
  color: #263750;
}

.history-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.details-button,
.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 7px 12px;
  border: 1px solid;
  border-radius: 12px;
  background: transparent;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.details-button {
  border-color: #263750;
  color: #263750;
}

.delete-button {
  border-color: #f02c3b;
  color: #ed2938;
}

.details-button ion-icon,
.delete-button ion-icon {
  font-size: 18px;
}

.empty-state {
  padding: 24px 10px;
  text-align: center;
  border: 1px solid #e0e9f5;
  border-radius: 15px;
  color: #7185a4;
  background: #f2f6fc;
}

.empty-state ion-icon {
  font-size: 30px;
}

.empty-state p {
  margin-bottom: 0;
  font-size: 14px;
}

/* Navigation du bas */

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
/* Menu navigation en bas*/
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
</style>