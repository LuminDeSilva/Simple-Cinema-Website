function fetchAdditionalItems() {
    const apiUrl = 'https://www.the-moviedb.org/documentation/api'; 
    
    fetch(apiUrl).then(response => response.json()).then(data => {
            displayAdditionalItems(data.results);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayAdditionalItems(items) {
    const additionalItemsContainer = document.getElementById('additionalItems');
    
    additionalItemsContainer.innerHTML = '';

    items.forEach(item => {
        const cardHtml = `
            <div class="col-12 col-md-6 col-lg-4 mb-3">
                <div class="card">
                    <img src="${item.image}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.description}</p>
                    </div>
                </div>
            </div>
        `;
        additionalItemsContainer.innerHTML += cardHtml;
    });
}

window.addEventListener('load', fetchAdditionalItems);


function displayMovies(movies) {
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.innerHTML = ''; 

    movies.forEach(movie => {
        const { title, overview, poster_path } = movie;
        const imageUrl = poster_path
            ? `https://image.tmdb.org/t/p/w200${poster_path}`
            : 'No image available.'; 

        const movieItem = `
            <div class="favorite-item">
                <img src="${imageUrl}" alt="${title}">
                <h3>${title}</h3>
                <p>${overview}</p>
            </div>
        `;

        favoritesGrid.insertAdjacentHTML('beforeend', movieItem);
    });
}

function submitForm(event) {
    event.preventDefault();
    
    let firstName = document.getElementById("first-name").value;
    let lastName = document.getElementById("last-name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let comments = document.getElementById("comments").value;

    let errors = [];
    if (!firstName.trim()) {
        errors.push("First name is required.");
    }
    if (!lastName.trim()) {
        errors.push("Last name is required.");
    }
    if (!email.trim()) {
        errors.push("Email is required.");
    } else if (!isValidEmail(email)) {
        errors.push("Invalid email format.");
    }

    if (errors.length > 0) {
        displayErrors(errors);
        return;
    }

    let formData = new FormData();
    formData.append("first-name", firstName);
    formData.append("last-name", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("comments", comments);

    fetch("submit.php", {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        if (data.message) {
            alert(data.message);
            document.getElementById("contact-form").reset();
        } else {
            alert("Error submitting form. Please try again.");
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}

function isValidEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayErrors(errors) {
    let errorList = errors.map(error => `<li>${error}</li>`).join("");
    let errorHTML = `<ul>${errorList}</ul>`;
    document.getElementById("error-messages").innerHTML = errorHTML;
}