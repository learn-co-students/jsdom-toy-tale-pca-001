let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  toyForm.addEventListener("submit", createToy)

  fetchToys();
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });


  function fetchToys() {
    fetch("http://localhost:3000/toys")
    .then(resp => { return resp.json() })
    .then(json => {
      toyCollection = document.getElementById("toy-collection")
      json.forEach( toy => {
        const toyDiv = buildToyDiv(toy)

        toyCollection.appendChild(toyDiv)
      })
     })
  }
});

function buildToyDiv(toy) {
  const toyDiv = document.createElement("div")
  toyDiv.classList.add("card")

  //name
  h2 = document.createElement("h2")
  h2.innerText = toy.name
  toyDiv.appendChild(h2)

  //img
  img = document.createElement("img")
  img.src = toy.image
  img.classList.add("toy-avatar")
  toyDiv.appendChild(img)

  //likes
  p = document.createElement("p")
  p.innerHTML = `<span id="${toy.id}-likes">${toy.likes}</span> likes`
  toyDiv.appendChild(p)

  // like button
  btn = document.createElement("button")
  btn.classList.add("like-btn")
  btn.innerText = "Like <3"
  btn.onclick = () => incrementLikes(toy.id)
  toyDiv.appendChild(btn)

  return toyDiv
}

function createToy(e) {
  e.preventDefault()
  let nameInput = document.getElementsByClassName("input-text").name
  let imageInput = document.getElementsByClassName("input-text").image

  let formData = {
    name: nameInput.value,
    image: imageInput.value,
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

  console.log(configObj)

  fetch("http://localhost:3000/toys", configObj)
  .then(resp => {
    return resp.json()
  })
  .then(toy => {
    let toyCollection = document.getElementById("toy-collection")
    console.log(toy)
    let newToyDiv = buildToyDiv(toy)
    toyCollection.appendChild(newToyDiv)
    nameInput.value = ""
    imageInput.value = ""

  })
  .catch(errors => {
    let error = document.createTextNode(errors)
    document.body.appendChild(error)
    console.log(errors)
  })


}

function incrementLikes(id) {
  like_container = document.getElementById(`${id}-likes`)
  likes = like_container.innerText
  let configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": ++likes
    })
  }

  fetch(`http://localhost:3000/toys/${id}`, configObj)
  .then(resp => { return resp.json() })
  .then(json => {
    document.getElementById(`${id}-likes`).innerText = json.likes
  })


}