<template>
    <ion-page>
        <ion-content :fullscreen="true" class="forgot-content">
            <div class="forgot-screen">
                <header class="top-bar">
                    <button type="button" class="back-button" @click="goBack" aria-label="retour">
                        <ion-icon :icon="arrowBackOutline" />
                    </button>
                    <ion-icon :icon="shieldCheckmark" class="top-icon"/>
                </header>
                <!--Titre-->
                <section class="heading">
                    <div class="red-dash"></div>
                    <h1>Mot de passe Oublié ?</h1>
                    <p>Pas d'inquiétude! Saisis ton adresse e-mail pour réinitialiser ton mot de passe.</p>
                </section>
                <!--Icône central-->
                <div class="icon-ring">
                    <ion-icon :icon="lockOpenOutline"/>
                </div>
                <!--Formulaire-->
                <form class="forgot-form" @submit.prevent="resetPassword">
                    <div class="input-card">
                        <ion-icon :icon="mailOutline" class="field-icon"/>
                        <input v-model.trim="email" type="email"  placeholder="Ton adrese e-mail" autocomplete="email" required/>
                    </div>
                    <button class="submit-button" type="submit" :disabled="loading">
                        {{ loading ? 'Envoi en cours...':'Réinitialiser le mot de passe' }}
                    </button>
                    <p v-if="message" class="feedback" :class="{success:isSuccess}" role="status">{{ message }}</p>
                    <button type="button" class="login-button" @click="goToLogin">
                        <ion-icon :icon="arrowBackOutline"/>
                        Retour à la connection
                    </button>
                </form>
                <footer class="footer">303 MUSCULATION ET FITNESS</footer>
            </div>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { shieldCheckmark, arrowBackOutline, lockOpenOutline, mailOutline } from 'ionicons/icons';
import { ref } from 'vue'
import {IonPage,IonContent, IonIcon} from '@ionic/vue'
import { useRouter } from 'vue-router'

const router  = useRouter()
const email   = ref('')
const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

function goBack(){
    if(window.history.length>1){
        router.back()
    }else{
        router.push('/login')
    }
}

function goToLogin(){
    router.push('/login')
}

async function resetPassword(){
   message.value=''
   isSuccess.value=false
   if(email.value){
    message.value='Veuiller saisir ton adresse e-mail.'
    return
   }
   loading.value=true
   try{
     //Aremplacer par l'appel à ton service d'authentification
     //auccun e-mail n'est envoyer par ce code de démonstration
     message.value='Interface prête. Connecte ton service pour envoyer le lien de réinitialisation'
   }finally{
    loading.value=false
   }
}
</script>
<style scoped>
.forgot-content {
  --background: #080809;
}

.forgot-screen {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding:
    max(22px, env(safe-area-inset-top))
    8%
    max(30px, env(safe-area-inset-bottom));
  color: #fff;
  background:
    radial-gradient(
      ellipse at 50% 105%,
      rgba(255, 0, 65, 0.34),
      transparent 42%
    ),
    linear-gradient(160deg, #080809 45%, #10080c 100%);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  padding: 8px 0;
  border: none;
  background: transparent;
  color: #ff1744;
  font-size: 31px;
}

.top-icon {
  color: #ff1744;
  font-size: 32px;
}

.heading {
  margin-top: 48px;
  text-align: center;
}

.red-dash {
  width: 32px;
  height: 6px;
  margin: 0 auto 24px;
  border-radius: 10px;
  background: #ff1744;
}

.heading h1 {
  margin: 0;
  font-size: clamp(29px, 7vw, 39px);
  font-weight: 800;
  line-height: 1.2;
}

.heading p {
  max-width: 320px;
  margin: 16px auto 0;
  color: #a5a5b2;
  font-size: 15px;
  line-height: 1.7;
}

.icon-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  margin: 45px auto;
  border: 3px solid #ff304f;
  border-radius: 50%;
  box-shadow: 0 0 28px rgba(255, 23, 68, 0.14);
  color: #ffdce4;
  font-size: 55px;
}

.forgot-form {
  width: 100%;
}

.input-card {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 76px;
  padding: 0 20px;
  border-radius: 23px;
  background: #f8f8fa;
}

.field-icon {
  flex-shrink: 0;
  color: #e52b50;
  font-size: 27px;
}

.input-card input {
  width: 100%;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  color: #222;
  font-size: 15px;
}

.input-card input::placeholder {
  color: #777b89;
  opacity: 1;
}

.submit-button {
  width: 100%;
  min-height: 62px;
  margin-top: 32px;
  padding: 12px;
  border: none;
  border-radius: 22px;
  background: linear-gradient(100deg, #ff1760, #ff286b);
  box-shadow: 0 10px 28px rgba(255, 23, 68, 0.2);
  color: #fff;
  font-size: 16px;
  font-weight: 750;
}

.submit-button:disabled {
  opacity: 0.65;
}

.feedback {
  margin-top: 20px;
  color: #ffb2c3;
  text-align: center;
  font-size: 14px;
  line-height: 1.6;
}

.feedback.success {
  color: #8ce9ad;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 28px auto 0;
  padding: 10px;
  border: none;
  background: transparent;
  color: #ffb2c3;
  font-size: 15px;
}

.footer {
  margin-top: auto;
  padding-top: 55px;
  color: #ff8aa6;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  line-height: 1.8;
}

@media (max-height: 720px) {
  .heading {
    margin-top: 25px;
  }

  .icon-ring {
    width: 100px;
    height: 100px;
    margin: 25px auto;
    font-size: 42px;
  }

  .footer {
    padding-top: 30px;
  }
}
</style>