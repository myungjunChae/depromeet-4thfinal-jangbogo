<template>
  <div id="wrapper">
    <!-- <button v-on:click="signup" style="width:100px; height:100px;"></button>
    <span><router-link v-bind:to="{ name: 'counter-page' }">Counter</router-link></span> -->
          
  
    <Top></Top>
    <NewRoom v-if="showNewRoom" @close="showNewRoom=false"></NewRoom>
    <SignModal v-if="showSignPage" @close="showSignPage = false"></SignModal> 
    <!-- <tag></tag> -->
    <!-- <map></map> -->
    <!-- <footer></footer> -->
    <p id="main-title">나에게 딱맞는 장보고러를 찾아보세요</p>
    <TagList :items="items" v-if="items.length > 0" />
    <Location> </Location>
    <p class="subtitle">같이 장 볼 친구를 찾아보세요</p>
    <p class="subtitle">어디에 누가 있나요?</p>
    <p class="subtitle">지금 떠오르는 장보고러</p>
    <Footer></Footer>
  </div>
</template>


<script type="text/javascript">
import SignModal from './SignModal.vue'
import Footer from './Footer.vue'
import Location from './Location.vue'
import FriendList from './FriendList.vue'
import Tag from './Tag.vue'
import TagList from './TagList.vue'
import Top from './Top.vue'
import NewRoom from './NewRoom.vue'
import eventBus from './EventBus.vue'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'home',
  created: function() {
    eventBus.$on('add-room', ()=>{})
    eventBus.$on('click-new-room', ()=>{})
    eventBus.$on('click-sign-modal', (state)=>{this.turnOnModal(state)});
    eventBus.$on('turn-off-sign-modal', ()=>{this.turnOffModal()});
  },
  components: { Footer, FriendList, Tag, SignModal, Top, TagList, NewRoom, Location },
  data(){
    return{
      showSignPage : false,
      items: ['돔', '성별', '고등어', '김치찌개', '가쓰오부시', '돼지김치찌개', '고등어', '김치찌개', '돔', '성별', '고등어', '김치찌개', '가쓰오부시'],
      showNewRoom: false
    }
  },
  methods:{
    ...mapMutations('sign',{
      setSignState : 'setSignState'
    }),
    ...mapMutations('signin',{
      initSignInState : 'initSignInState'
    }),
    turnOffModal(){
      console.log("here");
      this.showSignPage = false;
      this.initSignInState();
    },
    turnOnModal(state){
      this.showSignPage = true;
      this.setSignState(state);
    },
    clickNewRoom: function() {
      console.log("Click!!!!!!!!!")
      showNewRoom = true
    }
  }
}
</script>


<style scoped>
@import url(https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css);

#wrapper {
  width: 100%;
  height: 100%;
}

#main-title {
  font-family: 'NanumSquare';
  font-size: 24px;
  color: #1d1d1d;
}


.subtitle {
  font-family: 'NanumSquare';
  font-size: 24px;
  color: #1d1d1d;
}
</style>
