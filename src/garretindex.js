// assesment
// uses:
// npm install -g json-server
// json-server --watch db.json
// requires: 3 calls to server (GET,and POST, PATCH, or DELETE, etc.)
// - successfully minipulate DOM
// - properly use fetch
// - understand javascript events

// debug in browser
// can use console.log in index.js and see what shoes on DOM
// can do querySelectors in console to see what it highights
let addToy = false //given for hidden form

function addToyToPage(toy) { // can console.log(toy) to make sure you are hitting it
  const card = document.createElement("div") // making the div element
  card.classList.add("card") // giving the div a class name of card
  card.innerHTML = //console log(toy.id) to see if that works and you an get the ids, then toy.image, etc
  `
  <h2>${toy.name}</h2>
  <img src="${toy.image}" class="toy-avatar" />
  <p><span id="toy-${toy.id}-like-count">${toy.likes}</span> Likes</p>
  <button id="like-toy-${toy.id}" class="like-btn">Like <3</button>
  `
  //added span just so we can isolate/ select toy.likes
  //wrapped in upticks so we can use double quotes and still interpolate
  const toySection = document.querySelector("#toy-collection")
  toySection.appendChild(card) //adds the toy to the page
  listenToToyLikes(toy)
}

  function listenToToyLikes(toy) {
    const likeButton = document.getElementById(`like-toy-${toy.id}`) // need upticks not quote to interpolate
    likeButton.addEventListener("click", function(event) { // even though its a button, it is not on a form so listening for click not submit
      updateToyLike(toy)
    })
  }

  function updateToyLike(toy) {
    const likeCount = document.querySelector(`#toy-${toy.id}-like-count`)

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH", //given in read me directions
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": parseInt(likeCount.innerText) +1
      })
    }).then(response => { return response.json()
    }).then(toy => {
        likeCount.innerHTML = toy.likes
    })
  }

  // "when the page loads"
  document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.querySelector("#new-toy-btn"); // botton that shows the form for adding new toy
    const toyFormContainer = document.querySelector(".container"); // class container has the form for add new toy
    const toyForm = document.querySelector(".add-toy-form") // can also add to the html document an id to make it more unique

    fetch("http://localhost:3000/toys")
      .then(response => { return response.json() // to check use console.log(response) then move on to next then
    }).then(toys => { // can check with console.log(toys), toys is an array, representing the response from line above
      for (const toy of toys) { //toy is the single iteration of the response of toys
        addToyToPage(toy) //function that will define elsewhere
       }
    })

    addBtn.addEventListener("click", () => { //when button is clicked
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block"; // show the form
      } else {
        toyFormContainer.style.display = "none"; // hide the form
      }
    });
    // dont need to keep on going back to load all pages, we want to do a asymchronous call
    // asymchonous allows the user to see/ do (i.e. scroll) other things while other things load
    toyForm.addEventListener("submit", function(submitevent){ // listing for the submit since its a form not just a click
      submitevent.preventDefault() //doesnt take an argument but need () to invoke; does not require a refresh
      const nameEl = document.querySelector("#name-input") //added id to index.html
      const imageEl = document.querySelector("#image-input") //added id to index.html

      fetch("http://localhost:3000/toys", { //can put in one block not break it up
        method: "POST", //given in read me directions
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          "name": nameEl.value,
          "image": imageEl.value,
          "likes": 0
        })
      }).then(response => { return response.json()
      }).then(toy => {
        addToyToPage(toy)  //this is what renders the toy on the page so you can see it
        nameEl.value = "" //this will revert the text box to blank once submitted
        imageEl.value = ""
      }).catch(error => { console.log(error.message) })
    })
  })