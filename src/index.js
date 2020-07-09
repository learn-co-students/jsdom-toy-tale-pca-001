let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const toyUrl= "http://localhost:3000/toys"
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", createToy)

  fetchToys(toyUrl)
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  function fetchToys(toyUrl){
    return fetch(toyUrl)
   .then(response => response.json())
   .then(jsonResults => renderToys(jsonResults)
   )}

  function renderToys(jsonToys) {
    console.log(jsonToys)
    let toysDiv = document.getElementById("toy-collection");
    jsonToys.forEach(function(toy) {
      const div = document.createElement("div")
      div.classList.add("card")
      //name
      h2 = document.createElement("h2")
      h2.innerText = toy.name
      div.appendChild(h2)
      //img
      img = document.createElement("img")
      img.src = toy.image
      img.classList.add("toy-avatar")
      div.appendChild(img)
      //likes
      p = document.createElement("p")
      p.innerHTML = `<span id="${toy.id}-likes">${toy.likes}</span> likes`
      div.appendChild(p)
      // like button
      btn = document.createElement("button")
      btn.classList.add("like-btn")
      btn.innerText = "Like <3"
      btn.onclick = () => incLikes(toy.id, toy.likes)
      div.appendChild(btn)

      toysDiv.appendChild(div)
    })
    return toysDiv
  }

  function incLikes(id, likes) {
  let configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": likes,
    })
    }
    fetch(`http://localhost:3000/toys/${id}`,configurationObject)
    .then(response => { return response.json() })
    .then(jsonResults => { document.getElementById(`${id}-likes`).innerText++ })
  }

  function createToy(event){
    event.preventDefault()
    let nameInput = document.getElementsByClassName("input-text").name
    let imgInput = document.getElementsByClassName("input-text").image

    let configurationObject = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body:JSON.stringify({
        "name" : nameInput.value,
        "image" : imgInput.value,
        "likes" : 0
      })
    };
    fetch("http://localhost:3000/toys", configurationObject)
    .then(response => { return response.json() })
    .then(toy => {
      let toyCollection = document.getElementById("toy-collection")
      let newToyDiv = createToy(toy)
      toyCollection.appendChild(newToyDiv)
    })
  }
})



