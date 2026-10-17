<template>
    <ion-page>
        <ion-content :fullscreen="true" class="login-content">
            <div class="login-container">
                 <!--En Tête-->
                <div class="top-bar">
                    <ion-icon :icon="arrowBackOutline" @click="goBack"/>
                    <ion-icon :icon="shieldCheckmarkOutline"/>
                </div>

                <div class="login-header">
                   <div class="red-dash"></div>
                    <h1>Connexion</h1>
                    <p class="subtile">Espace administrateur</p>

                    <div class="user-icon">
                        <ion-icon :icon="personOutline"/>
                    </div>
                </div>
                <!--Formulaire-->
                <form @submit.prevent="login">
                    <div class="input-card">
                        <div class="input-row">
                            <ion-icon :icon="personOutline" />
                            <ion-input v-model="username" placeholder="Nom d'utilisateur" autocomplete="username" required/>
                        </div>
                        <div class="input-divider"></div>
                        <div class="input-row">
                            <ion-icon :icon="lockClosedOutline" />
                            <ion-input v-model="password" placeholder="Mot de passe" :type="showPassword ? 'text':'password'" autocomplete="current-password" required />
                            <ion-icon :icon="showPassword ? eyeOffOutline:eyeOutline" class="eye-icon" @click="showPassword=!showPassword" />
                        </div>
                    </div>
                    <!--Se souvenir de moi-->
                    <div class="remember-row">
                       <ion-checkbox v-model="rememberMe" />
                        <span> Se souvenir de moi</span>
                    </div>
                    <!--Boutton connexion-->
                    <ion-button type="submit" expand="block" class="login-button" :disabled="loading">{{ loading ? 'Connexion...' :'Se connecter' }}</ion-button>
                    <p class="forgot-password" @click="forgotPassword"> Mot de passe oublié ?</p>
                    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                </form>
                <div class="footer">
                    <span class="footer-line"></span>
                    <p>ADMINISTRATEUR Sécurisée</p>
                    <span class="footer-line"></span>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>
<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router';
import {IonPage, IonContent, IonIcon, IonInput, IonButton, IonCheckbox, toastController} from '@ionic/vue';
import {personOutline, lockClosedOutline, eyeOutline, eyeOffOutline, arrowBackOutline, shieldCheckmarkOutline} from 'ionicons/icons';

const router       = useRouter();
const username     = ref('');
const password     = ref('');
const rememberMe   = ref(false);
const showPassword = ref(false);
const loading      = ref(false);
const errorMessage = ref('');

function goBack(){
    if(window.history.length>1){
        router.back();
    }
}

async function login(){
    errorMessage.value="";

    if(!username.value.trim() || !password.value){
        errorMessage.value='Veuillez remplir tous les champs';
        return;
    }
    loading.value =true;

    try{
        // Démonstration uhiquement:
        // Remplace cette partie par un appel de L'API
        const toast = await toastController.reate({
            message: 'Formulaire validé Connecte ton API pour contiinuer',
            duration: 2500,
            color: 'dark',
            position: 'bottom'
        });

        await toast.present();
        //Après une authentification réussi:
        // awai router.replace('/dashboard')
    }catch(error){
        errorMessage.value='Une erreur survenue';
    }finally{
       loading.value=false
    }
}

function forgotPassword(){
    router.push('/forgot-password');
}
</script>
<style scoped>
   .login-content{
    --background:#090909 ;
   }
   .login-container{
    min-height: 100%;
    box-sizing: border-box;
    padding: 20px 24px 28px;
    display: flex;
    flex-direction:column;
    justify-content: center;
    background: radial-gradient(ellipse at 50% 42%, rgba(190, 0, 35, 0.22), transparent 65%),
    linear-gradient(160deg, #111111 0%, #090909 60%, #210008 100%);
    color: #ffffff
   }

   .top-bar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
   }
   .top-bar ion-icon{
    font-size: 25px;
    color: #ff334f;
    cursor: pointer;
   }
   .login-header{
    text-align: center;
    margin-bottom:28px ;
   }
  .red-dash {
    width: 32px;
    height: 6px;
    margin: 0 auto 18px;
    border-radius: 10px;
    background: #ff1744;
  }

   .login-header h1{
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: 0.5px;
    color: #ffffff;
    text-shadow: 0 0 12px rgba(255, 30,60,0.2);
   }
   .subtile{
    margin: 9px 0 23px;
    color: #b9b9b9;
    font-size: 14px;
   }
   .user-icon{
     width: 100px;
     height: 100px;
     border: 2px solid #ff173d;
     border-radius: 50%;
     display: flex;
     align-items: center;
     justify-content: center;
     margin: 0 auto;
     background: rgba(255, 23, 61, 0.06);
     box-shadow: 0 8px 24px rgba(255, 23, 61, 0.12);
   }
   .usesr-icon ion-icon{
    font-size: 55px;
    color: #ff334f;
   }
   .input-card{
    background: #f5f5f5;
    border-radius: 17px;
    padding: 8px 17px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
   }
   .input-row{
    display: flex;
    align-items: center;
    min-height: 63px;
    gap: 13px;
   }
   .input-row > ion-icon {
    color: #d4002d;
    font-size: 23px;
    flex-shrink: 0;
   }
   .input-row ion-input{
    --color: #171717;
    --placeholder-color:#777777;
    --placeholder-opacity:1;
    --padding-start: 0;
    font-size: 15px;
   }

.input-row .eye-icon {
  cursor: pointer;
  padding: 5px;
}

.input-divider {
  height: 1px;
  background: #d5d5d5;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 2px 25px;
  color: #eeeeee;
  font-size: 14px;
}

.remember-row ion-checkbox {
  --size: 19px;
  --checkbox-background: transparent;
  --checkbox-background-checked: #ff173d;
  --border-color: #777777;
  --border-color-checked: #ff173d;
  --checkmark-color: #ffffff;
}

.login-button {
  --background: linear-gradient(100deg, #c9002b, #ff1744);
  --background-activated: #a90024;
  --color: #ffffff;
  --border-radius: 14px;
  --box-shadow: 0 7px 22px rgba(255, 23, 61, 0.25);
  height: 55px;
  font-size: 16px;
  font-weight: 700;
  text-transform: none;
  margin: 0;
}

.forgot-password {
  color: #ff536b;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 25px;
  cursor: pointer;
}

.error-message {
  text-align: center;
  color: #ff6b80;
  font-size: 13px;
  margin-top: 15px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 38px;
}

.footer p {
  color: #777777;
  font-size: 9px;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.footer-line {
  width: 25px;
  height: 1px;
  background: #6e1226;
}

@media (max-height: 650px) {
  .login-container {
    justify-content: flex-start;
    padding-top: 12px;
  }

  .top-bar {
    margin-bottom: 18px;
  }

  .login-header {
    margin-bottom: 18px;
  }

  .user-icon {
    width: 75px;
    height: 75px;
  }

  .user-icon ion-icon {
    font-size: 42px;
  }

  .footer {
    margin-top: 22px;
  }
}  
</style>