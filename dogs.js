function getBreeds() {
    axios.get("https://dog.ceo/api/breeds/list/all")
        .then((response) => {
            console.log(response);
            let breeds = response.data.message;
            return breeds
        })
        .then((breeds) => {
            renderAllBreeds(breeds);
        })
}

function renderAllBreeds(breeds) {
    let ul = document.createElement("ul");

    for (let data in breeds) {
        let li = document.createElement("li")
        li.textContent = data;
        li.className = "allBreeds";
        ul.appendChild(li);
        console.log(data)
    }
    document.body.appendChild(ul);
}

getBreeds();