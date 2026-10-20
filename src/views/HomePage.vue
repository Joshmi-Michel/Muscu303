<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="background">
          <div class="contenu">
            <h1>Bienvenu !</h1>  
            <div class="corps">
              <ion-button expand="block" @click="acceuil">
                Tableau de bord
              </ion-button>
              <ion-button expand="block" @click="commencer">
                Commencer
              </ion-button> 
              <ion-button class="secondary" expand="block" fill="clear" @click="seConnecter">
                Se connecter
              </ion-button>
            </div>
          </div>  
      </div>
    </ion-content> 
  </ion-page>
</template>
<script setup>
import {IonPage, IonContent,IonButton} from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function acceuil(){
   router.push('/dashboard')
}

function commencer(){
  router.push('/register');
}

function seConnecter(){
   router.push('/login');
}
</script>
<style scoped>
  ion-content{
    --background: transparent;
  }
  .background{
    min-height: 100%;
    width:100%;
    background-image: url('@/assets/img/303.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .contenu{
    text-align: center;
    color: white;
    padding: 20px;
  }
 
  h1{
    font-size:45px;
    font-weight:bold;
    -webkit-text-stroke: 2px rgb(147, 15, 15);
  }
  p{
    font-size: 18px;
  }
  .corps{
    padding-top:150px;
  }

</style>