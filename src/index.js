let addToy = false;

const toyInfoCard = (toy) => {
  let mainDiv = document.createElement('div');
  mainDiv.className = 'card';
  mainDiv.innerHTML =
  `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar" />
    <p class="like">${toy.likes} Likes </p>
    <button class="like-btn">Like <3</button>
    <p class="hidden" hidden>${toy.id}</p>
  `;
  return mainDiv;
}

const sendToy = (name, image) => {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name,
      image,
      likes: 0
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
  let likeCount = parseInt(likes.innerHTML.split(" ")[0]);
  updateToy(id, likeCount + 1).
    then( (res) => likes.innerHTML = `${likeCount + 1} Likes`);
    // catch( (err) => { debugger; })
}

const displayToys = (toys) => {
  const toyDiv = document.getElementById('toy-collection');
  toys.forEach( (toy) => toyDiv.appendChild(toyInfoCard(toy)) );
  [...document.getElementsByClassName('like-btn')].forEach( (like) => {
    like.addEventListener('click', increaseLikes);
  });
}

const getToys = () => {
  fetch('http://localhost:3000/toys').
    then( res => res.json() ).
    then( json => { displayToys(json)} );
    // .catch( err => { debugger; } );
}

const addNewToy = (toy) => {
  const newToy = toyInfoCard(toy);
  document.getElementById('toy-collection').appendChild(newToy);
  newToy.addEventListener('click', increaseLikes);
}

const createAndAddToDom = (e) => {
  const toyHTML = (num) => e.srcElement.children[num].value;
  e.preventDefault();
  sendToy(toyHTML(1), toyHTML(3)).
    then(res => res.json() ).
    then(json => addNewToy(json));
    // .catch(err => {console.log(err); debugger; e.preventDefault()});
  // addNewToy('Guilamon', 'https://i.redd.it/dqvgnv4yei631.jpg');
}

document.addEventListener("DOMContentLoaded", () => {
  getToys();
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const newToy = document.getElementsByClassName('add-toy-form')[0];

  newToy.addEventListener('submit', createAndAddToDom);
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    toyFormContainer.style.display = addToy ? 'none' : 'block';
  });
});
