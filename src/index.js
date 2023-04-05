import axios from "axios";
import Notiflix, { Notify } from 'notiflix';
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

//Your API key: 34821282-c80c361baf29d3d77b8526c1f
// https://pixabay.com/api/
// масив зображень, що задовольнили критерії параметрів запиту. Кожне зображення описується об'єктом, з якого тобі цікаві тільки наступні властивості:

// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
const BASE_URL = 'https://pixabay.com/api/?key=34821282-c80c361baf29d3d77b8526c1f';
const totalNumberPicturesOfPage = 40;
const refs = {
  formEll: document.querySelector(".search-form"),
  inputEll: document.querySelector(".js_form_input"),
  btnSubmitEll: document.querySelector('.js_btn_submit'),
  containerGalleryEll: document.querySelector(".gallery"),
  buttonEll: document.querySelector(".load-more"),
};
refs.buttonEll.classList.add("btn_hidden");
console.log(refs.formEll);
console.log(refs.inputEll);
console.log(refs.btnSubmitEll);
console.log(refs.containerGalleryEll);
console.log(refs.buttonEll);
let page = 1;
const fetchAPI = () =>
  axios.get(`${BASE_URL}&q=${refs.inputEll.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${totalNumberPicturesOfPage}&page=${page}`)
//===================2===============
// const fetchAPI = () =>
//   fetch(`${BASE_URL}&q=${refs.inputEll.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${totalNumberPicturesOfPage}&page=${page}`)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(response.status)
//       }
//       return  response.json()
//     })
//================1=====================
// function fetchAPI() {
//   return fetch(`${BASE_URL}&q=${refs.inputEll.value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${totalNumberPicturesOfPage}&page=${page}`)
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(response.status)
//       }
//       return  response.json()
//     }
//     )
// }

//++++++++++++++++++++++++++++++++++++++++++++++++++++
function handleLoadCard()
{
  fetchAPI().then(({ data }) => {
    console.log(' data', data);
    console.log('data.hits----',data.hits);
    console.log(data.totalHits);
    if (data.totalHits > 1 && page === 1) {
       Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    if (data.totalHits === 0 ) {
     refs.buttonEll.classList.add("btn_hidden");
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      return console.log(' фото незнайдено');

    } else {
     
      if (data.hits.length < totalNumberPicturesOfPage) {
        refs.buttonEll.classList.add("btn_hidden");
        Notify.info(`We're sorry, but you've reached the end of search results.`);
        console.log(' останні фото');
     }
      
    }      
    return allCollection(data.hits) 
       
     })
    .then(() => { return page += 1 })
     .catch((error) => console.log(error));
}

 function submitInfo(event) {
   event.preventDefault();
 
  refs.containerGalleryEll.innerHTML=""; 
   console.log('   input ---    ',refs.inputEll.value.trim());
   page = 1;
 
   if (refs.inputEll.value.trim() === "") {
      // refs.buttonEll.classList.add("btn_hidden");
      Notify.failure("Sorry. Please try again.");
     return
   }
  refs.buttonEll.classList.remove("btn_hidden");
   handleLoadCard()

}
function inputBtn(event) {
  
   handleLoadCard()
}

function markup({ largeImageURL, webformatURL, tags, likes, views, comments, downloads })
{
  const card = `
  <a href="${largeImageURL}" class="photo-card" >
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views:  ${views} </b>
    </p>
    <p class="info-item">
      <b>Comments:  ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads:  ${downloads}</b>
    </p>
  </div>
</a>
`
 refs.containerGalleryEll.insertAdjacentHTML("beforeend", card); 
}

function allCollection(newCollection) {
  newCollection.forEach((element) => {
    markup(element);
    
  });
  lightbox.refresh();
}
 
     function onClick(event) {
    event.preventDefault();
    if (event.target.nodeName !== 'IMG') {
        return
    }
    
}

refs.formEll.addEventListener("submit", submitInfo);
 const lightbox = new SimpleLightbox('.gallery a');
   
refs.buttonEll.addEventListener("click", inputBtn);
refs.containerGalleryEll.addEventListener('click', onClick);