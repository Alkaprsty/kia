
const questions = [
  {
    question: "AT SOON YOUR RIDE, YOUR CALL, WHO'S IT GONNA BE?",
    options: ["GOJEK", "GRAB", "MAXIM", "ALKA"]
  },
  {
    question: "PICK THE PLACE THAT YOU THINK IS THE BEST PLACE FOR FIRST MEET",
    options: ["URBAN FOREST", "UNDERWATER WORLD", "ANYWHERE", "MALL?????"]
  },
  {
    question: "WHAT'S YOUR GO TO COMFORT FOOD?",
    options: ["HOME COOKED", "PIZZA", "BAKSO", "SUSHI"]
  },
  {
    question: "WHAT KIND OF MUSIC PUTS YOU IN A GOOD MOOD?",
    options: ["POP", "ROCK", "JAZZ", "FOLK/INDIE"]
  },
  {
    question: "WHEN YOUR IDEAL DAY TO FIRST MEET WITH ME?",
    options: ["ONLY ON THE WEEKEND", "ONLY ON WEEKDAYS", "SOMEDAY", "I DON'T EVEN KNOW"]
  }
];

let currentQuestionIndex = 0;
let selectedAnswers = [];
let customAnswers = [];

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const userAnswers = questions.map((q, index) => {
let answer = "";
if (selectedAnswers[index] === -1 && customAnswers[index]) {
  answer = customAnswers[index];
} else if (selectedAnswers[index] >= 0 && q.options[selectedAnswers[index]]) {
  answer = q.options[selectedAnswers[index]];
} else {
  answer = "No Answer";
}

return {
  question: q.question,
  answer: answer
};
});

const messageText = userAnswers
.map(q => `${q.question}\n- ${q.answer}`)
.join("\n\n");

const form = document.getElementById("autoSubmitForm");
const hiddenMessage = document.getElementById("hiddenMessage");
hiddenMessage.value = messageText;

// Gunakan fetch() untuk submit tanpa reload
const formData = new FormData(form);
fetch(form.action, {
method: form.method,
body: formData,
headers: {
  'Accept': 'application/json'
}
})
.then(response => {
if (response.ok) {
  console.log("Jawaban berhasil dikirim!");
  form.reset(); // Reset input form (termasuk hidden input)
  showSubmissionSuccess(); // Tambahan: bisa munculkan notifikasi atau animasi
} else {
  console.error("Gagal mengirim:", response);
}
})
.catch(error => {
console.error("Error:", error);
});

observer.disconnect();
}
});
});

function showSubmissionSuccess() {
const successBox = document.createElement("div");
successBox.innerText = "Thank you! Your answers have been sent.";
successBox.style.position = "fixed";
successBox.style.bottom = "20px";
successBox.style.right = "20px";
successBox.style.background = "#4caf50";
successBox.style.color = "white";
successBox.style.padding = "15px";
successBox.style.borderRadius = "8px";
successBox.style.zIndex = "9999";
document.body.appendChild(successBox);

setTimeout(() => successBox.remove(), 5000);
}



const finalMessageEl = document.getElementById("finalMessage");
if (finalMessageEl) observer.observe(finalMessageEl);

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function () {
    const coinSound = new Audio("data:audio/wav;base64,..."); // kamu bisa isi kembali file audiomu
    coinSound.volume = 0.2;
    coinSound.play().catch(e => console.log("Audio play failed:", e));
  });

  displayQuestion(currentQuestionIndex);
  updateProgressBar();
});

function displayQuestion(index) {
  const questionData = questions[index];
  const questionsContainer = document.getElementById('questionsContainer');

  const questionCard = document.createElement('div');
  questionCard.className = 'question-card';
  questionCard.id = `question-${index}`;

  let optionsHTML = '';
  questionData.options.forEach((option, optionIndex) => {
    optionsHTML += `<button class="option-btn" data-index="${optionIndex}">${option}</button>`;
  });

  questionCard.innerHTML = `
    <div class="question">${index + 1}. ${questionData.question}</div>
    <div class="options">${optionsHTML}</div>
    <div class="custom-option">
      <label class="custom-option-label">OR TYPE YOUR OWN ANSWER:</label>
      <input type="text" class="custom-input" id="customInput-${index}" placeholder="TYPE HERE...">
    </div>
    <button class="next-btn" id="nextBtn-${index}">CONTINUE</button>
  `;

  questionsContainer.appendChild(questionCard);

  const optionButtons = questionCard.querySelectorAll('.option-btn');
  const customInput = document.getElementById(`customInput-${index}`);

  optionButtons.forEach(button => {
    button.addEventListener('click', function () {
      optionButtons.forEach(btn => btn.classList.remove('selected'));
      this.classList.add('selected');
      customInput.value = '';
      customInput.classList.remove('active');

      document.getElementById(`nextBtn-${index}`).classList.add('visible');
      selectedAnswers[index] = parseInt(this.dataset.index);
      customAnswers[index] = null;
    });
  });

  customInput.addEventListener('focus', function () {
    optionButtons.forEach(btn => btn.classList.remove('selected'));
    this.classList.add('active');
    document.getElementById(`nextBtn-${index}`).classList.add('visible');
  });

  customInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
      customAnswers[index] = this.value.trim();
      selectedAnswers[index] = -1;
    }
  });

  document.getElementById(`nextBtn-${index}`).addEventListener('click', function () {
    const hasSelection = document.querySelector(`#question-${index} .option-btn.selected`) !== null;
    const hasCustomInput = customInput.value.trim() !== '';

    if (!hasSelection && !hasCustomInput) {
      alert("PLEASE SELECT AN OPTION OR TYPE YOUR OWN ANSWER!");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      displayQuestion(currentQuestionIndex);
      updateProgressBar();
    } else {
      showFinalMessage();
      displayCustomAnswers();
      createConfetti();
    }

    setTimeout(() => {
      const newQuestion = document.getElementById(`question-${currentQuestionIndex}`);
      if (newQuestion) {
        newQuestion.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  });

  setTimeout(() => {
    questionCard.classList.add('visible');
  }, 100);
}

function updateProgressBar() {
  const progressBar = document.getElementById('progressBar');
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function showFinalMessage() {
  updateProgressBar();

  const counts = [0, 0, 0, 0];
  selectedAnswers.forEach(answer => {
    if (answer >= 0) counts[answer]++;
  });

  let maxCount = 0;
  let maxIndex = 0;
  counts.forEach((count, index) => {
    if (count > maxCount) {
      maxCount = count;
      maxIndex = index;
    }
  });

  document.getElementById('finalMessage').style.display = 'block';

  setTimeout(() => {
    document.getElementById('finalMessage').scrollIntoView({ behavior: 'smooth' });
  }, 500);
}

function displayCustomAnswers() {
  const customAnswersList = document.getElementById('customAnswersList');
  let hasCustomAnswers = false;

  customAnswers.forEach((answer, index) => {
    if (answer) {
      hasCustomAnswers = true;
      const answerItem = document.createElement('div');
      answerItem.className = 'answer-item';
      answerItem.innerHTML = `
        <div class="answer-question">${questions[index].question}</div>
        <div class="answer-text">${answer}</div>
      `;
      customAnswersList.appendChild(answerItem);
    }
  });

  if (hasCustomAnswers) {
    document.getElementById('customAnswersBox').style.display = 'block';

    setTimeout(() => {
      document.getElementById('customAnswersBox').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  }
}

function createConfetti() {
  const colors = ['#e73c3c', '#ffde00', '#00a800', '#5c94fc', '#ffffff'];

  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.top = `-10px`;
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.opacity = Math.random() + 0.5;

    document.body.appendChild(confetti);

    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 5;

    confetti.style.animation = `
      fadeIn 0.5s ease ${delay}s forwards,
      fall ${duration}s ease ${delay}s forwards
    `;

    setTimeout(() => {
      confetti.remove();
    }, (duration + delay) * 1000);
  }
}