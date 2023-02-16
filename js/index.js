const search = document.querySelector(".inputSearch"),
  loader = document.querySelector(".loader"),
  container = document.querySelector(".container"),
  share = document.querySelector(".share"),
  random = document.querySelector(".random"),
  result = document.querySelector(".result"),
  containerImages = document.querySelector(".imagesContainer");
(queryParams = new URLSearchParams(window.location.search)),
  (parameterGet = Object.fromEntries(queryParams.entries()));

let start = parameterGet.start ? parameterGet.start : 1;

function fetchImages() {
  container.classList.add("transition-0");
  container.classList.add("opacity-0");
  loader.classList.remove("opacity-0");

  let url = "https://rickandmortyapi.com/api/character/";
  for (var i = start; i <= Number(start) + 12; i++) {
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
        createCgaracterContainer(character);
      });
    })
    .finally(() => {
      setTimeout(() => {
        loader.classList.add("opacity-0");
        container.classList.remove("opacity-0");
      }, 2000);
    });
}

function createCgaracterContainer(character) {
  const imageContainerEl = document.createElement("div");
  if (!character) {
    console.log("xd");
  }
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
  imageEl.dataset.id = character.id;
  imageContainerEl.dataset.idContainer = character.id;
  imageContainerEl.appendChild(imageEl);
  imageContainerEl.appendChild(description);
  containerImages.appendChild(imageContainerEl);
}

fetchImages();

random.addEventListener("click", (e) => {
  e.preventDefault();
  start = Math.ceil(Math.random() * 819);
  fetchImages();
});

search.addEventListener("input", function (e) {
  result.classList.add("opacity-0");
  result.innerHTML = "";

  let personaje = e.target.value;
  if (!personaje) return false;

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
        var { results } = response;
        results.forEach(function (response) {
          const resultsContainerEl = document.createElement("div");

          resultsContainerEl.classList.add("result-container");

          const imageResult = document.createElement("img");
          const descriptionResult = document.createElement("p");
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
        });
      }
    });
});

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
