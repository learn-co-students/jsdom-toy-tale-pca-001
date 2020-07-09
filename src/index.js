let addToy = false;

document.addEventListener("DOMContentLoaded", () => {

  fetchToys()

  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addBtn.addEventListener('click', function() {
    fetchNewToy();
  });




  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

//fecth the toys first

function fetchToys() {
  return fetch("http://localhost:3000/toys")
    .then(function(response) {
      return response.json();
    })

    .then(function(json) {
      let fetchedToys = json
      displayToys(fetchedToys)
    });
};

//add divs to each toy

function displayToys(fetchedToys) {
  fetchedToys.forEach(toy => {
    let tCollection = document.getElementById("toy-collection")
    let addedDiv = document.createElement('div')
    addedDiv.classList.add('card')
    addedDiv.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    `

    //add like <p> and set variable for count
    let numberOfLikes = document.createElement('p')
    numberOfLikes.innerHTML = `${toy.likes}`
    addedDiv.append(numberOfLikes)

      //add a Like button, addEvent, and append
      let likeBtn = document.createElement('button')
        likeBtn.class = 'like-btn'
        likeBtn.innerText = 'Like <3'

        let addLike = function() {
          addingLikes(numberOfLikes);
        }

        likeBtn.addEventListener("click", addLike);

        addedDiv.append(likeBtn)

    tCollection.append(addedDiv)
  })
}

//adding plus one like
function addingLikes(numberOfLikes) {
  let newNumber = parseInt(numberOfLikes.innerHTML);
  newNumber++;
  numberOfLikes.innerHTML = newNumber;
};



// add a new toy

function fetchNewToy() {

  let formData = {
    name: document.getElementsByClassName("input-text")["name"].value,
    image: document.getElementsByClassName("input-text")["image"].value
  };

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementsByClassName("input-text")["name"].value,
      image: document.getElementsByClassName("input-text")["image"].value
    })

  };

  return fetch("http://localhost:3000/toys", configObj)
  .then(function(response) {
    return response.json();
  })
  .then(function(object) {
    displayToys(object)
  })
}