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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
        })
}

function getRandomDoggos() {
    if (window.location.hash.length > 1) {
        url = `/${window.location.hash.slice(1).replace("-", "/")}/images/random/6`;
    } else url = "s/image/random/6";
    axios.get(BASE_URL + url)
        .then((response) => {
            let picArr = response.data.message;
            return picArr;
        })
        .then((picArr) => {
            renderPictures(picArr);
        })
        .catch((error) => {
            console.error(error);
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

        getOneBreed(breed);
    })
    for (let i = 0; i < select.length; i++) {

        let dog = select.options[i].text.toLowerCase();
        if (dog === window.location.hash.slice(1).split("-")[0]) {
            select.options[i].selected = true;
        }
    }

    let subSection = document.querySelector(".subBreeds");
    subSection.innerHTML = "";
    let p = document.createElement("p");
    p.textContent = "If you like a specific dog, click it to browse that breed. Otherwise choose from the list up on the header, `Get new dogs`-button will render other pictures."
    subSection.appendChild(p);

}

function renderSubBreed(arr, breed) {
    let div = document.querySelector(".subBreeds");
    div.innerHTML = "";
    let title = document.createElement("h3");
    title.textContent = titleFormatter(window.location.hash.slice(1));
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
        img.addEventListener("click", () => {
            if (window.location.hash === "") {
                source = img.getAttribute("src");
                window.location.hash = source.split("/")[4];
                refreshPage();
            }
            if (window.location.hash.length > 1) {
                refreshPage();
            }

        })
    }
}

// Help-function to make words with first letter uppercase.
function capitalWords(word) {
    word = word.charAt(0).toUpperCase() + word.slice(1);
    return word;

}
// Help-function for title.
function titleFormatter(title) {
    if (title.includes("-")) {
        let newTitle = title.split("-");
        newTitle[1] = `(${newTitle[1]})`;
        return capitalWords(newTitle.join(" ") + ":");
    } else {
        return capitalWords(title) + ":";
    }
}

function refreshPage() {
    if (window.location.hash.length > 1) {
        let hash = window.location.hash.slice(1).split("-");

        getOneBreed(hash[0], hash[1]);
    } else {
        getBreeds();
    }
}

getBreeds();