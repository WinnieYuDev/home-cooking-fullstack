// Grab elements
var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down");
var trash = document.getElementsByClassName("fa-trash");

// Thumbs Up
Array.from(thumbUp).forEach(function(element) {
  element.addEventListener('click', function() {
    const li = this.closest('li');             
    const id = li.dataset.id;                  
    fetch('/dishes/thumbUp', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ '_id': id })
    })
    .then(res => res.json())
    .then(data => {
      if(data.thumbsUp !== undefined) {
        li.querySelector('.thumbUpCount').textContent = data.thumbsUp;
      }
    })
    .catch(err => console.error(err));
  });
});

// Thumbs Down
Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function() {
    const li = this.closest('li');
    const id = li.dataset.id;                 
    fetch('/dishes/thumbDown', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ '_id': id })
    })
    .then(res => res.json())
    .then(data => {
      if(data.thumbsDown !== undefined) {
        li.querySelector('.thumbDownCount').textContent = data.thumbsDown;
      }
    })
    .catch(err => console.error(err));
  });
});

// Delete Dish
Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    const li = this.closest('li');
    const id = li.dataset.id;  // grabs data-id
    console.log('Delete route id:', id); // Debug

    fetch('/dishes', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ _id: id }) // MUST be `_id`, not `id`
    })
    .then(res => res.json())
    .then(data => {
      console.log('Deleted', data);
      window.location.reload(); // optional: you could remove this and just remove the <li> dynamically
    });
  });
});

//Citations:
//Modified code from youtube tutorial: https://www.youtube.com/watch?v=z5UgtXOxEEk
//Reference code from https://www.mongodb.com/resources/languages/express-mongodb-rest-api-tutorial#setting-up-the-project
//Use of dotenv package to hide sensitive info: https://www.npmjs.com/package/dotenv
//Use of Learning Mode on AI tools to help with code structure,syntax and debugging  
