let addToy = false;

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json"
}

function displayToysOnPage(toy){
  const card = document.createElement("div")
  card.classList.add("card")
  card.id = `toy-card-${toy.id}`
  card.innerHTML = `
    <button id="like-toy-${toy.id}" class="like-btn">Like <3</button>
    <p><span id="toy-${toy.id}-like-count">${toy.likes}</span> Likes </p>
    <img src="${toy.image}" class="toy-avatar" />
    <h2>${toy.name}</h2>
    <button id="delete-toy-${toy.id}" class="delete-btn">Delete Toy</button>
  `
  const toySection = document.querySelector("div#toy-collection")
  toySection.appendChild(card)
  listenToToyLikes(toy)
  listenToDeleteToy(toy)
}

function listenToToyLikes(toy) {
  const likeButton = document.getElementById(`like-toy-${toy.id}`)
  likeButton.addEventListener("click", function(event) {
    updateToyLike(toy)
  })
}

function updateToyLike(toy) {
  const likeCount = document.querySelector(`#toy-${toy.id}-like-count`)

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      likes: parseInt(likeCount.innerText) + 1
    })
  }).then(function(resp) {
    return resp.json()
  }).then(function(toy) {
    likeCount.innerText = toy.likes
  })
}

function listenToDeleteToy(toy) {
  const deleteButton = document.querySelector(`#delete-toy-${toy.id}`)
  deleteButton.addEventListener("click", function(event) {
    deleteToy(toy)
  })
}

function deleteToy(toy) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "DELETE",
  }).then(function(resp) {
    document.querySelector(`#toy-card-${toy.id}`).remove()
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn")
  const toyFormContainer = document.querySelector(".container")
  const toyForm = document.querySelector("#toy-form")

  fetch("http://localhost:3000/toys").then(function(resp) {
    return resp.json()
  }).then(function(toys) {
    for (const toy of toys) {
      displayToysOnPage(toy)
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
      headers: headers,
      body: JSON.stringify({
        name: nameEl.value,
        image: imageEl.value,
        likes: 0
      })
    }).then(function(resp) {
      return resp.json()
    }).then(function(toy) {
      displayToysOnPage(toy)
      nameEl.value = ""
      imageEl.value = ""
    }).catch(function(error) {
      console.log(error.message)
    })
  })
})