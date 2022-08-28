
let track = document.querySelector('.slider')
// let firstLoad = true
let searchTitle = document.querySelector('input').value
const videoPlayer = document.querySelector('.top-main')
let contentArray = []
// const contentArray = Array.from(track.children)
const contentImg = []
const searchBtn = document.querySelector('.search')
const initialLink = 'https://api.themoviedb.org/3/movie/popular?api_key=70220a5ffde49b1cd73aad90c1741b08&language=en-US&page=1'


window.onload = () => {
    fetchData(initialLink)
    // firstLoad = false
}

window.onresize = function () { location.reload() }

searchBtn.addEventListener('click', () => {
    searchTitle = document.querySelector('input').value
    const partnerData = `https://api.themoviedb.org/3/search/movie?api_key=70220a5ffde49b1cd73aad90c1741b08&query=${searchTitle}`


    if (searchTitle.length <= 0) {
        fetchData(initialLink)
    } else if (searchTitle) {
        contentArray = []
        track.replaceChildren(fetchData(partnerData))
        track.removeChild(track.firstChild)
    }

})

function fetchData(link) {
    fetch(link)
        .then(res => res.json()) //parse
        .then(data => {

            console.log(data)


            for (let i = 0; i <= data.results.length - 1; i++) {


                if (data.results[i].poster_path) {
                    const img = document.createElement('img')
                    const div = document.createElement('div')

                    track.appendChild(div)
                    div.appendChild(img)
                    let posterUrl = data.results[i].poster_path

                    img.src = `http://image.tmdb.org/t/p/original${posterUrl}`
                    div.classList.add('video-img')
                    img.classList.add('video-img')

                    contentImg.push(`http://image.tmdb.org/t/p/original${posterUrl}`)
                    contentArray.push(div)
                }

            }

            setFirst(data)

            for (let i = 0; i <= contentArray.length - 1; i++) {
                let backdropPath = data.results[i].backdrop_path


                contentArray[i].addEventListener('click', () => {

                    if (!videoPlayer.classList.contains('fade-in')) {
                        videoPlayer.classList.add('fade-in')

                        setTimeout(() => {
                            videoPlayer.classList.remove('fade-in')
                        }, 600)
                    }

                    //change offer text to repective info on click
                    document.querySelector('.offerText').innerText = data.results[i].original_title

                    //showing overview of clicked movie
                    document.querySelector('.partner-logo-lg').innerText = data.results[i].overview

                    //showing rating
                    document.querySelector('.rating').innerText = data.results[i].vote_average + '/10'

                    //showing release date
                    document.querySelector('.release').innerText = data.results[i].release_date

                    //changing background on click 
                    if(data.results[i].backdrop_path){
                    videoPlayer.style.backgroundImage = `url(http://image.tmdb.org/t/p/original${backdropPath})`
                    }else {
                    videoPlayer.style.backgroundImage = `url(http://image.tmdb.org/t/p/original${data.results[i].poster_path})`
                    }
                    document.querySelector('.deal-btn').href = `https://www.youtube.com/results?search_query=${data.results[i].original_title}`

                })
            }


            // console.log(data.results[0])

        }).then(seila => {

            //slider touch and drag events start

            let slide = track.firstElementChild
            let slideWidth = parseInt(slide.offsetWidth * (contentArray.length - 1))
            let initialPosition = null
            let moving = false
            let transform = 0
            let lastPageX = 0
            const container = document.querySelector('.slider-wrap')

            function gestureStart(e) {
                initialPosition = e.pageX
                moving = true
                const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform')

                if (transformMatrix !== 'none') {
                    transform = parseInt(transformMatrix.split(',')[4].trim())
                }
            }

            const gestureMove = (e) => {
                if (moving) {
                    const currentPosition = e.pageX
                    const difference = currentPosition - initialPosition

                    track.style.transition = 'none'

                    if (e.pageX - lastPageX > 0) {
                        if ((transform + difference) > 0) {
                            return;
                        }
                    }
                    else {
                        if (Math.abs(transform + difference) > slideWidth + 40) {
                            return;
                        }
                    }

                    track.style.transform = `translateX(${transform + difference}px)`
                }

                lastPageX = e.pageX
            }

            const gestureEnd = (e) => {
                const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform')
                moving = false

                track.style.transition = 'transform 250ms ease-in-out'
            }

            const onClick = (e) => {
                let handle
                if (e.target.matches('.arrow')) {
                    handle = e.target
                } else {
                    handle = e.target.closest('.arrow')
                }

                if (handle != null) onHandleClick(handle)
            }

            let slideWatcher = 0

            function onHandleClick(handle) {
                const slider = handle.closest('.bottom-main').querySelector('.slider')
                const childCount = slider.children.length -1
                const sliderIndex = parseInt(getComputedStyle(slider).getPropertyValue('--slider-index'))
                const itemsPerScreen = parseInt(getComputedStyle(slider).getPropertyValue('--items-per-screen'))

                if (handle.classList.contains('left-arrow') && slideWatcher > 0) {
                    slideWatcher--
                    slider.style.setProperty('--slider-index', sliderIndex -1)

                } else if (handle.classList.contains('right-arrow') && slideWatcher < Math.floor(childCount / itemsPerScreen)) {
                    slideWatcher++
                    slider.style.setProperty('--slider-index', sliderIndex + 1)
                console.log(`slider index = ${sliderIndex}`)

                }
            }

            if (window.PointerEvent) {
                container.addEventListener('pointerdown', gestureStart)
                container.addEventListener('pointermove', gestureMove)
                container.addEventListener('pointerup', gestureEnd)

                document.addEventListener('click', onClick)

            } else {
                container.addEventListener('touchstart', gestureStart)
                container.addEventListener('touchmove', gestureMove)
                container.addEventListener('touchend', gestureEnd)
                container.addEventListener('touchleave', gestureEnd)

                container.addEventListener('mousedown', gestureStart)
                container.addEventListener('mousemove', gestureMove)
                container.addEventListener('mouseup', gestureEnd)
                container.addEventListener('mouseleave', gestureEnd)

                document.addEventListener('click', onClick)

            }

        })

}
// .catch(err => {
//     console.log(`error ${err}`)
// })



// //make preference boxes check on click
// const preferenceBoxes = Array.from(document.querySelectorAll('.content-box'))
// const preferences = []
// const savePreference = document.querySelector('.save-preference')
// const popup = document.querySelector('.popup-wrap')
// //turning cookies into an object
// let cookies = document.cookie
//     .split(';')
//     .map((cookie) => cookie.split('='))
//     .reduce((accumulator, [key, value]) =>
//         ({ ...accumulator, [key]: decodeURIComponent(value) }), {})

// preferenceBoxes.forEach(box => {
//     box.addEventListener('click', () => {
//         box.classList.toggle('active')

//         //setting custom checkbox to check onclick
//         if (!box.querySelector('input').checked) {
//             box.querySelector('input').checked = true
//             preferences.push(box.querySelector('input'))
//             console.log(preferences)

//         } else {
//             box.querySelector('input').checked = false
//             preferences.splice(preferences.indexOf(box.querySelector('input')), 1)

//         }

//     })
// })


function setFirst(data) {
    //change offer text to repective info on click
    document.querySelector('.offerText').innerText = data.results[0].original_title

    //showing overview of clicked movie
    document.querySelector('.partner-logo-lg').innerText = data.results[0].overview

    //showing rating
    document.querySelector('.rating').innerText = data.results[0].vote_average + '/10'

    //showing release date
    document.querySelector('.release').innerText = data.results[0].release_date

    //changing background on click 
    let backdropPath = data.results[0].backdrop_path
    videoPlayer.style.backgroundImage = `url(http://image.tmdb.org/t/p/original${backdropPath})`

    document.querySelector('.deal-btn').href = `https://www.youtube.com/results?search_query=${data.results[0].original_title}`

}

// console.log('made it')







// ========================COOKIE STUFF====================


//set cookies for preferences
// savePreference.addEventListener('click', clearCookies)
// savePreference.addEventListener('click', () => {
//     popup.classList.add('hidden')
//     location.reload()
// })
// //resetting cookies and pulling popup if there are no preferences
// window.onload = function () {
//     if (Object.keys(cookies)[0] == false) {
//         // setTimeout(function () {
//         //     popup.classList.remove('hidden')
//         // }, 500)

//         document.cookie = 'preference0=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'
//         document.cookie = 'preference1=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'
//         document.cookie = 'preference2=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'

//     }
// }

// //set new cookies, leave old cookies blank
// function setCookies() {
//     console.log('working')
//     for (let i = 0; i <= preferences.length - 1; i++) {
//         document.cookie = `preference${[i]}=${preferences[i].id}; expires = Fri, Oct 20 4000 00:00:00 GMT;`
//     }
// }

// //clear preference cookies that were previously selected
// function clearCookies() {
//     for (let i = 0; i <= 3; i++) {
//         document.cookie = 'preference0=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'
//         document.cookie = 'preference1=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'
//         document.cookie = 'preference2=;  expires=Fri, Oct 20 4000 00:00:00 GMT;'
//     }

//     //if new preferences are selected, add new cookies
//     if (preferences.length > 0) {
//         setCookies()
//     }
// }

















