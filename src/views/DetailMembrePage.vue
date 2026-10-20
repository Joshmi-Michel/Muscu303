<template>
  <ion-page>
    <!-- En-tête -->
    <ion-header class="app-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/members"
            text=""
            color="light"
          />
        </ion-buttons>
        <ion-title>Détail membre</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Contenu -->
    <ion-content class="detail-content">
      <div class="page-container">
        <div class="section-header">
          <ion-button fill="clear" class="back-members" @click="retourMembres">
            <ion-icon :icon="arrowBackOutline" slot="start" />
            Membres
          </ion-button>
          <ion-button fill="clear" class="refresh-button" @click="chargerMembre">
            <ion-icon :icon="refreshOutline" />
          </ion-button>
        </div>
        <!-- Carte membre -->
        <ion-card class="member-card">
          <ion-card-content>

            <!-- Photo et identité -->
            <div class="profile-header">
              <div class="photo-container">
                <img
                  :src="membre.photo || photoDefaut"
                  alt="Photo du membre"
                  class="member-photo"
                />
              </div>

              <div class="profile-info">
                <ion-badge
                  :color="membre.actif ? 'success' : 'medium'"
                  class="status-badge"
                >
                  {{ membre.actif ? 'Actif' : 'Inactif' }}
                </ion-badge>

                <h2>{{ membre.nom }}</h2>
                <p class="member-id">
                  ID : {{ membre.id }}
                </p>
              </div>
            </div>

            <!-- Téléphone -->
            <div class="info-row">
              <ion-icon :icon="callOutline" class="info-icon" />
              <span>{{ membre.telephone }}</span>
            </div>

            <!-- Email -->
            <div class="info-row">
              <ion-icon :icon="mailOutline" class="info-icon" />
              <span class="email-text">{{ membre.email }}</span>
            </div>

            <!-- Âge et sexe -->
            <div class="personal-info">
              <div>
                <span class="info-label">Âge</span>
                <strong>{{ membre.age }} ans</strong>
              </div>

              <div>
                <span class="info-label">Sexe</span>
                <strong>{{ membre.sexe }}</strong>
              </div>
            </div>

            <div class="separator"></div>

            <!-- Abonnement -->
            <div class="subscription-heading">
              <h3>Abonnement</h3>
              <ion-button
                fill="clear"
                class="subscription-arrow"
                @click="voirAbonnement"
              >
                <ion-icon :icon="chevronForwardOutline" />
              </ion-button>
            </div>

            <div class="subscription-info">
              <div class="subscription-icon">
                <ion-icon :icon="calendarOutline" />
              </div>

              <div class="subscription-details">
                <strong>{{ membre.abonnement }}</strong>
                <p>
                  {{ membre.dateDebut }} -
                  {{ membre.dateFin }}
                </p>
              </div>
            </div>

            <!-- Boutons -->
            <div class="action-buttons">
              <ion-button
                expand="block"
                class="edit-button"
                @click="modifierMembre"
              >
                <ion-icon :icon="createOutline" slot="start" />
                Modifier
              </ion-button>

              <ion-button
                expand="block"
                fill="outline"
                class="delete-button"
                @click="confirmerSuppression"
              >
                <ion-icon :icon="trashOutline" slot="start" />
                Supprimer
              </ion-button>
            </div>

          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>

    <!-- Barre de navigation fixe -->
    <ion-footer class="bottom-footer">
      <ion-toolbar>
        <div class="bottom-nav">

          <button
            class="nav-item"
            @click="naviguer('/dashboard')"
          >
            <ion-icon :icon="homeOutline" />
            <span>Accueil</span>
          </button>

          <button
            class="nav-item active"
            @click="naviguer('/members')"
          >
            <ion-icon :icon="peopleOutline" />
            <span>Membres</span>
          </button>

          <button
            class="nav-item"
            @click="naviguer('/abonnements')"
          >
            <ion-icon :icon="cardOutline" />
            <span>Abonnements</span>
          </button>

          <button
            class="nav-item"
            @click="naviguer('/profil')"
          >
            <ion-icon :icon="personOutline" />
            <span>Profil</span>
          </button>

        </div>
      </ion-toolbar>
    </ion-footer>

    <!-- Confirmation de suppression -->
    <ion-alert
      :is-open="alerteSuppression"
      header="Supprimer le membre"
      message="Voulez-vous vraiment supprimer ce membre ?"
      :buttons="boutonsSuppression"
      @did-dismiss="alerteSuppression = false"
    />
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonAlert
} from '@ionic/vue'

import {
  arrowBackOutline,
  refreshOutline,
  callOutline,
  mailOutline,
  calendarOutline,
  chevronForwardOutline,
  createOutline,
  trashOutline,
  homeOutline,
  peopleOutline,
  cardOutline,
  personOutline
} from 'ionicons/icons'

const router = useRouter()
const route = useRoute()

const alerteSuppression = ref(false)

// Photo de démonstration : remplace-la par la photo du membre.
const photoDefaut =
  'https://ionicframework.com/docs/img/demos/avatar.svg'

// Données de démonstration
const membre = ref({
  id: 'M001',
  nom: 'Jean RAKOTOMALALA',
  telephone: '034 56 789 01',
  email: 'jean@gmail.com',
  age: 28,
  sexe: 'Homme',
  photo: '',
  actif: true,
  abonnement: 'Mensuel / Fitness',
  dateDebut: '01/10/2026',
  dateFin: '31/10/2026'
})

// Retour vers la liste des membres
function retourMembres() {
  router.push('/members')
}

// Recharger les données de démonstration
function chargerMembre() {
  // Remplace cette fonction par ton appel API si nécessaire.
  console.log('Membre affiché :', membre.value.id)
}

// Modifier le membre
function modifierMembre() {
  router.push({
    path: '/members/modifier/' + membre.value.id
  })
}

// Ouvrir la page des abonnements
function voirAbonnement() {
  router.push('/abonnements')
}

// Navigation générale
function naviguer(path) {
  router.push(path)
}

// Suppression avec confirmation
const boutonsSuppression = [
  {
    text: 'Annuler',
    role: 'cancel'
  },
  {
    text: 'Supprimer',
    role: 'destructive',
    handler: () => {
      supprimerMembre()
    }
  }
]

function confirmerSuppression() {
  alerteSuppression.value = true
}

function supprimerMembre() {
  // À remplacer par la suppression dans ta base de données.
  console.log('Suppression du membre :', membre.value.id)

  router.replace('/members')
}

// Récupération de l'identifiant transmis dans l'URL
const membreId = route.params.id

if (membreId) {
  membre.value.id = String(membreId)
}
</script>

<style scoped>
.app-header ion-toolbar {
  --background: #171719;
  --color: #ffffff;
  --border-color: #d92332;
}

.app-header ion-title {
  font-size: 18px;
  font-weight: 700;
}

.detail-content {
  --background: #f3f3f5;
}

.page-container {
  padding: 12px 12px 20px;
  max-width: 700px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background: transparent;
  border: 1px solid #333333;
  border-radius: 14px;
}

.back-members, .refresh-button{
    --background:transparent;
    --backround-hover: #2a2a2a;
    --background-activated:#333333;
    --box-shadow:none;
    --color:#e53945;
    --border-width:0;
    --ripple-color:transparent;
}

.back-members{
    font-weight: 700;
    text-transform: none;
}
.refresh-button{
    font-size: 22px;
}

.member-card {
  margin: 0;
  border-radius: 22px;
  border: 1px solid #dedee3;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.07);
  background: #ffffff;
}

.member-card ion-card-content {
  padding: 18px 15px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
}

.photo-container {
  width: 112px;
  height: 112px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: #202023;
  border: 3px solid #e8e8eb;
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.status-badge {
  margin-bottom: 10px;
  padding: 7px 12px;
  border-radius: 12px;
  font-size: 12px;
}

.profile-info h2 {
  color: #222228;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.3;
  overflow-wrap: anywhere;
  margin: 0 0 8px;
}

.member-id {
  font-size: 12px;
  color: #85858d;
  margin: 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 13px;
  margin: 18px 0;
  color: #5e6069;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.info-icon {
  font-size: 22px;
  color: #d92332;
  flex-shrink: 0;
}

.email-text {
  overflow-wrap: anywhere;
}

.personal-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 28px 0;
}

.personal-info div {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #777780;
}

.personal-info strong {
  font-size: 15px;
  color: #292930;
}

.separator {
  height: 1px;
  background: #eeeeef;
  margin: 22px 0;
}

.subscription-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subscription-heading h3 {
  color: #292930;
  font-size: 19px;
  font-weight: 750;
  margin: 0;
}

.subscription-arrow {
  --color: #85858d;
}

.subscription-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 28px;
  min-width: 0;
}

.subscription-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff0f1;
  color: #d92332;
}

.subscription-icon ion-icon {
  font-size: 27px;
}

.subscription-details {
  min-width: 0;
}

.subscription-details strong {
  display: block;
  font-size: 14px;
  color: #393941;
  overflow-wrap: anywhere;
}

.subscription-details p {
  margin: 7px 0 0;
  font-size: 12px;
  color: #81818a;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.action-buttons ion-button {
  min-width: 0;
  height: 48px;
  font-size: 13px;
  font-weight: 700;
  text-transform: none;
  --border-radius: 12px;
}

.edit-button {
  --background: #d92332;
  --background-activated: #b71927;
  --color: #ffffff;
}

.delete-button {
  --color: #d92332;
  --border-color: #d92332;
  --border-width: 1.5px;
  --border-style:solid;
  --border-radius:12px;
  --box-shadow:none;
  --background:#ffffff;
  --background-hover:#fff0f0
  --background-activated:#ffe5e5;
      height:48px;
      font-size: 12px;
      font-weight: 700;
      text-transform: none;
}

/* Navigation fixe en bas */
.bottom-footer {
  border-top: 1px solid #39393e;
}

.bottom-footer ion-toolbar {
  --background: #171719;
  --color: #ffffff;
  --min-height: 65px;
  --padding-start: 0;
  --padding-end: 0;
}

.bottom-nav {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 6px 2px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  padding: 5px 0;
  border: none;
  background: transparent;
  color: #aaaab1;
}

.nav-item ion-icon {
  font-size: 23px;
}

.nav-item span {
  font-size: 10px;
  white-space: nowrap;
}

.nav-item.active {
  color: #ef4444;
}

@media (max-width: 360px) {
  .member-card ion-card-content {
    padding: 14px 10px;
  }

  .profile-header {
    gap: 10px;
  }

  .photo-container {
    width: 88px;
    height: 88px;
  }

  .profile-info h2 {
    font-size: 16px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
