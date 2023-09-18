<template>
  <!-- TODO Miguel -->
  <!-- <NavBar /> -->
  <div class="quiz-container">
    <div v-if="currentQuizImage">
      <img class="quiz-image" :src="currentQuizImage" />
    </div>
    <div class="input-container">
      <QuizInputs v-if="gameStarted"
                 :data="selectedQuizData"
                 @changeQuizImage="changeQuizImage" />
      <button v-if="!gameStarted"
              class="button-start"
              @click="startGame">Démarrer</button>
      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// TODO Miguel
// import NavBar from "../components/NavBar.vue";
import QuizInputs from "../components/QuizInputs.vue";
import quizzesData from '../assets/data/quizzesData';

export default {
  name: 'Quiz',
  components: {
    QuizInputs
    // NavBar,
  },
  data() {
    return {
      quizzesData: quizzesData,
      selectedQuizData: [],
      currentQuizImage: null,
      gameStarted: false,
      errorMessage: '',
    };
  },
  methods: {
    startGame() {
      if (quizzesData && quizzesData.length && quizzesData[0].steps && quizzesData[0].steps.length) {
        // TODO Miguel : à changer selon le quiz sélectionné
        this.selectedQuizData = this.quizzesData;
        this.gameStarted = true;
      } else {
        this.errorMessage = '⚠️ Les données du quiz sont invalides.';
      }
    },
    changeQuizImage(quizImageName) {
      this.currentQuizImage = require('../assets/images/' + quizImageName)
    },
  },
}
</script>

<style>
.quiz-container {
  display: flex;
  justify-content: center;
  margin-top: 3em;
}

.quiz-image {
  height: 837px;
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 3em;
  min-height: 90vh;
  width: 331px;
}

.button-start {
  background-color: #ddd;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2em;
  padding: 30px 15px;
}

.error {
  color: #bf4140;
  margin-top: 1em;
  text-align: center;
}
</style>
