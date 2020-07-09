let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const addToyForm = document.querySelector(".add-toy-form")

  addToyForm.addEventListener("submit", newToy)

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  })
})

fetch("http://localhost:3000/toys")
  .then(resp => resp.json())
  .then(json => loadToy(json))

function loadToy(json) {
  json.forEach(toy => displayToy(toy))
}

function displayToy(toy) {
  const toyCollection = document.getElementById("toy-collection")

  let div = document.createElement("div")
  let h = document.createElement("h2")
  let img = document.createElement("img")
  let p = document.createElement("p")
  let btn = document.createElement("button")

  div.classList = "card"
  h.innerText = toy.name
  img.src = toy.image
  img.classList = "toy-avatar"
  p.innerHTML = `<span id="toy-${toy.id}-likes">${toy.likes}</span> Likes`
  btn.classList = "like-btn"
  btn.innerText = "Like <3"
  btn.addEventListener("click", incrementLikes(toy.id, toy.likes))

  div.appendChild(h)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(btn)
  toyCollection.appendChild(div)
}

function newToy(event) {
  event.preventDefault()

  let nameInput = document.querySelectorAll("input.input-text")[0].value
  let imageInput = document.querySelectorAll("input.input-text")[1].value

  let formData = {
    name: nameInput,
    image: imageInput,
    likes: 0
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  }

  fetch("http://localhost:3000/toys", configObj)
  .then(resp => resp.json())
  .then(json => displayToy(json))
}

function incrementLikes(id, likes) {
  return function(e) {
    let configObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": likes++
      })
    }

    fetch(`http://localhost:3000/toys/${id}`, configObj)
      .then(resp => resp.json())
      .then(json => {
        document.getElementById(`toy-${id}-likes`).innerText++
      })
  }
}
