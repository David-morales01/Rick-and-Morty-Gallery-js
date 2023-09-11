const search = document.querySelector(".inputSearch"),
  loader = document.querySelector(".loader"),
  container = document.querySelector(".container"),
  share = document.querySelector(".share"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  random = document.querySelector(".random"),
  result = document.querySelector(".result"),
  containerImages = document.querySelector(".imagesContainer");
(queryParams = new URLSearchParams(window.location.search)),
  (parameterGet = Object.fromEntries(queryParams.entries()));

let start = parameterGet.start ? Number(parameterGet.start) : 1,
  max = 819;

if (isNaN(start)) {
  start = 1;
}

function fetchImages() {
  history.pushState(null, "", `index.html?start=${start}`);
  container.classList.add("transition-0");
  container.classList.add("opacity-0");
  loader.classList.remove("opacity-0");

  let url = "https://rickandmortyapi.com/api/character/";
  for (let i = start; i <= Number(start) + 12; i++) {
    url += i + ",";
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((character) => {
      container.classList.remove("transition-0");
      containerImages.innerHTML = "";
      let contador = 1;
      character.forEach(function (character) {
        if (contador >= 9) {
          return false;
        }
        contador++;
        createCharacterContainer(character);
      });
    })
    .finally(() => {
      setTimeout(() => {
        loader.classList.add("opacity-0");
        container.classList.remove("opacity-0");
      }, 2000);
    });
}
containerImages.addEventListener("mouseover", () => {
  result.classList.add("opacity-0");
  result.innerHTML = "";
  containerImages.classList.remove("opacity-5");
});
function createCharacterContainer(character) {
  const imageContainerEl = document.createElement("div");
  imageContainerEl.classList.add("image-container");

  const imageEl = document.createElement("img");
  const description = document.createElement("div");
  description.classList.add("description");
  const descriptionHeader = document.createElement("div");
  descriptionHeader.classList.add("descriptionHeader");
  const descriptionBody = document.createElement("div");
  descriptionBody.classList.add("descriptionBody");

  descriptionHeader.textContent = character.name;

  const paragraph1 = document.createElement("p");
  const paragraph2 = document.createElement("p");
  const paragraph3 = document.createElement("p");
  const paragraph4 = document.createElement("p");
  const paragraph5 = document.createElement("p");

  if (!character.type) {
    character.type = "Unknown";
  }

  paragraph1.textContent = "Status : " + character.status;
  paragraph2.textContent = "Species : " + character.species;
  paragraph3.textContent = "Type : " + character.type;
  paragraph4.textContent = "Gender : " + character.gender;
  paragraph5.textContent = "Origin : " + character.origin.name;

  descriptionBody.appendChild(paragraph1);
  descriptionBody.appendChild(paragraph2);
  descriptionBody.appendChild(paragraph3);
  descriptionBody.appendChild(paragraph4);
  descriptionBody.appendChild(paragraph5);

  description.appendChild(descriptionHeader);
  description.appendChild(descriptionBody);

  imageEl.src = character.image;
  imageContainerEl.appendChild(imageEl);
  imageContainerEl.appendChild(description);
  containerImages.appendChild(imageContainerEl);
}

fetchImages();

random.addEventListener("click", () => {
  start = Math.ceil(Math.random() * max);
  fetchImages();
});

prev.addEventListener("click", () => {
  start = start <= 8 ? 1 : (start -= 8);
  fetchImages();
});

next.addEventListener("click", () => {
  start = start >= max - 8 ? max - 8 : (start += 8);

  fetchImages();
});

function searchCharacterFor (e) {
  result.classList.add("opacity-0");
  containerImages.classList.add("opacity-5");

  result.innerHTML = "";

  let personaje = search.value;
  if (!personaje) {
    containerImages.classList.remove("opacity-5");
    return false;
  }

  fetch("https://rickandmortyapi.com/api/character/?name=" + personaje)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      result.classList.remove("opacity-0");
      if (response.error) {
        result.innerHTML = "";
        const messageError = document.createElement("span");
        messageError.textContent = 'There is no character "' + personaje + '"';
        messageError.classList.add("messageError");
        result.appendChild(messageError);
      } else {
        let { results } = response;
        let coincidences= "only one match was found";
        let countcoincidences =0 ;
        results.forEach(function (response) {
          const resultsContainerEl = document.createElement("div");
          resultsContainerEl.dataset.id = response.id;
          resultsContainerEl.classList.add("result-container");

          const imageResult = document.createElement("img");
          const descriptionResult = document.createElement("p");

          descriptionResult.dataset.id = response.id;
          imageResult.dataset.id = response.id;

          imageResult.src = response.image;
          origin = response.origin.name; 
          if (origin != "unknown") {
            origin = " Origin : " + origin;
          } else {
            origin = "";
          }
          descriptionResult.textContent = response.name + " " + origin;

          resultsContainerEl.appendChild(imageResult);
          resultsContainerEl.appendChild(descriptionResult);

          result.appendChild(resultsContainerEl);
          countcoincidences++
        });
        if(countcoincidences >1){
          coincidences = `${countcoincidences} matches were found`
        }
        const text = document.createElement("p");
        text.classList.add("coincidences");
        text.textContent = coincidences;

        result.appendChild(text)
      }
    });
}


search.addEventListener("input", searchCharacterFor);
search.addEventListener("mouseover", searchCharacterFor);

share.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location + `?start=${start}`);
  const message = document.createElement("div");
  message.classList.add("clipboard-message");
  message.textContent = "Copied to clipboard";
  share.appendChild(message);
  setTimeout(() => {
    const messageContainer = share.querySelector("div");
    messageContainer.remove();
  }, 2000);
});

result.addEventListener("click", (e) => {
  if (e.target.dataset.id) {
    result.classList.add("opacity-0");
    result.innerHTML = "";
    search.value = "";
    start = e.target.dataset.id;
    fetchImages();
  }
});
