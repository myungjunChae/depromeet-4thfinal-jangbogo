<template>
  <transition name="modal">
    <div class="modal-mask" @click="turnOffModal">
      <div class="modal-wrapper">
        <div class="modal-container" @click.stop>
            <div class="slot" slot="header">
                <div class="wrapper" id="header">
                    <span v-if="getSignCondition === 'signUp'">회원가입</span>
                    <span v-if="getSignCondition === 'signIn'">로그인</span>
                    <i id="offBtn" class="fas fa-times" v-on:click="turnOffModal"></i>
                </div>
            </div>
            <!-- 회원가입 -->
            <div class="slot" slot="body" v-if="getSignCondition === 'signUp'">
                <div class="wrapper">
                    <div class="inputbox id">
                        <div class="name">아이디</div>
                        <input type="text" placeholder="아이디" v-model="email" v-bind:class="getFormStateClass('email')"></div>
                    <div class="notice" v-bind:class="{'visible' : (getEmail.length>0) && !getIsValidEmail}">사용할 수 없는 아이디입니다.</div>
                </div>
                <div class="wrapper">
                    <div class="inputbox ps">
                        <div class="name">비밀번호</div>
                        <input type="password" placeholder="비밀번호" v-model="password" v-bind:class="getFormStateClass('password')">
                        <!-- <i class="fas" v-bind:class="{'fa-times' : !getIsValidPassword, 'fa-check' : getIsValidPassword}"></i> -->
                    </div>
                    <div class="notice" v-bind:class="{'visible' : (getPassword.length>0) && !getIsValidPassword}">0~00자 영문 소문자, 숫자를 사용하세요.</div>
                </div>
                <div class="wrapper">
                    <div class="inputbox ps_check">
                        <div class="name">비밀번호 확인</div>
                        <input type="password" placeholder="비밀번호 확인" v-model="passwordCheck"  v-bind:class="getFormStateClass('passwordCheck')">
                        <!-- <i class="fas" v-bind:class="{'fa-times' : !getIsPasswordCheckSame, 'fa-check' : getIsPasswordCheckSame}"></i> -->
                    </div>
                    <div class="notice" v-bind:class="{'visible' : (getPasswordCheck.length>0) && !getIsPasswordCheckSame}">비밀번호가 일치하지 않습니다.</div>
                </div>
                <div class="wrapper">
                    <div class="inputbox nickname">
                        <div class="name">닉네임</div>
                        <input id="nickNameInput" type="text" placeholder="닉네임" disabled>
                        <!-- <i class="fas fa-check"></i> -->
                    </div>  
                <div class="notice always">익명성을 보장하기 위해 닉네임은 장보고가 설정해드려요.</div>
                </div>
                <div class="wrapper multiContent">
                    <div class="inputbox age">
                        <select id="ageSelect" v-model="age"></select>
                        <i class="fas" v-bind:class="{'fa-times' : !getIsValidAge, 'fa-check' : getIsValidAge}"></i>
                    </div>
                    <div class="inputbox sex" v-bind:class="{checked : getSex == 0}" v-on:click="toggleFemale">여자</div>
                    <div class="inputbox sex" v-bind:class="{checked : getSex == 1}" v-on:click="toggleMale">남자</div>
                </div>
                <div class="wrapper multiContent">
                    <div class="inputbox address">
                        <input type="text" id="sample4_roadAddress" v-model="address">
                    </div>  
                    <div class="searchBtn" v-on:click="execDaumPostcode">
                        주소 찾기
                    </div>
                </div>
                <div class="wrapper">
                    <div class="submit" v-on:click="()=>{checkSignUpFormValid(); if(getIsAllFormValid){setSignUpState('selectTag');}}">
                        다음
                    </div>
                </div>
                
            </div>
            <!-- 태그 선택 -->
            <div class="slot" slot="body" v-if="getSignCondition === 'selectTag'">
                <div id="tagNotice">나에게 꼭 맞는 장보고러를 찾기 위해 선호하는 태그를 선택해주세요.</div>
                <div class="wrapper">
                    <div class="category">
                        #식성
                    </div>
                    <div class="tagWrapper">
                        <div class="tag" 
                        v-for="tag in fetchTags('ingredient')" 
                        v-on:click="setSelected(tag)"
                        v-bind:class="{select:getTagSeleted(tag)}"
                        v-bind:key="tag.id">{{tag}}
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div class="category">
                        #식성
                    </div>
                    <div class="tagWrapper">
                        <div class="tag" 
                        v-for="tag in fetchTags('type')" 
                        v-on:click="setSelected(tag)"
                        v-bind:class="{select:getTagSeleted(tag)}"
                        v-bind:key="tag.id">{{tag}}
                        </div>
                    </div>
                </div>
                <div class="wrapper multiContent">
                    <div class="tagBtn" v-on:click="setSignUpState('signUp')">이전</div>
                    <div class="tagBtn" v-on:click="()=>{if(getSelectedNum >= 3){signUpComplete()}else{this.print('select Tags')}}">회원가입 완료</div>
                </div>
            </div>

            <!-- 로그인 -->
            <div class="slot" slot="body" v-if="getSignCondition === 'signIn'">
                <div class="wrapper">
                    <div class="inputbox id">
                        <div class="name">아이디</div>
                        <input type="text" placeholder="아이디" v-model="email">
                    </div>
                    <div class="notice">없는 아이디입니다.</div>
                </div>
                <div class="wrapper">
                    <div class="inputbox ps">
                        <div class="name">비밀번호</div>
                        <input type="password" placeholder="비밀번호" v-model="password" v-on:keyup.enter="signInCompelete">
                        <!-- <i class="fas" v-bind:class="{'fa-times' : !getIsValidPassword, 'fa-check' : getIsValidPassword}"></i> -->
                    </div>
                    <div class="notice">아이디와 비밀번호가 일치하지 않습니다.</div>
                </div>
                <div class="wrapper">
                    <div class="submit" v-on:click="signInCompelete">
                        로그인
                    </div>
                </div>
            </div>
            <div class="slot" slot="footer" v-if="getSignCondition !== 'signIn'">
                <div>
                    <span>이미 장보고에 가입하셨나요? </span>
                    <span v-on:click="toggleSignIn"><u>로그인하기</u></span>
                </div>
            </div>
            <div class="slot" slot="footer" v-if="getSignCondition === 'signIn'">
                <div>
                    <span>장보고가 처음이신가요? </span>
                    <span v-on:click="toggleSignUp"><u>가입하기</u></span>
                </div>
            </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import eventBus from './EventBus'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

export default {
    data(){
        return {
 
        }
    },
    created() {
        this.addAgeOption();
        this.addNickName();
    },
    updated() {
        this.addAgeOption();
        this.addNickName();
    },
    computed: {
        email: {
            get(){ 
                return this.$store.getters[(this.getSignState === 0 ? "signup":"signin") + "/getEmail"]; 
            },
            set( value ){ 
                this.$store.commit((this.getSignState === 0 ? "signup":"signin") + "/setEmail", value); 
                this.$store.commit((this.getSignState === 0 ? "signup":"signin") + "/checkEmailValid");
            }
        },
        password: {
            get(){ 
                return this.$store.getters[(this.getSignState === 0 ? "signup":"signin") + "/getPassword"]; 
            },
            set( value ){
                this.$store.commit((this.getSignState === 0 ? "signup":"signin") + "/setPassword", value); 
                this.$store.commit((this.getSignState === 0 ? "signup":"signin") + "/checkPasswordVaild");

                if(this.getSignState === 0){
                    this.$store.commit("signup/checkPasswordSame");
                }
            }
        },
        passwordCheck: {
            get(){ return this.$store.getters["signup/getPasswordCheck"]},
            set( value ){
                this.$store.commit("signup/setPasswordCheck", value);
                this.$store.commit("signup/checkPasswordSame");
            }
        },
        age: {
            get(){return this.$store.getters["signup/getAge"]},
            set( value ){
                console.log('age', value);
                this.$store.commit("signup/setAge", value);
                this.$store.commit("signup/checkAgeValid");
            }
        },
        address: {
            get(){return this.$store.getters["signup/getUserAddress"]},
            set( value ){
                this.$store.commit("signup/setUserAddress", value);
            }
        },
        getSignCondition(){
            //object를 vuex로부터 받아와 SignUp의 현재 상태체크
            let signUpState;
            this.getSignUpState.forEach(value => {
                if(value.state === true){
                    signUpState = value.name;
                }
            });

            if(this.getSignState === 0){
                if(signUpState === "signUp"){
                    return "signUp"
                }else if (signUpState === "selectTag"){
                    return "selectTag"
                }
            }else if (this.getSignState === 1){
                return "signIn"
            }
        },
        ...mapGetters("sign", {
            getSignState: "getSignState",
            getSignUpState: "getSignUpState",
        }),
        ...mapGetters("signin",{
            getIsValidEmail: "getIsValidEmail",
            getIsValidPassword: "getIsValidPassword",
        }),
        ...mapGetters("signup", {
            getEmail: "getEmail",
            getPassword: "getPassword",
            getPasswordCheck: "getPasswordCheck",
            getSex: "getSexState",
            getIsValidEmail: "getIsValidEmail",
            getIsValidPassword: "getIsValidPassword",
            getIsPasswordCheckSame: "getIsPasswordCheckSame",
            getIsValidAge: "getIsValidAge",
            getIsAllFormValid: "getIsAllFormValid"
        }),
        ...mapGetters("selectTag", {
            getTags: "getTags",
            getSelected: "getSelected",
            getSelectedNum: "getSelectedNum",
        })
    },
    methods:{
        print(args){
            console.log(args);
        },
        // Sign Up Method
        addAgeOption(){
            if(this.getSignState === 0){
                let select = document.getElementById("ageSelect")
                if(select !== null){
                    select.innerHTML="";
                    var option;
                    option = document.createElement("option");
                    option.selected = true;
                    option.hidden = true;
                    option.text = "출생년도 선택";
                    select.appendChild(option);
                    // <option value="" disabled selected>Select your option</option>
                    for (var i = 12; i <= 50; i++)
                    {
                        option = document.createElement("option");
                        option.text = i;
                        select.appendChild(option);
                    }
                }
            }
        },
        addNickName(){
            let input = document.getElementById('nickNameInput');
            
            if(input !== null){
                if(localStorage.getItem('nickName') !== null){
                    input.value = localStorage.getItem('nickName');
                return;
                }

                this.getUserRandomNickName().then((resolve)=>{
                    input.value = resolve.data;
                    localStorage.setItem('nickName', resolve.data);
                })
            }
        },
        turnOffModal(){
            eventBus.$emit("turn-off-sign-modal");
        },
        toggleSignIn(){
            //회원가입 창일 때
            if(this.getSignState === 0){
                this.setSignState(1);
            }
        },
        getFormStateClass(form){
            let getFormMethods = {
                email : this.getEmail,
                password : this.getPassword,
                passwordCheck : this.getPasswordCheck,
            }
            let getValidMethods = {
                email : this.getIsValidEmail,
                password : this.getIsValidPassword,
                passwordCheck : this.getIsPasswordCheckSame,
            }

            var keys = Object.keys(getFormMethods);
            var getFormMethod;
            var getValidMethod;

            for(var index in keys){
                if(form === keys[index]){
                    getFormMethod = getFormMethods[keys[index]];
                    getValidMethod = getValidMethods[keys[index]];
                }
            }
            if(getFormMethod.length > 0){
                return{
                    'success' : getValidMethod,
                    'error' : !getValidMethod,
                }
            }
        },
        signUpComplete(){
            this.postSignUpToServer();
            this.turnOffModal();
            //데이터 초기화
            this.initSignUpState();
            this.initSignState();
            this.initSelectTagState();
        },
        // SignIn Method
        toggleSignUp(){
            //로그인 창일 때
            if(this.getSignState === 1){
                this.setSignState(0);
                // this.addAgeOption();
            }
        },
        signInCompelete(){
            this.postSignInToServer();
            this.initSignInState();
            this.turnOffModal();
        },
        // SelectTag Method
        fetchTags(tagNum){
            let arr = [];
            for(var index in this.getTags){
                if(tagNum === index){
                    arr = [...this.getTags[index]]
                    return arr;
                }
            }
            console.log("tag Index error");
            return false;
        },
        getTagSeleted(tag){
            // 태그 클릭 한 번에 8번의 호출 * 태그 갯수 => find the way to modify
            for(var index in this.getSelected){
                if(this.getSelected[index] === tag){
                    return true;
                }
            }
            return false;
        },
        execDaumPostcode() {
            var getComponent = this;
            new daum.Postcode({
                oncomplete(data) {
                    // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
                    // 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
                    // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                    var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
                    var extraRoadAddr = ''; // 도로명 조합형 주소 변수

                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraRoadAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if(extraRoadAddr !== ''){
                        extraRoadAddr = ' (' + extraRoadAddr + ')';
                    }
                    // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
                    if(fullRoadAddr !== ''){
                        fullRoadAddr += extraRoadAddr;
                    }

                    // 우편번호와 주소 정보를 해당 필드에 넣는다.
                    let userAddress = fullRoadAddr + '||' + data.zonecode;
                    getComponent.setUserAddress(userAddress);
                    document.getElementById('sample4_roadAddress').value = userAddress;

                    // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                    if(data.autoRoadAddress) {
                        //예상되는 도로명 주소에 조합형 주소를 추가한다.
                        var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                        document.getElementById('guide').innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';

                    } else if(data.autoJibunAddress) {
                        var expJibunAddr = data.autoJibunAddress;
                        document.getElementById('guide').innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';

                    } else {
                        document.getElementById('guide').innerHTML = '';
                    }
                }
            }).open();
        },
        ...mapMutations("sign", {
            setSignState: 'setSignState',
            setSignUpState: 'setSignUpState',
            initSignState: 'initSignState',
        }),
        ...mapMutations("signup", {
            toggleFemale: "toggleFemale",
            toggleMale: "toggleMale",
            setUserAddress: "setUserAddress",
            checkSignUpFormValid: "checkSignUpFormValid",
            initSignUpState: "initSignUpState",
        }),
        ...mapMutations("selectTag",{
            setSelected: "setSelected",
            initSelectTagState: "initSelectTagState",
        }),
        ...mapMutations("signin",{
            initSignInState: 'initSignInState',
        }),
        ...mapActions("signup", {
            postSignUpToServer : 'postSignUpToServer',
            getUserRandomNickName : 'getUserRandomNickName',
        }),
        ...mapActions("signin", {
            postSignInToServer : 'postSignInToServer',
        })
    }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  text-align: left;
  width: 584px;
  padding: 10px 0px; /*마진 병합 현상*/
  margin: 0px auto;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  border-radius: 10px;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.wrapper{
    margin: 20px 32px;
}
#header > span{
    font-size: 24px;
    color: #77c017;
}
.multiContent{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.multiContent > .inputbox{
    /* padding: 0px; */
    /* flex: none; */
}
.name{
    color: #828282;
    display: inline;
    padding: 10px 0px;
}
div[slot="header"] > .wrapper{
    color: #828282;
    text-align: center;
}
#offBtn{
    float: right;
    padding: 10px 0px;
}
.inactive{
    color: #d5d5d5;
}
.inputbox > *{
    display: inline-block;
}
.inputbox > input{
    padding: 10px;
    padding-left: 24px;
    width: 374px;
    font-size: 16px;
    border: solid 1px #cfcfcf;
    color: #c8c8c8;
    float: right;
}
.inputbox > input:focus{
    border: solid 1px #333333;
}
.error{
    border: solid 1px #e01f1f !important;
}
.success{
    border: solid 1px #23b470 !important;
}
.inputbox > i{
    position: relative;
    left: 15px;
}
.nickname > input{
    background-color: #e8e8e8;
}
.notice{
    color: #ff0000;
    font-size: 14px;
    margin-top: 8px;
    display: inline-block; 
    position: relative;
    left: 110px;
    visibility: hidden;
}
.always{
    color: #bdbdbd;
    visibility: visible;
}
.visible{
    visibility: visible;
}
.age{
    padding: 10px 0px 10px 20px;
    flex: 0 0 196px;
    border: solid 1px #cfcfcf;
}
.age > select{
    width: 100px;
    -webkit-appearance: none;
    border: none;
    color: #6f6f6f;
}
.age > i{
    /* left: 70px; */
}
.sex{
    padding: 10px 0px;
    flex: 0 0 136px;
    text-align: center;
    border: solid 1px #cfcfcf;
    color: #6f6f6f;
}
.checked{
    background-color: #e8e8e8;
}
.searchBtn{
    padding: 10px 0px;
    flex: 0 0 136px;
    text-align: center;
    border: solid 1px #cfcfcf;
    color: #6f6f6f;
}
.address > *{
    background-color: #FFFFFF;
}
.address > input{
    width: 334px;
    float: left;
    text-overflow: ellipsis;
}
.submit{
    text-align: center;
    padding: 15px 23px;
    background-color: #e8e8e8;
}
/* .submit:active{
    background-color: red;
    background-color: #c7c7c7 !important;
}
.submit:hover{
    background-color: blue;
} */
#tagNotice{
    color: #828282;
    text-align: center;
    font-size: 16px;
}
.category{
    font-size: 20px;
    color: #828282;
    margin-bottom: 16px;
}
.tagWrapper{
    display: flex;
    flex-wrap: wrap;
}
.tag{
    border-radius: 5px;
    background-color: #d8d8d8;
    color: #828282;
    padding: 8px 16px;
    margin-right: 24px;
    margin-bottom: 16px;
}
.select{
    border: solid 1px red;
}
.tagBtn{
    flex: 0 0 252px;
    padding: 20px 0px;
    text-align: center;
    font-size: 20px;
    color: #6f6f6f;
    background-color: #dedede;
}
div[slot='footer']{
    margin-top: 10px;
    text-align: center;
    color: #6f6f6f;
}
</style>
