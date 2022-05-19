const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImgs = 0;
let photosArray = [];

// Unsplash API
const search = 'neon street';
const apiKey = 'EVr_ad8OljKgpFwdciw6VEOYYifKmeYVo5yA08kTPaw';
let initImageLoad = true;
let page = 1;
let count = 3;
let apiUrl = `https://api.unsplash.com/search/photos/?client_id=${apiKey}&per_page=${count}&query=${search}&page=${page}`;

//Check if all images were loaded
function imageLoaded(){
    imagesLoaded++;
    if(imagesLoaded === totalImgs){
        ready = true;
        loader.hidden = true;
    }
}

// Helper Function to Set Attributes on DOm Elements
function setAttribute(element, attributes){
    for (const key in attributes){
        element.setAttribute(key, attributes[key]);
    }
}

// Create Elemets for links and photos, add to DOM
function displayPhotos(){
    imagesLoaded = 0;
    totalImgs = photosArray.length;
    //Run function for each object in photosArray
    photosArray.forEach((photo) => {
        //Create <a> to link to Unspalsh
        const item = document.createElement('a');
        setAttribute(item, {
            href: photo.links.html,
            target: '_blank',
        });

        //create <img> for photo
        const img = document.createElement('img');
        setAttribute(img, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        img.addEventListener('load', imageLoaded);

        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos(){
    try{
        const responce = await fetch(apiUrl);
        resultArray = await responce.json();
        photosArray = resultArray.results
        displayPhotos();
    }catch(error){
        console.log(error)
        //Catch Error Here
    }
}

function updateApiImagePage(){
    //increase image load size to 10 after init load
    if(initImageLoad){
        initImageLoad = false;
        count = 10;
    }
    page++;
    apiUrl = `https://api.unsplash.com/search/photos/?client_id=${apiKey}&per_page=${count}&query=${search}&page=${page}`;

}

// Events
window.addEventListener('scroll', () => {
    if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready){
        updateApiImagePage();
        ready = false;
        console.log(apiUrl);
        getPhotos();
    }
})

//On Load
getPhotos();
