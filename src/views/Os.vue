<template>
  <!-- <NavBar /> -->
  <div class="quiz-container">
    <div>
      <img class="schema" alt="anatomie" src="../assets/schemas/squelette-anatomie-face.png" />
    </div>
    <div class="input-container">
      <InputQuiz v-if="gameStarted"
                 :data="dataSquelette" />
      <button v-if="!gameStarted"
              class="button-start"
              @click="startGame">Démarrer</button>
    </div>
  </div>
</template>

<script>
// import NavBar from "../components/NavBar.vue";
import InputQuiz from "../components/InputQuiz.vue";
import squeletteFace from "../assets/data/squeletteFace";
import squeletteDos from "../assets/data/squeletteDos";

export default {
  name: 'Os',
  components: {
    InputQuiz
    // NavBar,
  },
  data() {
    return {
      squeletteFace: squeletteFace,
      squeletteDos: squeletteDos,
      gameStarted: false,
    };
  },
  computed: {
    dataSquelette() {
      return [ squeletteFace, squeletteDos ];
    },
  },
  methods: {
    startGame() {
      this.gameStarted = true;
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

.schema {
  height: 837px;
}

.input-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 3em;
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
</style>
