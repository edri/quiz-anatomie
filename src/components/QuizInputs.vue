<template>
  <div v-if="!finished">
    <div class="input-number">{{ currentNumber }}</div>
    <div class="form-quiz-container">
      <input class="input-quiz"
             :class="{ 'input-quiz-wrong-answer': isWrongAnswer }"
             type="text"
             v-model="word"
             @keydown="resetWrongAnswer"
             @keydown.enter="validateWord" />
      <div v-if="hint" class="input-hint">
        <span>Indice : </span>
        <span>{{ hint }}</span>
      </div>
      <input class="button-quiz"
             type="button"
             value="Envoyer"
             @click="validateWord" />
    </div>
  </div>
  <div v-if="finished" class="finished-message">Bien joué !</div>
  <!-- TODO Miguel : faire un composant -->
  <div class="input-stats">
    {{ numberOfCorrectAnswers }}/{{ totalNumberOfQuestions }}
    <span class="input-stats-separator"> | </span>
    {{ percentageOfCorrectAnswers }}%
    <span class="input-stats-separator"> | </span>
    {{ chronometerMinutes }}:{{ chronometerSeconds }}
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentQuizAnswers: [],
      currentQuizIndex: 0,
      currentQuizStepIndex: 0,
      currentNumber: null,
      processedNumbers: [],
      word: '',
      hint: '',
      numberOfTries: 0,
      chronometer: null,
      chronometerMinutes: '00',
      chronometerSeconds: '00',
      numberOfCorrectAnswers: 0,
      numberOfWrongAnswers: 0,
      isWrongAnswer: false,
      finished: false,
    };
  },
  created() {
    this.initializeNextStep();
    this.startChronometer();
  },
  computed: {
    totalNumberOfQuestions() {
      let numberOfQuestions = 0;
      for (const quizData of this.data) {
        numberOfQuestions += quizData.steps.reduce((acc, value) => acc + value.answers.length, 0);
      }
      return numberOfQuestions;
    },
    percentageOfCorrectAnswers() {
      const totalNumberOfAnswers = this.numberOfCorrectAnswers + this.numberOfWrongAnswers;

      if (!totalNumberOfAnswers) {
        return 0;
      }

      return Math.round(this.numberOfCorrectAnswers / totalNumberOfAnswers * 100);
    },
  },
  methods: {
    emitCurrentQuizImage(quizImageName) {
      this.$emit('changeQuizImage', quizImageName);
    },
    emitError(errorMessage) {
      this.$emit('error', errorMessage);
    },
    getNextNumber() {
      const numberMax = this.currentQuizAnswers.length;
      let nextNumber;

      if (this.processedNumbers.length < this.currentQuizAnswers.length) {
        do {
          nextNumber = Math.floor(Math.random() * numberMax) + 1;
        } while (this.processedNumbers.includes(nextNumber))

        this.processedNumbers.push(nextNumber);

        return nextNumber;
      }

      return null;
    },
    startChronometer() {
      this.chronometer = setInterval(() => {
        this.chronometerSeconds = parseInt(this.chronometerSeconds) + 1;

        if (this.chronometerSeconds < 10) {
          this.chronometerSeconds = '0' + this.chronometerSeconds;
        }

        if (this.chronometerSeconds === 60) {
          this.chronometerSeconds = '00';
          this.chronometerMinutes = parseInt(this.chronometerMinutes) + 1;

          if (this.chronometerMinutes < 10) {
            this.chronometerMinutes = '0' + this.chronometerMinutes;
          }
        }
      }, 1000);
    },
    resetWrongAnswer() {
      this.isWrongAnswer = false;
    },
    getFirstHint(answer) {
      if (answer.length <= 1) {
        return answer;
      }

      const maskedCharacters = '*'.repeat(answer.length - 1);
      const lastCharacter = answer.slice(-1);

      return maskedCharacters + lastCharacter;
    },
    getSecondHint(answer) {
      if (answer.length <= 2) {
        return answer;
      }

      const maskedCharacters = '*'.repeat(answer.length - 2);
      const firstCharacter = answer.charAt(0);
      const lastCharacter = answer.slice(-1);

      return firstCharacter + maskedCharacters + lastCharacter;
    },
    initializeNextStep() {
      this.emitError('');
      const currentQuizData = this.data[this.currentQuizIndex]?.steps[this.currentQuizStepIndex];

      if (currentQuizData) {
        this.emitCurrentQuizImage(currentQuizData.image)
        this.currentQuizAnswers = currentQuizData.answers;
        this.processedNumbers = [];
        this.currentNumber = this.getNextNumber();
      } else {
        const quizName = this.data[this.currentQuizIndex]?.name;

        if (quizName) {
          this.emitError(`⚠️ Les données de l'étape ${this.currentQuizStepIndex} du quiz "${quizName}" sont invalides.`);
        } else {
          this.emitError('⚠️ Les données du quiz sont invalides.');
        }
      }
    },
    finishGame() {
      clearInterval(this.chronometer);
      this.finished = true;
    },
    checkIfGamedIsFinished() {
      if (!this.currentNumber) {
        this.currentQuizStepIndex += 1;

        if (this.currentQuizStepIndex >= this.data[this.currentQuizIndex].steps.length) {
          this.currentQuizStepIndex = 0;
          this.currentQuizIndex += 1;
        }

        if (this.data[this.currentQuizIndex]?.steps[this.currentQuizStepIndex]) {
          this.initializeNextStep();
        } else {
          this.finishGame();
        }
      }
    },
    validateWord() {
      if (this.word.length) {
        const answers = this.currentQuizAnswers[this.currentNumber - 1];

        if (answers.includes(this.word)) {
          this.word = '';
          this.hint = '';
          this.numberOfTries = 0;
          this.numberOfCorrectAnswers += 1;
          this.currentNumber = this.getNextNumber();
          this.checkIfGamedIsFinished();
        } else {
          this.isWrongAnswer = true;
          this.numberOfTries += 1;
          this.numberOfWrongAnswers += 1;

          switch (this.numberOfTries) {
            case 1:
              this.hint = this.getFirstHint(answers[0]);
              break;
            case 2:
              this.hint = this.getSecondHint(answers[0]);
              break;
            default:
              this.hint = answers[0];
          }
        }
      }
    },
  }
}
</script>

<style scoped>
.input-stats {
  margin-top: 1.5em;
  text-align: center;
}

.input-stats-separator {
  margin: 0 1em;
}

.form-quiz-container {
  display: flex;
  flex-direction: column;
}

.input-number {
  font-size: 3em;
  text-align: center;
}

.input-quiz {
  border-left: 0.8px solid #aaa;
  border-right: 0.8px solid #aaa;
  border-top: 0.8px solid #aaa;
  border-bottom: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  outline: none;
  padding: 15px;
}

.input-quiz-wrong-answer {
  color: #bf4140;
}

.input-hint {
  border-left: 0.8px solid #aaa;
  border-right: 0.8px solid #aaa;
  border-top: 1px solid #aaa;
  padding: 15px;
}

.button-quiz {
  background-color: #ddd;
  border: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  padding: 15px;
}

.input-quiz, .button-quiz {
  font-size: 1.2em;
}

.finished-message {
  font-size: 2em;
  text-align: center;
}
</style>
