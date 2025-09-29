
const doctors = [
  { name: 'Dr. A. Sharma', specialty: 'Cardiologist | 10+ years experience',img: '../resource/Dr1.jpg'},
  { name: 'Dr. P. Singh', specialty: 'Dermatologist | 8+ years experience', img: '../resource/Dr2.jpg' },
  { name: 'Dr. M. Verma', specialty: 'Neurologist | 12+ years experience', img: '../resource/Dr3.avif' },
  { name: 'Dr. R. Patel', specialty: 'Orthopedic | 9+ years experience', img: '../resource/Dr4.jpg' },
  { name: 'Dr. S. Das', specialty: 'Gynecologist | 15+ years experience',img: '../resource/Dr5.avif' },
  { name: 'Dr. K. Roy', specialty: 'Pediatrician | 7+ years experience', img: '../resource/Dr6.avif' },
  { name: 'Dr. M. Prasad', specialty: 'General Physician | 10+ years experience', img: '../resource/Dr3 (2).avif' },
  { name: 'Dr. S. Kumari', specialty: 'Medical Officer | 7+ years experience', img: '../resource/Dr7.jpg' }
];

const doctorList = document.getElementById('doctorList');
doctors.forEach(doc => {
  const card = document.createElement('div');
  card.className = 'doctor-card';
  card.innerHTML = `
    <img src="${doc.img}" alt="Doctor">
    <div class="doctor-info">
      <h3>${doc.name}</h3>
      <p>${doc.specialty}</p>
      <div class="consult-btns">
        <button onclick="openForm('${doc.name}')">Video Call</button>
        <button onclick="openForm('${doc.name}')">Audio Call</button>
      </div>
    </div>
  `;
  doctorList.appendChild(card);
});

function openForm(doctor) {
  document.getElementById('formTitle').innerText = `Call ${doctor}`;
  document.getElementById('consultForm').style.display = 'flex';
}

function closeForm() {
  document.getElementById('consultForm').style.display = 'none';
  alert('Appointment booked successfully!');
}

  function closeForm1() {
    document.getElementById('consultForm').style.display = 'none';
  }
  
