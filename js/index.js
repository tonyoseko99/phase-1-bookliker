document.addEventListener("DOMContentLoaded", function () {
    const ul = document.querySelector("#list");
    const showPanel = document.querySelector("#show-panel");
  
    const getAllBooks = () => fetch("http://localhost:3000/books").then((data) => data.json());
    const getBook = (id) => fetch(`http://localhost:3000/books/${id}`).then((data) => data.json());
  
    (function displayAllBooks() {
      getAllBooks().then((booksArr) => {
        console.log(booksArr);
        booksArr.forEach((bookObj) => {
          const li = document.createElement("li");
          li.setAttribute("id", `${bookObj.id.toString()}`);
          li.textContent = bookObj.title;
          ul.appendChild(li);
  
          const book = document.getElementById(`${bookObj.id}`);
          addOnClick(book);
        });
      });
    })();
  
    const addOnClick = (li) => {
      li.addEventListener("click", () => {
        const bookID = parseInt(li.getAttribute("id"));
        showBookDetails(bookID);
      });
    };
  
    const showBookDetails = (id) => {
      getBook(id).then((bookObj) => {
        showPanel.innerHTML = "";
        const img = document.createElement("img");
        img.setAttribute("src", `${bookObj.img_url}`);
        showPanel.appendChild(img);
  
        const p = document.createElement("p");
        p.textContent = bookObj.description;
        showPanel.appendChild(p);
  
        const ul = document.createElement("ul");
        bookObj.users.forEach((user) => {
          const li = document.createElement("li");
          li.textContent = user.username;
          ul.appendChild(li);
        });
        showPanel.appendChild(ul);
  
        const button = document.createElement("button");
        button.setAttribute("id", `${bookObj.id}`);
        button.textContent = "Like";
        showPanel.appendChild(button);
  
        const currentLikes = bookObj.users;
  
        addButtonListener(currentLikes);
      });
    };
  
    const addLike = (id, currentLikes) =>
      fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ users: currentLikes.concat([{ id: 12, username: "newUser" }]) }),
      }).then((data) => data.json());
  
    const removeLike = (id, currentLikes) =>
      fetch(`http://localhost:3000/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ users: currentLikes.slice(0, currentLikes.length - 1) }),
      }).then((data) => data.json());
  
    const addButtonListener = (likes) => {
      const btn = document.querySelector("button");
      let lastLike = likes[likes.length - 1].id;
  
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("id");
        if (lastLike !== 12) {
          addLike(id, likes)
            .then(() => {
              showBookDetails(id);
            })
            .then(() => (btn.textContent = "unlike"));
        } else {
          removeLike(id, likes)
            .then(() => {
              showBookDetails(id);
            })
            .then(() => (btn.textContent = "like"));
        }
      });
    };
  });