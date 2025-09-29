function getLocation() {
  const output = document.getElementById("location-message");
  const cards = document.getElementById("cards-container");

  if (!navigator.geolocation) {
    output.textContent = "Geolocation not supported.";
    return;
  }

  output.textContent = "Fetching your location...";

  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const address = data.display_name || "Unknown location";
        output.innerHTML = `📍 Location:<br>${address}<br><br>`;

        if (cards) cards.style.display = "flex";

        const city = data.address
          ? data.address.city || data.address.town || data.address.village
          : null;
        const state = data.address ? data.address.state : null;

        let language = null;

        if (state === "Assam") language = "as"; // Assamese
        else if (state === "Bihar") language = "bh"; // Bhojpuri / Hindi
        else if (state === "Punjab") language = "pa"; // Punjabi
        else if (state === "West Bengal") language = "bn"; // Bengali
        else if (state === "Maharashtra") language = "mr"; // Marathi
        else if (state === "Gujarat") language = "gu"; // Gujarati
        else if (state === "Kerala") language = "ml"; // Malayalam
        else if (state === "Karnataka") language = "kn"; // Kannada
        else if (state === "Tamil Nadu") language = "ta"; // Tamil
        else if (state === "Odisha") language = "or"; // Odia
        else if (state === "Haryana") language = "hi"; // Hindi
        else if (state === "Rajasthan") language = "hi"; // Hindi
        else if (state === "Uttar Pradesh") language = "hi"; // Hindi
        else if (state === "Madhya Pradesh") language = "hi"; // Hindi
        else if (state === "Chhattisgarh") language = "hi"; // Hindi
        else if (state === "Jharkhand")
          language = "hi"; // Hindi / local dialects
        else if (state === "Himachal Pradesh") language = "hi"; // Hindi
        else if (state === "Uttarakhand") language = "hi"; // Hindi
        else if (state === "Telangana") language = "te"; // Telugu
        else if (state === "Andhra Pradesh") language = "te"; // Telugu
        else if (state === "Tripura") language = "bn"; // Bengali
        else if (state === "Meghalaya")
          language = "en"; // English (common) / Khasi / Garo
        else if (state === "Nagaland") language = "en"; // English
        else if (state === "Manipur") language = "en"; // English / Manipuri
        else if (state === "Mizoram") language = "en"; // English
        else if (state === "Arunachal Pradesh") language = "en"; // English
        else if (state === "Sikkim") language = "ne"; // Nepali
        else if (state === "Goa") language = "pt"; // Portuguese influence, can fallback to Konkani ("kok")

        if (language && typeof translations !== "undefined") {
          translatePage(language);
        }
      })
      .catch(() => {
        output.textContent = "Could not fetch address.";
      });
  }

  function error() {
    output.textContent = "Permission denied or unable to retrieve location.";
  }

  function translatePage(language) {
    const translation = translations[language];
    if (!translation) return;

    for (const id in translation) {
      const element = document.getElementById(id);
      if (element) element.innerHTML = translation[id];
    }
  }
}

// Image slideshow

const images = [
  "./resource/Dr1.jpg",
  "./resource/Dr2.jpg",
  "./resource/Dr4.jpg",
];

let currentIndex = 0;
const imgElement = document.getElementById("slideshow-img");

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  imgElement.style.opacity = 0;
  setTimeout(() => {
    imgElement.src = images[currentIndex];
    imgElement.style.opacity = 1;
  }, 500); // fade-out time
}

setInterval(showNextImage, 3000); // Change image every 3 seconds
