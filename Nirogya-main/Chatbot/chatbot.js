const openChatbotBtn = document.getElementById('open-chatbot');
const chatbotContainer = document.getElementById('chatbot-container');
const closeChatbotBtn = document.getElementById('close-chatbot');
const sendMessageBtn = document.getElementById('send-message');
const userInput = document.getElementById('user-input');
const messagesContainer = document.getElementById('chatbot-messages');

let conversationState = 'initial';

const symptoms = {
  fever: ['headache', 'cough', 'fatigue'],
  cold: ['sneezing', 'sore throat', 'runny nose'],
  flu: ['fever', 'body aches', 'chills'],
  allergy: ['itchy eyes', 'sneezing', 'rash'],
};

const specialist = {
  fever: 'General Physician',
  cold: 'General Physician',
  flu: 'General Physician',
  allergy: 'Allergist',
  headache: 'Neurologist',
  cough: 'Pulmonologist',
  fatigue: 'General Physician',
  sneezing: 'Allergist',
  'sore throat': 'ENT Specialist',
  'runny nose': 'ENT Specialist',
  'body aches': 'General Physician',
  chills: 'General Physician',
  'itchy eyes': 'Ophthalmologist',
  rash: 'Dermatologist',
};

openChatbotBtn.addEventListener('click', () => {
  chatbotContainer.style.display = 'flex';
  openChatbotBtn.style.display = 'none';
  if (conversationState === 'initial') {
    addBotMessage("Hello! I'm your AI health assistant. How can I help you today?");
  }
});

closeChatbotBtn.addEventListener('click', () => {
  chatbotContainer.style.display = 'none';
  openChatbotBtn.style.display = 'block';
});

sendMessageBtn.addEventListener('click', () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessage(userMessage, 'user-message');
    userInput.value = '';
    handleUserMessage(userMessage);
  }
});

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessageBtn.click();
  }
});

function handleUserMessage(message) {
  const lowerCaseMessage = message.toLowerCase();
  let response = "I'm not sure how to help with that. Can you please describe your symptoms in more detail?";

  if (conversationState === 'initial') {
    let conditionFound = null;
    for (const condition in symptoms) {
      if (lowerCaseMessage.includes(condition)) {
        conditionFound = condition;
        break;
      }
    }

    if (conditionFound) {
      addBotMessage(`It sounds like you might have a ${conditionFound}.`);
      const recommendedSpecialist = specialist[conditionFound];
      if (recommendedSpecialist) {
        addBotMessage(`I recommend you consult a ${recommendedSpecialist}.`);
        addBotMessage('Would you like me to help you find a doctor?');
        conversationState = 'find_doctor';
      } else {
        addBotMessage('I recommend you consult a General Physician.');
        conversationState = 'initial';
      }
    } else {
      let symptomFound = null;
      for (const symptom in specialist) {
        if (lowerCaseMessage.includes(symptom)) {
          symptomFound = symptom;
          break;
        }
      }
      if (symptomFound) {
        const recommendedSpecialist = specialist[symptomFound];
        addBotMessage(`For symptoms like "${symptomFound}", I recommend you consult a ${recommendedSpecialist}.`);
        addBotMessage('Would you like me to help you find a doctor?');
        conversationState = 'find_doctor';
      } else {
        addBotMessage("I'm sorry, I couldn't identify a specific condition based on your input. Please describe your main symptom (e.g., fever, headache, cough).");
        conversationState = 'symptom_check';
      }
    }
    return;
  }

  if (conversationState === 'symptom_check') {
    let conditionFound = null;
    for (const condition in symptoms) {
      if (lowerCaseMessage.includes(condition)) {
        conditionFound = condition;
        break;
      }
    }

    if (conditionFound) {
      addBotMessage(`It sounds like you might have a ${conditionFound}.`);
      const recommendedSpecialist = specialist[conditionFound];
      if (recommendedSpecialist) {
        addBotMessage(`I recommend you consult a ${recommendedSpecialist}.`);
        addBotMessage('Would you like me to help you find a doctor?');
        conversationState = 'find_doctor';
      } else {
        addBotMessage('I recommend you consult a General Physician.');
        conversationState = 'initial';
      }
    } else {
      let symptomFound = null;
      for (const symptom in specialist) {
        if (lowerCaseMessage.includes(symptom)) {
          symptomFound = symptom;
          break;
        }
      }
      if (symptomFound) {
        const recommendedSpecialist = specialist[symptomFound];
        addBotMessage(`For symptoms like "${symptomFound}", I recommend you consult a ${recommendedSpecialist}.`);
        addBotMessage('Would you like me to help you find a doctor?');
        conversationState = 'find_doctor';
      } else {
        addBotMessage("I'm sorry, I couldn't identify a specific condition based on your input. Please try again with a different symptom.");
        conversationState = 'symptom_check';
      }
    }
  } else if (conversationState === 'find_doctor') {
    if (lowerCaseMessage.includes('yes')) {
        // Redirect to the doctor page
        window.location.href = 'UserDashboard/userDashboard.html'; 
    } else {
        addBotMessage('No problem. If you need any further assistance, feel free to ask. Stay healthy!');
        conversationState = 'initial';
    }
}
  }


function addMessage(message, className) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${className}`;
  messageElement.textContent = message;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addBotMessage(message) {
  addMessage(message, 'bot-message');
}
