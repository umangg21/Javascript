let allResults = []
let FavList = []



function getElement(selector) {
    return document.querySelector(selector)
}

function createElement(tag, className) {
    let element = document.createElement(tag)
    if (className) element.classList.add(className)
    return element
}

function debounce(fun, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(fun, delay);
    }
}


const mainList = getElement("#hotelList")
const searchBox = getElement("#searchBox")
const sortDropdown = getElement("#sortDropdown")
const filterDropdown = getElement("#filterDropdown")
const notification = getElement("#notification")


function getHotelsFromApi() {
    return fetch('hotels.json').then((data) => data.json())
}

function getHotelCard(hotel) {
    const isFav = FavList.indexOf(hotel.id) > -1

    let ButtonText = "Set Fav"
    let ButtonClass = ""
    if (isFav) {
        ButtonText = "Favourite"
        ButtonClass = "yellow"
    }
    return `
    <li id="${hotel.id}" class="listItem">
        <div>
            <img src="${hotel.img}"></img>
            <h2>${hotel.name}</h2>
            <span>${hotel.location}</span>
            <p>${hotel.tags}<p>
            <span>${hotel.rating}</span> <span>${hotel.eta} mins</span> <button>View Menu</button>
            <br/>
            <button id="fav${hotel.id}" onclick="setFav(${hotel.id})" class="${ButtonClass}">${ButtonText}</button>
        </div>
    </li>
    `
}


function generateView(hotels = []) {
    while (mainList.firstChild) mainList.removeChild(mainList.firstChild)

    const html = hotels.map((hotel) => getHotelCard(hotel)).join('')
    mainList.innerHTML = html
}

function generateFilters(hotels = []) {
    let allFilters = [...new Set(hotels.map((hotel) => hotel.tags).flat())]
    allFilters.forEach(filter => {
        let li = this.createElement('option')
        li.value = filter
        li.innerText = filter
        filterDropdown.append(li)
    })
}

function getHotels() {
    getHotelsFromApi()
        .then((res) => {
            allResults = res
            generateView(res)
            notification.innerText = ""
            generateFilters(res)
        })
        .catch((err) => {
            notification.innerText = "Something went wrong"
        })
}

getHotels()


function getFilteredResult() {
    query = searchBox.value
    let filteredHotels = [...allResults]
    if (query) {
        const reg = new RegExp(query, 'i')
        filteredHotels = filteredHotels.filter((item) => {
            return reg.test(item.name) || reg.test(item.location) || item.tags.find((tag) => reg.test(tag.toLowerCase()))
        })
    }

    sortItem = sortDropdown.value
    if (sortItem) {
        filteredHotels = filteredHotels.sort((a, b) => {
            if (sortItem === "ETA") {
                return a.eta > b.eta ? 1 : -1
            }
            if (sortItem === "Rating") {
                return a.rating > b.rating ? -1 : 1
            }
        })
    }

    fiterItem = filterDropdown.value
    if (fiterItem) {
        filteredHotels = filteredHotels.filter((item) => {
            return item.tags.indexOf(fiterItem) > -1
        })
    }

    generateView(filteredHotels)
}

const search = debounce(getFilteredResult, 300);

function getFavList() {
    FavList = JSON.parse(localStorage.getItem("FavList")) || []
}
getFavList()

function setFavList() {
    localStorage.setItem("FavList", JSON.stringify(FavList))
}

function setFav(id) {
    let index = FavList.indexOf(id)
    let element = getElement("#fav" + id)
    if (index > -1) {
        FavList.splice(index, 1)
        element.classList.remove("yellow")
    } else {
        FavList.push(id)
        element.classList.add("yellow")
    }
    setFavList()
}