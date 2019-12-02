const BASE_URL = "https://dog.ceo/api/breed";

function getBreeds() {
    window.addEventListener("hashchange", () => {
        refreshPage();
    });
    let url = "s/list/all"
    if (window.location.hash.length > 1) {
        let hash = window.location.hash.slice(1).split("-");
        getOneBreed(hash[0], hash[1]);
        console.log(hash);

    }
    axios.get(BASE_URL + url)

        .then((response) => {
            let breeds = response.data.message;
            return breeds;
        })
        .then((breeds) => {
            getRandomDoggos();
            renderAllBreeds(breeds);
        })
        .catch((error) => {
            error.log(error);
        })
}

// subBreed is optional.
function getOneBreed(breed, subBreed) {
    let url = `/${breed}/images/random/6`;
    if (window.location.hash.length > 1) {

        url = `/${window.location.hash.slice(1)}/images/random/6`
    }

    if (subBreed !== undefined) {
        url = `/${breed}/${subBreed}/images/random/6`;
    }
    axios.get(BASE_URL + url)
        .then((response) => {
            checkSubDoggo(breed);
            arr = response.data.message;
            return arr;
        })
        .then((arr) => {
            renderPictures(arr);
        })
        .catch((error) => {
            error.log(error);
        })
}

function checkSubDoggo(breed) {
    axios.get(BASE_URL + `/${breed}/list`)
        .then((response) => {
            let arr = response.data.message;
            return arr;
        })
        .then((arr) => {
            renderSubBreed(arr, breed);
        })
        .catch((error) => {
            error.log(error);
        })
}

function getRandomDoggos() {
    if (window.location.hash.length > 1) {
        url = `/${window.location.hash.slice(1).replace("-", "/")}/images/random/6`
    } else url = "s/image/random/6"
    axios.get(BASE_URL + url)
        .then((response) => {
            let picArr = response.data.message;
            return picArr;
        })
        .then((picArr) => {
            renderPictures(picArr);
        })
        .catch((error) => {
            error.log(error);
        })

}


function renderAllBreeds(obj) {

    let div = document.querySelector(".start-selector");
    div.innerHTML = "";
    let select = document.createElement("select");
    select.className = "select";
    let option = document.createElement("option");
    option.textContent = "Select a dog";
    select.appendChild(option);
    for (let data in obj) {
        let option = document.createElement("option");
        option.setAttribute("value", data);
        option.textContent = capitalWords(data);
        select.appendChild(option);
    }
    div.appendChild(select);
    select.addEventListener("change", function (e) {
        let breed = e.target.value;
        window.location.hash = breed;
        if (window.location.hash > 1) {
            getOneBreed(window.location.hash);
        }

        getOneBreed(breed);

    })
    for (let i = 0; i < select.length; i++) {
        console.log(select.options[i].text.toLowerCase(), window.location.hash.slice(1));
        let dog = select.options[i].text.toLowerCase();
        if (dog === window.location.hash.slice(1).split("-")[0]) {
            select.options[i].selected = true;

        }
    }
}




function renderSubBreed(arr, breed) {
    let div = document.querySelector(".subBreeds");
    div.innerHTML = "";
    let title = document.createElement("h3");
    title.textContent = capitalWords(breed) + ":";
    div.appendChild(title);

    if (arr.length === 0) {
        let p = document.createElement("p");
        p.textContent = "This breed has no sub-breeds.";
        p.className = "noSub";
        div.appendChild(p);

    } else if (arr.length > 0) {

        let ul = document.createElement("ul");
        for (let dog of arr) {
            let li = document.createElement("li");
            li.textContent = capitalWords(dog);
            li.className = "subDog";
            ul.appendChild(li);
            li.addEventListener("click", (e) => {
                let subDog = e.target.innerText.toLowerCase();
                window.location.hash = "";
                window.location.hash = `${breed}-${subDog}`;
                getOneBreed(breed, subDog);
            })
        }
        div.appendChild(ul);
    }
}

function renderPictures(arr) {

    let picDiv = document.querySelector(".start-pics");
    picDiv.innerHTML = "";
    for (let i = 0; i < arr.length; i++) {
        let img = document.createElement("img");
        img.setAttribute("src", arr[i]);
        img.className = "random-img";
        picDiv.appendChild(img);
    }
}

// Help-function to make words with first letter uppercase.
function capitalWords(word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word;

}

function refreshPage() {
    console.log(window.location.hash.length)
    if (window.location.hash.length > 1) {
        let hash = window.location.hash.slice(1).split("-");
        console.log(hash[0], hash[1]);
        getOneBreed(hash[0], hash[1]);
    } else {
        getBreeds();
    }
}

getBreeds();