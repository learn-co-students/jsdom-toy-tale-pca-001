let addToy = false;

const toyInfoCard = (name, url, id, likes=0) => {
  let mainDiv = document.createElement('div');
  mainDiv.className = 'card';
  mainDiv.innerHTML =
  `
    <h2>${name}</h2>
    <img src=${url} class="toy-avatar" />
    <p class="like">${likes} Likes </p>
    <button class="like-btn">Like <3</button>
    <p class="hidden" hidden>${id}</p>
  `;
  return mainDiv;
}

const addNewToy = (name, url, id) => {
  const newToy = toyInfoCard(name, url, id);
  document.getElementById('toy-collection').appendChild(newToy);
}

const sendToy = (name, image, likes=0) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name,
      image,
      likes
    })
  };
  return fetch('http://localhost:3000/toys', config);
}

const updateToy = (id, like) => {
  const config = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": like
    })
  };
  return fetch(`http://localhost:3000/toys/${id}`, config);
}

const increaseLikes = (e) => {
  const toy = e.srcElement.parentElement;
  const id = toy.getElementsByClassName('hidden')[0].innerHTML;
  const likes = toy.getElementsByClassName('like')[0];
  let likeCount = parseInt(likes.innerHTML.split(" ")[0])
  updateToy(id, likeCount + 1).
    then( (res) => likes.innerHTML = `${likeCount + 1} Likes`);
    // catch( (err) => { debugger; })
}

const displayToys = (toys) => {
  const toyDiv = document.getElementById('toy-collection');
  toys.forEach( (toy) => {
    toyDiv.appendChild(toyInfoCard(toy.name, toy.image, toy.id, toy.likes))
  });
  [...document.getElementsByClassName('like-btn')].forEach( (like) => {
    like.addEventListener('click', increaseLikes);
  })
}

const getToys = () => {
  fetch('http://localhost:3000/toys').
    then( res => res.json() ).
    then( json => { displayToys(json)} );
    // .catch( err => { debugger; } );
}

const sendToyAndAdd = (e) => {
  const toyHTML = (num) => e.srcElement.children[num].value;
  sendToy(toyHTML(1), toyHTML(3)).
    then(res => res.json() ).
    then(json => addNewToy(json.name, json.url, json.id))
    // .catch(err => {console.log(err); debugger; e.preventDefault()});
  // addNewToy('Guilamon', 'https://i.redd.it/dqvgnv4yei631.jpg');
  e.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
  getToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const newToy = document.getElementsByClassName('add-toy-form')[0];

  newToy.addEventListener('submit', sendToyAndAdd);
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    toyFormContainer.style.display = addToy ? 'none' : 'block';
  });
});
