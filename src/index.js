let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toysUrl = "http://localhost:3000/toys"
  const toyForm = document.querySelector(".add-toy-form")

  fetchToys(toysUrl)

  toyForm.addEventListener("submit", createToy)

  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  });

function fetchToys(toysUrl) {
  return fetch(toysUrl)
  .then(response => response.json())
  .then(json => renderToys(json))
}


function renderToys(toys) {
  let toyDiv = document.getElementById("toy-collection")
  for(const toy of toys) {
    const div = document.createElement("div")
    div.classList.add("card")

    h2 = document.createElement("h2")
    h2.innerText = toy.name
    div.appendChild(h2)

    img = document.createElement("img")
    img.src = toy.image
    img.classList.add("toy-avatar")
    div.appendChild(img)

    p = document.createElement("p")
    p.innerHTML = `<span id="${toy.id}-likes">${toy.likes}</span> likes`
    div.appendChild(p)

    button = document.createElement("button")
    button.classList.add("like-btn")
    button.innerText = "Like"
    button.onclick = () => incrementLikes(toy.id, toy.likes)
    div.appendChild(button)

    toyDiv.appendChild(div)
    // console.log(toy)
  }
  return toyDiv
}

function incrementLikes(id, likes) {
  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": likes
    })
  }

  fetch(`http://localhost:3000/toys/${id}`, configObj)
  .then(resp => { return resp.json() })
  .then(json => {
    document.getElementById(`${id}-likes`).innerText++
  })
}

function createToy(event) {
  event.preventDefault(true)
  let name = document.getElementsByClassName("input-text").name
  let image = document.getElementsByClassName("input-text").image

  let formData = {
    name: name.value,
    image: image.value,
    likes: 0
  }

  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(formData)
  };

  fetch("http://localhost:3000/toys", configObj)
  .then(function(response) {
    return response.json()
  })
  .then(function(toy) {
    let toyCollection = document.getElementById("toy-collection")
    let newToyDiv = renderToys(toy)
    toyCollection.appendChild(newToyDiv)
    name.value = ""
    image.value = ""
  })
  .catch(errors => {
    let error = document.createTextNode(errors)
    document.body.appendChild(error)
  })
}

fetch("http://localhost:3000/toys")
.then(function(response) {
  return response.json();
})
.then(function(json) {
  console.log(json)
});