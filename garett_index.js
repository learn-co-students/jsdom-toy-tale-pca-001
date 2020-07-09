let addToy = false;

function addToyToPage(toy) {
  const card = document.createElement("div")
  card.classList.add("card")
  card.id = `toy-card-${toy.id}`
  card.innerHTML = `
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p><span id="toy-${toy.id}-like-count">${toy.likes}</span> Likes </p>
  <button id="like-toy-${toy.id}" class="like-btn">Like <3</button>
  <button id="delete-toy-${toy.id}" class="delete-btn">Delete</button>
  `
  const toySection = document.querySelector("div#toy-collection")
  toySection.appendChild(card)
  listenToToyLikes(toy)
  listenToToyDelete(toy)
}


function listenToToyLikes(toy) {
  const likeButton = document.getElementById(`like-toy-${toy.id}`)
  likeButton.addEventListener("click", function(event){
    updateToyLike(toy)
  })
}

function listenToToyDelete(toy) {
  const deleteButton = document.getElementById(`delete-toy-${toy.id}`)
  deleteButton.addEventListener("click", function(event) {
    deleteToy(toy)
  })
}

function updateToyLike(toy){
  const likeCount = document.querySelector(`#toy-${toy.id}-like-count`)

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: parseInt(likeCount.innerText) + 1
      })
  }).then(function(resp) {
    return resp.json()
  }).then(function(toy) {
    likeCount.innerText = toy.likes
  })
}

function deleteToy(toy) {
  const card = document.getElementById(`toy-card-${toy.id}`)

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }).then(response => response.json()).then(json => card.remove())
}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  const toyForm = document.querySelector("#toy-form")

console.log(toyForm)

  fetch("http://localhost:3000/toys").then(function(resp) {
    return resp.json()
  }).then(function(toys) {
    for (const toy of toys) {
      addToyToPage(toy)
    }
  })


  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  })

  toyForm.addEventListener("submit", function(event) {
    event.preventDefault()
    const nameEl = document.querySelector("#name-input")
    const imageEl = document.querySelector("#image-input")

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: nameEl.value,
        image: imageEl.value,
        likes: 0
      })
    }).then(function(resp){
      return resp.json()
    }).then(function(toy){
      addToyToPage(toy)
      nameEl = ""
      imageEl = ""
    }).catch(function(error){
      console.log(error.message)
    })
  })
})