var x = 0;
let cart_open = document.querySelector('.shopping-bag');
let cart_body = document.querySelector('.cart');
let cart_close = document.querySelector('.cart__close');

cart_close.addEventListener('click', function(){
	cart_body.classList.remove('active');
	document.querySelector('.main__wrapper').style.display = 'block'
	setTimeout(function(){cart_body.style.display = 'none'}, 500);
});

cart_open.addEventListener('click', function(){
	cart_body.style.display = 'flex';
	document.querySelector('.main__wrapper').style.display = 'none'
	setTimeout(function(){cart_body.classList.add('active')},10);
});

window.addEventListener('scroll', function(){
	console.log(document.querySelector('.main__wrapper .title__block').getBoundingClientRect())
	if (window.scrollY >= document.querySelector('.library__image').offsetHeight){
		document.querySelector('header').style.background = '#232324';
		document.querySelector('.scrollTop').style.display = 'block';
	}else{
		document.querySelector('header').style.background = 'initial';
		document.querySelector('.scrollTop').style.display = 'none';
	}
})

document.querySelector('.scrollTop').onclick = () => {
	window.scrollTo(pageYOffset, 0);
}