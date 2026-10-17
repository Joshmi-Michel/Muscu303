<template>
    <ion-page>
        <ion-content :fullscreen="true" class="register-content">
            <div class="register-screen">
                <header class="top-bar">
                    <button type="button" class="back-button" @click="goBack" aria-label="Retour">
                        <ion-icon :icon="checkmarkCircleOutline" clear="top-check" />
                    </button>
                </header>
                <section class="heading">
                    <div class="red-dash"></div>
                    <h1>Inscription</h1>
                    <p>Rejoins 303 Musculation et Fitness</p>
                </section>
                <!--Avatar-->
                <div class="avatar-ring">
                    <ion-icon :icon="personAddOutline" />
                </div>
                <form class="register-form" @submit.prevent="register">
                    <div class="input-card">
                        <div class="input-row">
                            <ion-icon :icon="personOutline" class="field-icon"/>
                            <input type="text" v-model.trim="form.fullName" placeholder="Nom complet" autocomplete="name" required/>
                        </div>
                        <div class="input-divider"></div>
                        <div class="input-row">
                            <ion-icon :icon="atOutline" class="field-icon"/>
                            <input v-model.trim="form.username" type="text" placeholder="Nom d'utilisateur" autocomplete="username" minlength="3" required/>
                        </div>
                        <div class="input-divider"></div>
                        <div class="input-row">
                            <ion-icon :icon="callOutline" class="field-icon"/>
                            <input v-model.trim="form.telephone" type="text" placeholder="Telephone" autocomplete="telephone" required />
                        </div>
                        <div class="input-divider"></div>
                        <div class="input-row">
                            <ion-icon :icon="lockClosedOutline" class="field-icon"/>
                            <input v-model="form.password" :type="showPassword ? 'text':'password'" placeholder="Mot de passe" autocomplete="new-password" minlength="8" required/>
                            <button type="button" class="eye-button" @click="showPassword=!showPassword" :aria-label="showPassword ? 'Masquer le mot de passe':'Afficher le mot de passe'">
                                <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline"/>
                            </button>
                        </div>
                        <div class="input-divider"></div>
                        <div class="input-row">
                            <ion-icon :icon="shieldCheckmarkOutline" class="field-icon"/>
                            <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text': 'password'" placeholder="Confirmer le mot de passe" minlength="8" required/>
                            <button type="button" class="eye-button" @click="showConfirmPassword=!showConfirmPassword" :aria-label="showConfirmPassword ? 'Masquer la confirmation':'Afficher confirmation'">
                                <ion-icon :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"/>
                            </button>
                        </div>
                    </div>
                    <!--Condition-->
                    <label class="terms-row">
                       <input v-model="acceptedTerms" type="checkbox" required />
                       <span> J'accept les condition d'utilisation et la politique de confidentialité</span>
                    </label>
                    <!--Bouton inscription-->
                    <button type="submit" class="submit-button" :disabled="loading">{{ loading ? 'inscription...':'Créer mon compte' }}</button>
                    <!--Message-->
                    <p v-if="message" class="feedback" :class="{success:isSuccess}" role="status">{{ message }}</p>
                    <!--Connection-->
                    <p class="login-link">
                        Tu as déjà un compte ?
                        <button type="button" @click="goToLogin">Se connecter</button>
                    </p>
                </form>
                <footer class="footer">303 MUSCULATION ET FITNESS</footer>
            </div>
        </ion-content>
    </ion-page>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonIcon } from '@ionic/vue'
import { arrowBackOutline, checkmarkCircleOutline, personAddOutline, personOutline,atOutline, callOutline,
    lockClosedOutline, shieldCheckmarkOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

    const router = useRouter();
    const form = reactive({fullName:'', username:'', telephone:'', password:'', confirmPassword:'' });
    const showPassword  = ref(false)
    const showConfirmPassword = ref(false)
    const acceptedTerms = ref(false)
    const loading       = ref(false)
    const message = ref('')
    const isSuccess     = ref(false)

    function goBack(){
        if(window.history.length > 1){
            router.back()
        }else{
            router.push('/login')
        }
    }
    function goToLogin(){
        router.push('/login')
    }
    async function register(){
        message.value=''
        isSuccess.value =false
        if(!form.fullName || !form.username || !form.telephone || !form.password || !form.confirmPassword){
            message.value ='Veuillez remplir tous les champs'
            return 
        }
        if(form.username.length <3 ){
            message.value ='Le nom dutilisateur doit contenir au moin 3 caractères'
            return
        }
        if(form.password.length <8){
            message.value ='Le mot de passe doit contenir au moin 8 caractères'
            return
        }
        if(form.password !==form.confirmPassword){
            message.value ='Les mots de passe ne correspondent pas'
            return
        }
        if(!acceptedTerms.value){
            message.value ='Veuillez accepter les conditions d utilisation.'
            return
        }
        //Demonstration uniquement
        // branche ici ton API ou ton service d'authentification
        message.value ='Formulaire valide. connecte maintenant ton service d inscription'
       loading.value =true
       try{
         await new Promise(resolve=>setTimeout(resolve, 2000))
         console.log("Traitement terminé")
       }finally{loading.value=false}
    }
</script>
<style scoped>
   .register-content {
  --background: #080809;
}

.register-screen {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding:
    max(20px, env(safe-area-inset-top))
    7%
    max(28px, env(safe-area-inset-bottom));
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
  display: flex;
  align-items: center;
  padding: 8px 0;
  border: none;
  background: transparent;
  color: #ff1744;
  font-size: 31px;
}

.top-check {
  color: #ff1744;
  font-size: 32px;
}

.heading {
  margin-top: 28px;
  text-align: center;
}

.red-dash {
  width: 32px;
  height: 6px;
  margin: 0 auto 18px;
  border-radius: 10px;
  background: #ff1744;
}

.heading h1 {
  margin: 0;
  font-size: clamp(32px, 7vw, 43px);
  font-weight: 800;
  letter-spacing: -0.8px;
}

.heading p {
  margin-top: 10px;
  color: #a5a5b2;
  font-size: 15px;
}

.avatar-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  margin: 25px auto 26px;
  border: 3px solid #ff304f;
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(255, 23, 68, 0.12);
  color: #ffdce4;
  font-size: 40px;
}

.register-form {
  width: 100%;
}

.input-card {
  padding: 5px 17px;
  border-radius: 25px;
  background: #f8f8fa;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 61px;
}

.field-icon {
  flex-shrink: 0;
  color: #e52b50;
  font-size: 23px;
}

.input-row input {
  width: 100%;
  min-width: 0;
  padding: 10px 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #202027;
  font-size: 14px;
}

.input-row input::placeholder {
  color: #777b89;
  opacity: 1;
}

.input-divider {
  height: 1px;
  background: #dedfe5;
}

.eye-button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 8px 0 8px 5px;
  border: 0;
  background: transparent;
  color: #e52b50;
  font-size: 22px;
}

.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin: 22px 0 25px;
  color: #dddde4;
  font-size: 12px;
  line-height: 1.6;
}

.terms-row input {
  flex-shrink: 0;
  width: 19px;
  height: 19px;
  margin: 1px 0 0;
  accent-color: #ff1744;
}

.submit-button {
  width: 100%;
  min-height: 59px;
  padding: 12px;
  border: none;
  border-radius: 21px;
  background: linear-gradient(100deg, #ff1760, #ff286b);
  box-shadow: 0 10px 28px rgba(255, 23, 68, 0.2);
  color: white;
  font-size: 17px;
  font-weight: 750;
}

.submit-button:disabled {
  opacity: 0.65;
}

.feedback {
  margin: 16px 0;
  color: #ffb2c3;
  text-align: center;
  font-size: 13px;
}

.feedback.success {
  color: #8ce9ad;
}

.login-link {
  margin-top: 24px;
  color: #b5b5c0;
  text-align: center;
  font-size: 13px;
}

.login-link button {
  padding: 4px;
  border: none;
  background: transparent;
  color: #ff7898;
  font-weight: 700;
}

.footer {
  margin-top: auto;
  padding-top: 32px;
  color: #ff8aa6;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  line-height: 1.8;
}

@media (max-height: 760px) {
  .heading {
    margin-top: 15px;
  }

  .avatar-ring {
    width: 76px;
    height: 76px;
    margin: 17px auto;
    font-size: 32px;
  }

  .input-row {
    min-height: 53px;
  }

  .terms-row {
    margin: 15px 0;
  }

  .footer {
    padding-top: 24px;
  }
}
</style>