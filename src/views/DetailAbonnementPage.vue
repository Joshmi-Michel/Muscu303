<template>
  <ion-page>
    <!-- En-tête -->
    <ion-header>
      <ion-toolbar class="top-toolbar">
        <ion-buttons slot="start">
          <ion-back-button
            default-href="/abonnement"
            text=""
          />
        </ion-buttons>
        <ion-title>Détail abonnement</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="detail-content">
      <div class="page-container">

        <!-- Titre de la page -->
        <div class="page-heading">
          <div>
            <h1>Détail de l'abonnement</h1>
            <p>Informations du membre et de sa souscription</p>
          </div>
          <div class="heading-icon">
            <ion-icon :icon="cardOutline" />
          </div>
        </div>

        <!-- Abonnement introuvable -->
        <div v-if="!abonnement" class="empty-card">
          <ion-icon :icon="alertCircleOutline" />
          <h2>Abonnement introuvable</h2>
          <p>Les informations de cet abonnement ne sont pas disponibles.</p>
          <ion-button
            class="primary-button"
            @click="router.replace('/abonnement')"
          >
            Retour aux abonnements
          </ion-button>
        </div>

        <template v-else>
          <!-- Carte principale du membre -->
          <section class="member-card">
            <div class="member-avatar">
              {{ initiale }}
            </div>

            <div class="member-main">
              <span class="small-label">MEMBRE</span>
              <h2>{{ abonnement.nom }}</h2>
              <p>303 Musculation et Fitness</p>
            </div>

            <span
              class="status-badge"
              :class="statut === 'Actif' ? 'status-active' : 'status-expired'"
            >
              <span class="status-dot"></span>
              {{ statut }}
            </span>
          </section>

          <!-- Résumé du prix -->
          <section class="price-card">
            <div class="price-icon">
              <ion-icon :icon="pricetagOutline" />
            </div>

            <div class="price-info">
              <p>Montant de l'abonnement</p>
              <h2>{{ formatPrix(abonnement.prix) }}</h2>
              <span>{{ abonnement.dureeLabel || abonnement.duree }}</span>
            </div>

            <ion-icon
              class="price-watermark"
              :icon="barbellOutline"
            />
          </section>

          <!-- Informations du membre -->
          <section class="info-card">
            <div class="section-heading">
              <div class="section-icon">
                <ion-icon :icon="personOutline" />
              </div>
              <div>
                <h3>Informations du membre</h3>
                <p>Identité et coordonnées</p>
              </div>
            </div>

            <div class="info-row">
              <span>Nom complet</span>
              <strong>{{ abonnement.nom }}</strong>
            </div>

            <div class="info-row">
              <span>Téléphone</span>
              <strong>{{ abonnement.telephone || 'Non renseigné' }}</strong>
            </div>

            <div class="info-row">
              <span>E-mail</span>
              <strong>{{ abonnement.email || 'Non renseigné' }}</strong>
            </div>
          </section>

          <!-- Informations de l'abonnement -->
          <section class="info-card">
            <div class="section-heading">
              <div class="section-icon">
                <ion-icon :icon="calendarOutline" />
              </div>
              <div>
                <h3>Informations de l'abonnement</h3>
                <p>Durée et période de validité</p>
              </div>
            </div>

            <div class="info-row">
              <span>Référence</span>
              <strong>#{{ abonnement.id }}</strong>
            </div>

            <div class="info-row">
              <span>Formule choisie</span>
              <strong>{{ abonnement.dureeLabel || abonnement.duree }}</strong>
            </div>

            <div class="info-row">
              <span>Date de début</span>
              <strong>{{ formaterDate(abonnement.dateDebut) }}</strong>
            </div>

            <div class="info-row">
              <span>Date de fin prévue</span>
              <strong>{{ formaterDate(dateFin) }}</strong>
            </div>

            <div class="info-row">
              <span>Durée totale</span>
              <strong>{{ abonnement.mois || '?' }} mois</strong>
            </div>
          </section>

          <!-- Paiement -->
          <section class="info-card">
            <div class="section-heading">
              <div class="section-icon">
                <ion-icon :icon="walletOutline" />
              </div>
              <div>
                <h3>Informations de paiement</h3>
                <p>Détails du règlement</p>
              </div>
            </div>

            <div class="info-row">
              <span>Montant payé</span>
              <strong class="red-text">
                {{ formatPrix(abonnement.prix) }}
              </strong>
            </div>

            <div class="info-row">
              <span>Mode de paiement</span>
              <strong>
                {{ abonnement.modePaiementLabel ||
                   abonnement.modePaiement ||
                   'Non renseigné' }}
              </strong>
            </div>

            <div class="info-row">
              <span>Statut</span>
              <strong :class="statut === 'Actif' ? 'green-text' : 'red-text'">
                {{ statut }}
              </strong>
            </div>
          </section>

          <!-- Actions -->
          <section class="actions-section">
            <ion-button
              expand="block"
              class="primary-button"
              @click="modifierAbonnement"
            >
              <ion-icon slot="start" :icon="createOutline" />
              Modifier l'abonnement
            </ion-button>

            <ion-button
              expand="block"
              fill="outline"
              class="delete-button"
              @click="confirmerSuppression"
            >
              <ion-icon slot="start" :icon="trashOutline" />
              Supprimer l'abonnement
            </ion-button>

            <ion-button
              expand="block"
              fill="clear"
              class="back-button"
              @click="router.push('/abonnement')"
            >
              <ion-icon slot="start" :icon="arrowBackOutline" />
              Retour à l'historique
            </ion-button>
          </section>
        </template>
      </div>
    </ion-content>

    <!-- Navigation inférieure -->
    <ion-footer class="bottom-footer">
      <nav class="bottom-nav">
        <button @click="naviguer('/dashboard')">
          <ion-icon :icon="homeOutline" />
          <span>Dashboard</span>
        </button>

        <button @click="naviguer('/members')">
          <ion-icon :icon="peopleOutline" />
          <span>Membres</span>
        </button>

        <button @click="naviguer('/payments')">
          <ion-icon :icon="walletOutline" />
          <span>Paiements</span>
        </button>

        <button
          class="nav-active"
          @click="naviguer('/abonnement')"
        >
          <ion-icon :icon="cardOutline" />
          <span>Abonnements</span>
        </button>

        <button @click="naviguer('/more')">
          <ion-icon :icon="ellipsisHorizontalOutline" />
          <span>Plus</span>
        </button>
      </nav>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
  IonIcon,
  IonButton
} from '@ionic/vue'

import {
  cardOutline,
  personOutline,
  calendarOutline,
  pricetagOutline,
  walletOutline,
  barbellOutline,
  createOutline,
  trashOutline,
  arrowBackOutline,
  homeOutline,
  peopleOutline,
  ellipsisHorizontalOutline,
  alertCircleOutline
} from 'ionicons/icons'

const route = useRoute()
const router = useRouter()

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

const abonnement = computed(() => {
  return chargerAbonnements().find(
    item => String(item.id) === String(route.params.id)
  ) || null
})

const initiale = computed(() => {
  return abonnement.value?.nom?.trim()?.charAt(0).toUpperCase() || '?'
})

function calculerDateFin(dateDebut, mois) {
  if (!dateDebut || !mois) return null

  const [annee, moisDepart, jour] = dateDebut
    .split('-')
    .map(Number)

  if (!annee || !moisDepart || !jour) return null

  const date = new Date(
    annee,
    moisDepart - 1 + Number(mois),
    1
  )

  const dernierJour = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate()

  date.setDate(Math.min(jour, dernierJour))
  date.setDate(date.getDate() - 1)

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-')
}

const dateFin = computed(() => {
  if (!abonnement.value) return null

  // Utilise la date de fin enregistrée si elle existe.
  return abonnement.value.dateFin ||
    calculerDateFin(
      abonnement.value.dateDebut,
      abonnement.value.mois
    )
})

function formaterDate(date) {
  if (!date) return 'Non renseignée'

  const morceaux = date.split('-')
  if (morceaux.length !== 3) return date

  return `${morceaux[2]}/${morceaux[1]}/${morceaux[0]}`
}

const statut = computed(() => {
  if (!dateFin.value) return 'Inconnu'

  const maintenant = new Date()
  const aujourdHui = [
    maintenant.getFullYear(),
    String(maintenant.getMonth() + 1).padStart(2, '0'),
    String(maintenant.getDate()).padStart(2, '0')
  ].join('-')

  return dateFin.value >= aujourdHui ? 'Actif' : 'Expiré'
})

function formatPrix(prix) {
  return new Intl.NumberFormat('fr-FR').format(
    Number(prix) || 0
  ) + ' Ar'
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

function modifierAbonnement() {
  if (!abonnement.value) return

  router.push({
    path: '/abonnement',
    query: { modifier: String(abonnement.value.id) }
  })
}

async function confirmerSuppression() {
  if (!abonnement.value) return

  const alert = await alertController.create({
    header: 'Confirmer la suppression',
    message: `Voulez-vous supprimer l'abonnement de ${abonnement.value.nom} ?`,
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel'
      },
      {
        text: 'Supprimer',
        role: 'destructive',
        handler: async () => {
          const liste = chargerAbonnements().filter(
            item => String(item.id) !== String(route.params.id)
          )

          localStorage.setItem(
            'abonnements',
            JSON.stringify(liste)
          )

          await afficherMessage('Abonnement supprimé.')
          router.replace('/abonnement')
        }
      }
    ]
  })

  await alert.present()
}

function naviguer(path) {
  router.push(path)
}
</script>
<style scoped>
ion-page {
  --ion-background-color: #e8f0fa;
}

.top-toolbar {
  --background: #e8f0fa;
  --color: #17243a;
  --border-color: transparent;
}

.detail-content {
  --background: linear-gradient(145deg, #edf3fb, #dce8f7);
  --color: #17243a;
}

.page-container {
  max-width: 850px;
  margin: auto;
  padding: 14px;
}

/* Titre */
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 10px 0 22px;
}

.page-heading h1 {
  margin: 0;
  color: #17243a;
  font-size: 23px;
  font-weight: 900;
}

.page-heading p {
  margin: 7px 0 0;
  color: #71839c;
  font-size: 13px;
  line-height: 1.5;
}

.heading-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 15px;
  color: white;
  background: #ed2938;
}

.heading-icon ion-icon {
  font-size: 28px;
}

/* Carte du membre */
.member-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 19px 15px;
  margin-bottom: 15px;
  border-left: 5px solid #ed2938;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 5px 18px #344d6b10;
}

.member-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #17243a;
  color: #ffffff;
  font-size: 28px;
  font-weight: 900;
}

.member-main {
  flex: 1;
  min-width: 0;
}

.small-label {
  color: #7d8ba0;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.member-main h2 {
  margin: 5px 0;
  color: #17243a;
  font-size: 17px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.member-main p {
  margin: 0;
  color: #72839b;
  font-size: 12px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  flex-shrink: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 800;
}

.status-active {
  color: #087b5b;
  background: #d8f4e9;
}

.status-expired {
  color: #bd2634;
  background: #ffe3e6;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

/* Carte du prix */
.price-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  overflow: hidden;
  padding: 20px;
  margin-bottom: 16px;
  border-radius: 17px;
  color: #ffffff;
  background: linear-gradient(115deg, #f03a47, #c91d2d);
  box-shadow: 0 6px 15px #d8243524;
}

.price-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  border-radius: 14px;
  background: #ffffff26;
}

.price-icon ion-icon {
  font-size: 30px;
}

.price-info {
  position: relative;
  z-index: 1;
}

.price-info p {
  margin: 0 0 5px;
  color: #ffe6e8;
  font-size: 13px;
}

.price-info h2 {
  margin: 0;
  color: #ffffff;
  font-size: 27px;
  font-weight: 900;
}

.price-info span {
  display: inline-block;
  margin-top: 7px;
  padding: 5px 10px;
  border-radius: 20px;
  color: #ffffff;
  background: #ffffff24;
  font-size: 12px;
  font-weight: 700;
}

.price-watermark {
  position: absolute;
  right: 12px;
  bottom: -10px;
  color: #ffffff18;
  font-size: 95px;
}

/* Cartes de détails */
.info-card {
  padding: 17px;
  margin-bottom: 15px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 5px 18px #344d6b0c;
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e8edf5;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #ffeaec;
  color: #e92736;
}

.section-icon ion-icon {
  font-size: 24px;
}

.section-heading h3 {
  margin: 0;
  color: #17243a;
  font-size: 15px;
  font-weight: 900;
}

.section-heading p {
  margin: 5px 0 0;
  color: #8190a5;
  font-size: 12px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #edf1f7;
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-row span {
  color: #71819a;
  font-size: 13px;
}

.info-row strong {
  max-width: 60%;
  text-align: right;
  color: #24344c;
  font-size: 13px;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.red-text {
  color: #e92736 !important;
}

.green-text {
  color: #087b5b !important;
}

/* Boutons */
.actions-section {
  padding: 4px 0 18px;
}

.primary-button {
  --background: #ed2938;
  --background-activated: #c91d2d;
  --color: #ffffff;
  --border-radius: 13px;
  height: 49px;
  margin: 8px 0 12px;
  font-weight: 800;
  text-transform: none;
  box-shadow: 0 5px 12px #ed29381f;
}

.delete-button {
  --color: #e92736;
  --border-color: #ed2938;
  --border-radius: 13px;
  height: 47px;
  margin: 0 0 9px;
  font-weight: 800;
  text-transform: none;
}

.back-button {
  --color: #354760;
  height: 43px;
  font-weight: 700;
  text-transform: none;
}

/* Abonnement introuvable */
.empty-card {
  padding: 30px 18px;
  border-radius: 17px;
  text-align: center;
  background: #ffffff;
}

.empty-card > ion-icon {
  color: #ed2938;
  font-size: 50px;
}

.empty-card h2 {
  color: #17243a;
  font-size: 19px;
}

.empty-card p {
  color: #71839c;
  font-size: 13px;
  line-height: 1.6;
}

/* Navigation du bas */
.bottom-footer {
  background: #263448;
}

.bottom-nav {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  padding: 8px 2px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  background: #263448;
}

.bottom-nav button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 0;
  padding: 7px 1px;
  border: none;
  color: #c2cddd;
  background: transparent;
  font-size: 10px;
}

.bottom-nav button ion-icon {
  font-size: 23px;
}

.bottom-nav button span {
  white-space: nowrap;
}

.bottom-nav .nav-active {
  color: #ff4754;
  font-weight: 800;
}

/* Téléphones */
@media (max-width: 420px) {
  .page-container {
    padding: 9px;
  }

  .page-heading h1 {
    font-size: 20px;
  }

  .member-card {
    flex-wrap: wrap;
    gap: 10px;
    padding: 13px 10px;
  }

  .member-avatar {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }

  .member-main {
    flex-basis: calc(100% - 75px);
  }

  .status-badge {
    margin-left: auto;
  }

  .price-info h2 {
    font-size: 23px;
  }

  .info-card {
    padding: 13px;
  }

  .info-row {
    gap: 8px;
  }

  .info-row span,
  .info-row strong {
    font-size: 12px;
  }

  .bottom-nav button {
    font-size: 9px;
  }

  .bottom-nav button ion-icon {
    font-size: 20px;
  }
}
</style>