<template>
  <ion-page>
    <!-- EN-TÊTE -->
    <ion-header>
      <ion-toolbar class="header-dark">
        <ion-title>
          <span class="red">GESTION</span> DES MEMBRES
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- CONTENU -->
    <ion-content class="members-content">
      <div class="page-heading">
        <div>
          <h2>Membres</h2>
          <p>{{ membres.length }} membre(s) enregistré(s)</p>
        </div>
        <ion-icon :icon="peopleOutline" class="heading-icon" />
      </div>

      <!-- RECHERCHE -->
      <ion-searchbar
        v-model="recherche"
        placeholder="Rechercher un membre..."
        :debounce="200"
        class="search-box"
      />

      <!-- LISTE DES MEMBRES -->
      <div class="member-list">
        <div
          v-for="membre in membresFiltres"
          :key="membre.id"
          class="member-card"
        >
          <ion-avatar class="member-avatar">
            <img
              v-if="membre.photo"
              :src="membre.photo"
              :alt="membre.nom"
            />
            <div v-else class="avatar-placeholder">
              {{ membre.nom.charAt(0).toUpperCase() }}
            </div>
          </ion-avatar>

          <div class="member-info">
            <h3>{{ membre.nom }}</h3>
            <p>{{ membre.telephone }}</p>
            <small>{{ membre.adresse || 'Adresse non renseignée' }}</small>
          </div>

          <ion-badge
            :class="membre.statut === 'Actif' ? 'badge-active' : 'badge-expired'"
          >
            {{ membre.statut }}
          </ion-badge>
          <ion-button @click="ouvrirDetail(membre)">Voir détail</ion-button>
        </div>

        <div v-if="membresFiltres.length === 0" class="empty-state">
          <ion-icon :icon="peopleOutline" />
          <p>Aucun membre trouvé.</p>
        </div>
      </div>

      <!-- BOUTON AJOUTER -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed"
        class="add-fab">
        <ion-fab-button @click="ouvrirFormulaire">
          <ion-icon :icon="addOutline" />
        </ion-fab-button>
      </ion-fab>

      <!-- FORMULAIRE -->
      <ion-modal
        :is-open="formOuvert"
        @didDismiss="fermerFormulaire"
        :initial-breakpoint="0.92"
        :breakpoints="[0, 0.65, 0.92, 1]"
        handle
      >
        <ion-page>
          <ion-header>
            <ion-toolbar class="header-dark">
              <ion-title>Nouveau membre</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="fermerFormulaire">
                  Fermer
                </ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>

          <ion-content class="form-content">
            <form @submit.prevent="ajouterMembre">
              <!-- PHOTO -->
              <div class="photo-section">
                <div class="photo-preview" @click="choisirPhoto">
                  <img v-if="form.photo" :src="form.photo" alt="Photo membre" />
                  <ion-icon v-else :icon="cameraOutline" />
                  <span class="photo-edit">
                    <ion-icon :icon="addOutline" />
                  </span>
                </div>
                <h3>Photo du membre</h3>
                <p>Appuie sur la photo pour la sélectionner</p>

                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  capture="user"
                  hidden
                  @change="chargerPhoto"
                />
              </div>

              <!-- CHAMPS -->
              <div class="form-fields">
                <ion-label>Nom complet *</ion-label>
                <ion-input
                  v-model="form.nom"
                  placeholder="Ex. Jean RAKOTOMALALA"
                  required
                  fill="outline"
                  class="custom-input"
                />

                <ion-label>Téléphone *</ion-label>
                <ion-input
                  v-model="form.telephone"
                  type="tel"
                  placeholder="034 00 000 00"
                  required
                  fill="outline"
                  class="custom-input"
                />

                <ion-label>Adresse</ion-label>
                <ion-input
                  v-model="form.adresse"
                  placeholder="Ville, quartier..."
                  fill="outline"
                  class="custom-input"
                />

                <ion-label>Statut</ion-label>
                <ion-select
                  v-model="form.statut"
                  interface="popover"
                  fill="outline"
                  class="custom-input"
                  placeholder="Choisir le statut"
                >
                  <ion-select-option value="Actif">
                    Actif
                  </ion-select-option>
                  <ion-select-option value="Expiré">
                    Expiré
                  </ion-select-option>
                </ion-select>

                <ion-label>Date d'inscription</ion-label>
                <ion-input
                  v-model="form.dateInscription"
                  type="date"
                  fill="outline"
                  class="custom-input"
                />

                <ion-button
                  expand="block"
                  type="submit"
                  class="save-button"
                >
                  <ion-icon :icon="personAddOutline" slot="start" />
                  Enregistrer le membre
                </ion-button>

                <ion-button
                  expand="block"
                  fill="outline"
                  class="cancel-button"
                  @click="fermerFormulaire"
                >
                  Annuler
                </ion-button>
              </div>
            </form>
          </ion-content>
        </ion-page>
      </ion-modal>
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

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonAvatar,
  IonIcon,
  IonBadge,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonButton,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonFooter,
} from '@ionic/vue';

import {
  homeOutline,
  peopleOutline,
  calendarOutline,
  cardOutline,
  ellipsisHorizontal,
  addOutline,
  cameraOutline,
  personAddOutline,
  logOutOutline,notificationsOutline,
  personOutline,timeOutline,settingsOutline
} from 'ionicons/icons';

const router = useRouter();

interface Membre {
  id: number;
  nom: string;
  telephone: string;
  adresse: string;
  statut: string;
  photo: string;
  dateInscription: string;
}

// Exemples de membres
const membres = ref<Membre[]>([
  {
    id: 1,
    nom: 'Jean RAKOTOMALALA',
    telephone: '034 56 789 01',
    adresse: 'Antananarivo',
    statut: 'Actif',
    photo: '',
    dateInscription: '2026-10-01',
  },
  {
    id: 2,
    nom: 'Paul ANDRIANASOLO',
    telephone: '034 12 345 67',
    adresse: 'Antananarivo',
    statut: 'Actif',
    photo: '',
    dateInscription: '2026-10-02',
  },
  {
    id: 3,
    nom: 'Sokoto RAKOTO',
    telephone: '032 98 765 43',
    adresse: 'Antananarivo',
    statut: 'Actif',
    photo: '',
    dateInscription: '2026-10-03',
  },
  {
    id: 4,
    nom: 'Tom RAZAFIARISOA',
    telephone: '033 11 222 33',
    adresse: 'Antananarivo',
    statut: 'Expiré',
    photo: '',
    dateInscription: '2026-09-01',
  },
]);

const recherche = ref('');
const formOuvert = ref(false);
const photoInput = ref<HTMLInputElement | null>(null);

const dateDuJour = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
};

const formulaireVide = () => ({
  nom: '',
  telephone: '',
  adresse: '',
  statut: 'Actif',
  photo: '',
  dateInscription: dateDuJour(),
});

const form = reactive(formulaireVide());

const membresFiltres = computed(() => {
  const terme = recherche.value.trim().toLowerCase();

  return membres.value.filter((m) =>
    `${m.nom} ${m.telephone} ${m.adresse}`
      .toLowerCase()
      .includes(terme)
  );
});

function ouvrirFormulaire() {
  Object.assign(form, formulaireVide());
  formOuvert.value = true;
}

function fermerFormulaire() {
  formOuvert.value = false;
}

function choisirPhoto() {
  photoInput.value?.click();
}

function chargerPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const fichier = input.files?.[0];

  if (!fichier) return;

  if (!fichier.type.startsWith('image/')) {
    alert('Veuillez choisir une image.');
    input.value = '';
    return;
  }

  if (fichier.size > 5 * 1024 * 1024) {
    alert('La photo doit faire moins de 5 Mo.');
    input.value = '';
    return;
  }

  const lecteur = new FileReader();

  lecteur.onload = () => {
    if (typeof lecteur.result === 'string') {
      form.photo = lecteur.result;
    }
  };

  lecteur.readAsDataURL(fichier);
}

function ajouterMembre() {
  const nom = form.nom.trim();
  const telephone = form.telephone.trim();

  if (!nom || !telephone) {
    alert('Veuillez renseigner le nom et le téléphone.');
    return;
  }

  membres.value.unshift({
    id: Date.now(),
    nom,
    telephone,
    adresse: form.adresse.trim(),
    statut: form.statut,
    photo: form.photo,
    dateInscription: form.dateInscription,
  });

  fermerFormulaire();
  recherche.value = '';
  alert('Membre ajouté avec succès !');
}

const activeTab = ref('Dashboard')
const isMoreOpen = ref(false)
const navItems = [
 { label: 'Dashboard', icon: homeOutline, path: '/dashboard' },
  { label: 'Membres', icon: peopleOutline, path: '/members' },
  { label: 'Paiements', icon: cardOutline, path: '/payments' },
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

 function ouvrirDetail(membre){
  router.push('/members/detail/${membre.id}')
 }
</script>

<style scoped>
ion-page {
  --ion-background-color: #f4f4f6;
}

.header-dark {
  --background: #171719;
  --color: #ffffff;
}

.header-dark ion-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.red {
  color: #ff303b;
}

.members-content {
  --background: #f4f4f6;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 5px;
}

.page-heading h2 {
  margin: 0;
  color: #191919;
  font-size: 23px;
  font-weight: 800;
}

.page-heading p {
  margin: 5px 0 0;
  color: #777;
  font-size: 12px;
}

.heading-icon {
  font-size: 27px;
  color: #e52332;
}

.search-box {
  --background: #fff;
  --border-radius: 13px;
  --box-shadow: 0 3px 10px #0000000c;
  --color: #222;
  --placeholder-color: #888;
  padding: 8px 12px 12px;
}

.member-list {
  padding: 0 13px 100px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 10px;
  padding: 13px 10px;
  background: #fff;
  border-radius: 14px;
  border-left: 3px solid #e52332;
  box-shadow: 0 2px 9px #00000009;
}

.member-avatar {
  width: 53px;
  height: 53px;
  flex-shrink: 0;
  background: #29292d;
}

.member-avatar img,
.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  font-size: 23px;
  font-weight: bold;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-info h3 {
  margin: 0 0 5px;
  font-size: 13px;
  color: #191919;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.member-info p {
  margin: 0 0 4px;
  font-size: 12px;
  color: #555;
}

.member-info small {
  color: #888;
  font-size: 10px;
}

ion-badge {
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px 7px;
  border-radius: 7px;
}

.badge-active {
  color: #16844a;
  background: #e0f5e8;
}

.badge-expired {
  color: #cf2635;
  background: #ffe3e6;
}

.empty-state {
  text-align: center;
  padding: 40px 10px;
  color: #777;
}

.empty-state ion-icon {
  font-size: 42px;
}

.add-fab {
  margin-bottom: 74px;
  margin-right: 8px;
}

.add-fab ion-fab-button {
  --background: #e52332;
  --background-activated: #bd1725;
  --color: white;
  --box-shadow: 0 4px 12px #e5233250;
}

.bottom-footer {
  background: #171719;
}

.bottom-toolbar {
  --background: #171719;
  --color: #aaa;
  --min-height: 65px;
  --padding-start: 0;
  --padding-end: 0;
}

.bottom-nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding: 6px 2px max(6px, env(safe-area-inset-bottom));
}

.nav-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  background: transparent;
  color: #a2a2a8;
  font-size: 9px;
  cursor: pointer;
}

.nav-item ion-icon {
  font-size: 22px;
}

.nav-item.selected {
  color: #ff303b;
}

.nav-item.selected ion-icon {
  filter: drop-shadow(0 0 4px #ff303b55);
}

.form-content {
  --background: #f5f5f7;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 22px 10px;
  background: #fff;
}

.photo-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 104px;
  height: 104px;
  overflow: hidden;
  border: 3px solid #e52332;
  border-radius: 50%;
  background: #242428;
  color: white;
  cursor: pointer;
}

.photo-preview > ion-icon {
  font-size: 39px;
}

.photo-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e52332;
  color: white;
}

.photo-section h3 {
  margin: 12px 0 4px;
  font-size: 16px;
  font-weight: 800;
}

.photo-section p {
  margin: 0;
  color: #777;
  font-size: 12px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 20px 16px 30px;
}

.form-fields ion-label {
  margin-top: 7px;
  color: #292929;
  font-size: 13px;
  font-weight: 700;
}

.custom-input {
  --background: #fff;
  --color: #222;
  --border-color: #ddd;
  --border-radius: 10px;
  --highlight-color-focused: #e52332;
  margin-bottom: 4px;
}

.save-button {
  --background: #e52332;
  --background-activated: #bd1725;
  --border-radius: 11px;
  height: 49px;
  margin-top: 15px;
  font-weight: 800;
}

.cancel-button {
  --color: #333;
  --border-color: #bbb;
  --border-radius: 11px;
  height: 45px;
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