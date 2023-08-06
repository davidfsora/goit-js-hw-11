// import { getData } from "./data";
import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const api_key = "live_bhJOs1wV8iLJ1xYobAYWPqV9wHT0wjvd1E4zAjM72wpSRwYLxRA6qBRKcLBfvysR";

axios.defaults.headers.common["x-api-key"] = api_key;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Allow"] = "OPTIONS, POST, GET";
axios.defaults.headers.common["Accept"] = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] = "GET, POST, HEAD";
axios.defaults.headers.common["Access-Control-Expose-Headers"] = "X-RateLimit-Limit,X-RateLimit-Remaining,X-RateLimit-Reset";

const PIXABAY_KEY = '38599637-94ee16ac1abf8bf26f0455f90';

document.querySelector("article").remove();
document.querySelector("html").lang = "en";
document.querySelector("title").textContent = "Image search";
let lightbox;
let searchData;
let body = document.querySelector("body");
let header = document.createElement("header");
let form = document.createElement("form");
form.id = "search-form";
form.classList.add("search-form");
let inputForm = document.createElement("input");
inputForm.type = "text";
inputForm.name = "searchQuery";
inputForm.autocomplete = "off";
inputForm.placeholder = "Search images...";
inputForm.required = 'true';
inputForm.classList.add("input-form");
let submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="15px" width="15px" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>';
submitButton.classList.add("submit-button");
let gallery = document.createElement("ul");
gallery.classList.add("gallery");

body.appendChild(header);
header.appendChild(form);
form.appendChild(inputForm);
form.appendChild(submitButton);
body.appendChild(gallery);
let loaderContainer = document.createElement("div");
loaderContainer.classList.add("loader-container");
let loader = document.createElement("div");
loader.classList.add("loader");
let divLoader1 = document.createElement("div");
let divLoader2 = document.createElement("div");
let divLoader3 = document.createElement("div");

body.appendChild(loaderContainer);
loaderContainer.appendChild(loader);
loader.appendChild(divLoader1);
loader.appendChild(divLoader2);
loader.appendChild(divLoader3);

const cssStyles = `
	header {
		display: flex;
		justify-content: center;
		padding: 10px 20px;
		background-image: linear-gradient(rgb(0, 0, 150), rgb(0, 0, 255));
		box-shadow: 0px 3px 20px;
	}

	.input-form {
    height: 30px;
		border: 10px;
		border-radius: 15px;
  }

	.submit-button {
    height: 30px;
		width: 30px;
		border: 10px;
		border-radius: 50%;
		background-color: white;
		transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }

	.submit-button:hover {
		cursor: pointer;
		background-color: rgb(220, 220, 220);
	}

	.gallery {
    display: flex;
		justify-content: center;
    flex-wrap: wrap;
		list-style-type: none;
		padding: 30px 50px;
		gap: 20px;
  }

	.photo-card {
    height: auto;
		width: 300px;
		border: 1px solid #BFBFBF;
		border-radius: 0 0 5px 5px;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
		transition: scale 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }

	.photo-card:hover {
		scale: 1.1;
		box-shadow: 4px 6px 15px 0 #888888;
		cursor: pointer;
	}

	img {
		width: 300px;
		height: auto;
	}

	.info {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 10px;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 10px;
	}

	.info-parameter {
		text-align: center;
	}

	.loader-container {
		display: flex;
		justify-content: center;
	}

	.loader {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    opacity: 0;
	}

	.loader.show {
    opacity: 1;
	}

	.loader div {
    display: inline-block;
    position: absolute;
    left: 8px;
    width: 16px;		
    background: #f4f4f4;
    animation: loader 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
	}

	.loader div:nth-child(1) {
    left: 8px;
    animation-delay: -0.24s;
	}

	.loader div:nth-child(2) {
    left: 32px;
    animation-delay: -0.12s;
	}

	.loader div:nth-child(3) {
    left: 56px;
    animation-delay: 0;
	}

	@keyframes loader {
    0% {
        top: 8px;
        height: 64px;
    }

    50%,
    100% {
        top: 24px;
        height: 32px;
    }
`;

const styleHtmlTag = document.createElement('style');
styleHtmlTag.type = 'text/css';
styleHtmlTag.appendChild(document.createTextNode(cssStyles));
document.head.appendChild(styleHtmlTag);

function newCard(data) {
	let photoCard = document.createElement("li");
	photoCard.classList.add("photo-card");
	let galleryLink = document.createElement('a');
	galleryLink.href = data.largeImageURL;
	let cardImage = document.createElement("img");
	cardImage.src = data.webformatURL;
	cardImage.alt = data.tags;
	cardImage.dataset.source = data.largeImageURL;
	cardImage.loading = "lazy";
	let info = document.createElement("div");
	info.classList.add("info");
	
	gallery.appendChild(photoCard);
	photoCard.appendChild(galleryLink);
	galleryLink.appendChild(cardImage);
	photoCard.appendChild(info);

	let infoParam = document.createElement("div");
	infoParam.classList.add("info-parameter");
	let infoParam2 = document.createElement("div");
	infoParam2.classList.add("info-parameter");
	let infoParam3 = document.createElement("div");
	infoParam3.classList.add("info-parameter");
	let infoParam4 = document.createElement("div");
	infoParam4.classList.add("info-parameter");

	info.appendChild(infoParam);
	info.appendChild(infoParam2);
	info.appendChild(infoParam3);
	info.appendChild(infoParam4);

	let infoItem = document.createElement("p");
	infoItem.classList.add("info-item");
	let firstInfo = document.createElement("b");
	firstInfo.textContent = "Likes";
	let likes = document.createElement("p");
	likes.textContent = data.likes;
	let infoItem2 = document.createElement("p");
	infoItem2.classList.add("info-item");
	let secondInfo = document.createElement("b");
	secondInfo.textContent = "Views";
	let views = document.createElement("p");
	views.textContent = data.views;
	let infoItem3 = document.createElement("p");
	infoItem3.classList.add("info-item");
	let thirdInfo = document.createElement("b");
	thirdInfo.textContent = "Comments";
	let comments = document.createElement("p");
	comments.textContent = data.comments;
	let infoItem4 = document.createElement("p");
	infoItem4.classList.add("info-item");
	let fourthInfo = document.createElement("b");
	fourthInfo.textContent = "Downloads";
	let downloads = document.createElement("p");
	downloads.textContent = data.downloads;

	infoParam.appendChild(infoItem);
	infoParam.appendChild(likes);
	infoParam2.appendChild(infoItem2);
	infoParam2.appendChild(views);
	infoParam3.appendChild(infoItem3);
	infoParam3.appendChild(comments);
	infoParam4.appendChild(infoItem4);
	infoParam4.appendChild(downloads);

	infoItem.appendChild(firstInfo);
	infoItem2.appendChild(secondInfo);
	infoItem3.appendChild(thirdInfo);
	infoItem4.appendChild(fourthInfo);
};

let hideLoader = () => {
	loader.classList.remove('show');
};

let showLoader = () => {
	loader.classList.add('show');
};

let page = 1;
let perPage = 40;
let allData = [];
let lastCard;

let viewer = new IntersectionObserver((inputs) => {
	inputs.forEach(input => {
		if(input.isIntersecting){
			page += 1;
			fetchImages();
		}
	})
}, {
	rootMargin: '0px 0px 200px 0px',
	threshold: 1.0
});

async function fetchImages() {
	searchData = inputForm.value;
	const URL = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${searchData}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`;
	try {
		const response = await axios.get(URL);
		// const response = await getData(page,20);
		let data = response.data;
		if(data.totalHits === 0) {
			Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.");
			return;
		}
		if(page === 1) {
			Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
		}
		allData.push(data);
		for (let i = 0; i < data.hits.length; i++) {
			newCard(data.hits[i]);
		}
		
		const showedCards = document.querySelectorAll(".photo-card");
		
		if(showedCards.length < data.totalHits) {
			if(lastCard){
				viewer.unobserve(lastCard);
			}
			
			lastCard = showedCards[showedCards.length-1];
			viewer.observe(lastCard);
		}
		
		lightbox = new SimpleLightbox('.gallery a');
		lightbox.refresh();

	} catch (error) {
		Notiflix.Notify.failure('An error occurred');
	}
	finally {
		hideLoader();
	}	
};

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	showLoader();
	fetchImages();
});

