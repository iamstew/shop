var cart = [];

function cartToggle(){
	if (document.querySelector('.cart').classList.contains('active')) {
		document.querySelector('.cart').classList.remove('active');
		setTimeout(function(){document.querySelector('.cart').style.display = 'none'}, 500);
	}else{
		document.querySelector('.cart').style.display = 'flex';
		setTimeout(function(){document.querySelector('.cart').classList.add('active')},10);
	}
};

window.addEventListener('scroll', function(){
	if (window.scrollY >= document.querySelector('.library__image').offsetHeight){
		document.querySelector('.scrollTop').style.display = 'block';
	}else{
		document.querySelector('.scrollTop').style.display = 'none';
	}
});

document.querySelector('.scrollTop').onclick = () => {
	window.scrollTo(pageYOffset, 0);
};

document.onclick = event => {
	if (event.target.classList.contains('add-in-cart')){
		console.log(event.target.closest(''))
	}
};