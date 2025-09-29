document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let currentPatient = null;
    let currentPrescription = []; // Array to hold medication objects

    // --- MOCK DATA ---
    const appointmentsData = [
        { name: 'Gurpreet Singh', village: 'Alohran', complaint: 'Fever and body ache', history: 'None', time: '10:00 AM' },
        { name: 'Manjeet Kaur', village: 'Bhadson', complaint: 'Stomach pain', history: 'Gastritis', time: '10:15 AM' },
        { name: 'Baldev Raj', village: 'Rohti', complaint: 'Breathing difficulty', history: 'Asthma', time: '10:30 AM', urgent: true },
    ];
    
    // Expanded medicine list
    const pharmacyStock = {
        'Paracetamol 500mg': { available: true },
        'Paracetamol 650mg': { available: true },
        'Ibuprofen 400mg': { available: true },
        'Diclofenac 50mg': { available: true },
        'Amoxicillin 500mg': { available: false, alternative: 'Azithromycin 500mg' },
        'Azithromycin 500mg': { available: true },
        'Ciprofloxacin 500mg': { available: true },
        'Metronidazole 400mg': { available: true },
        'Ondansetron 4mg': { available: true },
        'Domperidone 10mg': { available: false, alternative: 'Ondansetron 4mg' },
        'Ranitidine 150mg': { available: true },
        'Omeprazole 20mg': { available: true },
        'Cetirizine 10mg': { available: true },
        'Loratadine 10mg': { available: true },
        'Salbutamol Inhaler': { available: true },
        'Metformin 500mg': { available: true },
        'Amlodipine 5mg': { available: true },
        'Atorvastatin 10mg': { available: true },
        'ORS Powder': { available: true },
    };

    // --- ELEMENTS ---
    const loginView = document.getElementById('loginView');
    const dashboardView = document.getElementById('dashboardView');
    const consultationView = document.getElementById('consultationView');
    const prescriptionModal = document.getElementById('prescriptionModal');

    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const endCallButton = document.getElementById('endCallButton');
    const generateRxButton = document.getElementById('generateRxButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const addMedicationButton = document.getElementById('addMedicationButton');
    
    const doctorName = document.getElementById('doctorName');
    const usernameInput = document.getElementById('username');
    const appointmentList = document.getElementById('appointmentList');
    const heatmapToggle = document.getElementById('heatmapToggle');
    const mapContainer = document.getElementById('mapContainer');
    const medicationInput = document.getElementById('medicationInput');
    const suggestionBox = document.getElementById('suggestionBox');
    const medicationList = document.getElementById('medicationList');

    const diagnosisInput = document.getElementById('diagnosisInput');
    const adviceInput = document.getElementById('adviceInput');

    // --- FUNCTIONS ---
    function showView(view) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'none';
        consultationView.style.display = 'none';
        view.style.display = view === loginView ? 'flex' : 'block';
    }

    function populateAppointments() {
        appointmentList.innerHTML = '';
        appointmentsData.forEach(appt => {
            const apptElement = document.createElement('div');
            apptElement.className = `p-4 rounded-lg flex items-center justify-between ${appt.urgent ? 'bg-red-100 border-l-4 border-red-500' : 'bg-gray-100'}`;
            apptElement.innerHTML = `
                <div>
                    <p class="font-bold text-lg">${appt.name} ${appt.urgent ? '<span class="text-red-600 font-semibold ml-2">(Emergency)</span>' : ''} <span class="text-sm font-normal text-gray-600">(${appt.village})</span></p>
                    <p class="text-sm text-gray-700">${appt.complaint}</p>
                </div>
                <div class="text-right">
                     <p class="font-semibold">${appt.time}</p>
                     <button class="start-call-btn mt-1 bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition" data-patient='${JSON.stringify(appt)}'>
                        Start Call
                     </button>
                </div>
            `;
            appointmentList.appendChild(apptElement);
        });
    }
    
    function startConsultation(patientData) {
        currentPatient = patientData; // Store current patient details
        document.getElementById('consultPatientName').textContent = patientData.name;
        document.getElementById('videoPatientName').textContent = patientData.name;
        document.getElementById('consultPatientVillage').textContent = patientData.village;
        document.getElementById('consultPatientComplaint').textContent = patientData.complaint;
        document.getElementById('consultPatientHistory').textContent = patientData.history;
        
        // Reset prescription form
        currentPrescription = [];
        renderPrescriptionList();
        diagnosisInput.value = '';
        adviceInput.value = '';
        medicationInput.value = '';
        
        showView(consultationView);
    }
    
    function renderPrescriptionList() {
        medicationList.innerHTML = '';
        if (currentPrescription.length === 0) {
            medicationList.innerHTML = '<p class="text-sm text-gray-500">No medicines added yet.</p>';
        } else {
            currentPrescription.forEach((med, index) => {
                const medElement = document.createElement('div');
                medElement.className = 'flex justify-between items-center bg-blue-100 p-2 rounded-md';
                medElement.innerHTML = `
                    <span class="font-semibold text-blue-800">${med.name}</span>
                    <button class="remove-med-btn text-red-500 hover:text-red-700" data-index="${index}">
                        <i class="ph-x-circle text-xl"></i>
                    </button>
                `;
                medicationList.appendChild(medElement);
            });
        }
    }

    function checkPharmacyStock() {
        const query = medicationInput.value.toLowerCase().trim();
        suggestionBox.innerHTML = '';
        
        if (query.length < 2) {
            suggestionBox.style.display = 'none';
            return;
        }

        const availableHtml = [];
        const alternativesHtml = [];
        
        Object.keys(pharmacyStock).forEach(med => {
            if (med.toLowerCase().includes(query)) {
                const stockInfo = pharmacyStock[med];
                if (stockInfo.available) {
                    availableHtml.push(`<div class="p-2 cursor-pointer hover:bg-gray-100 suggestion-item" data-med="${med}">${med} <span class="text-xs text-green-600">(Available)</span></div>`);
                } else if (stockInfo.alternative) {
                    alternativesHtml.push(`<div class="p-2 cursor-pointer hover:bg-gray-100 suggestion-item" data-med="${stockInfo.alternative}">${med} <span class="text-xs text-yellow-600">(Unavailable)</span><br><span class="text-xs ml-2">→ Suggest: ${stockInfo.alternative}</span></div>`);
                }
            }
        });
        
        if (availableHtml.length > 0 || alternativesHtml.length > 0) {
            suggestionBox.innerHTML = availableHtml.join('') + alternativesHtml.join('');
            suggestionBox.style.display = 'block';
        } else {
            suggestionBox.style.display = 'none';
        }
    }
    
    function createDiseaseChart() {
        const ctx = document.getElementById('diseaseChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Viral Fever',
                    data: [65, 59, 80, 81],
                    borderColor: 'rgba(59, 130, 246, 1)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Diarrhea',
                    data: [45, 55, 60, 50],
                     borderColor: 'rgba(234, 179, 8, 1)',
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Skin Infection',
                    data: [28, 48, 40, 35],
                    borderColor: 'rgba(22, 163, 74, 1)',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
    }

    // --- EVENT LISTENERS ---
    loginButton.addEventListener('click', () => {
        doctorName.textContent = usernameInput.value || 'Doctor';
        populateAppointments();
        createDiseaseChart();
        showView(dashboardView);
    });

    logoutButton.addEventListener('click', () => {
        showView(loginView);
    });

    appointmentList.addEventListener('click', (e) => {
        const startButton = e.target.closest('.start-call-btn');
        if (startButton) {
            const patientData = JSON.parse(startButton.dataset.patient);
            startConsultation(patientData);
        }
    });

    endCallButton.addEventListener('click', () => {
        showView(dashboardView);
        currentPatient = null; // Clear current patient
    });
    
    addMedicationButton.addEventListener('click', () => {
        const medName = medicationInput.value.trim();
        if (medName && !currentPrescription.find(m => m.name === medName)) {
            currentPrescription.push({ name: medName });
            renderPrescriptionList();
            medicationInput.value = '';
            suggestionBox.style.display = 'none';
        }
    });
    
    medicationList.addEventListener('click', (e) => {
        const removeButton = e.target.closest('.remove-med-btn');
        if (removeButton) {
            const indexToRemove = parseInt(removeButton.dataset.index, 10);
            currentPrescription.splice(indexToRemove, 1);
            renderPrescriptionList();
        }
    });

    generateRxButton.addEventListener('click', () => {
        if (!currentPatient) return;

        // Populate patient details
        document.getElementById('rxPatientName').textContent = currentPatient.name;
        document.getElementById('rxPatientVillage').textContent = currentPatient.village;
        document.getElementById('rxDate').textContent = new Date().toLocaleDateString('en-GB');

        // Populate prescription list
        const finalRxList = document.getElementById('finalRxList');
        finalRxList.innerHTML = '';
        if (currentPrescription.length > 0) {
            currentPrescription.forEach(med => {
                const li = document.createElement('div');
                li.className = 'prescription-line';
                li.innerHTML = `<strong class="mr-2">Medicine (ਦਵਾਈ):</strong> ${med.name}`;
                finalRxList.appendChild(li);
            });
        } else {
             finalRxList.innerHTML = `<div class="prescription-line">No medication prescribed.</div>`;
        }
        
        // Populate advice
        document.getElementById('finalRxAdvice').textContent = adviceInput.value || 'As directed by the doctor.';

        prescriptionModal.style.display = 'flex';
    });
    
    closeModalButton.addEventListener('click', () => {
        prescriptionModal.style.display = 'none';
    });

    heatmapToggle.addEventListener('change', () => {
        mapContainer.classList.toggle('heatmap-visible');
    });

    medicationInput.addEventListener('input', checkPharmacyStock);

    suggestionBox.addEventListener('click', (e) => {
        const item = e.target.closest('.suggestion-item');
        if (item) {
            medicationInput.value = item.dataset.med;
            suggestionBox.innerHTML = '';
            suggestionBox.style.display = 'none';
            medicationInput.focus();
        }
    });

    // Initial state
    renderPrescriptionList(); // Initial render for the empty list
});