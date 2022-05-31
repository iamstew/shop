const filters = {};

function updateBalance(balance) {
	$('[data-balance]').text(balance);
}

// Получаем список всех категорий и выводим на страницу
function getCategories() {
	$.ajax({
		type: 'GET',
		url: 'http://45.8.249.57/bookstore-api/books/categories',
	}).done(function(req) {
		req.forEach(element => {
			$('[data-categories]').append(`
			<li>
				<a href="#" class="dropdown-item p-3" data-category-id="${element.id}">${element.name}</a>
			</li>
			`)
		});
	}).fail(function (req) {
		console.error(req)
	});
}


function getBooks(filters) {
	$('[data-products]').html(`Товары отсутствуют`);
	$.ajax({
		type: 'POST',
		url: 'http://45.8.249.57/bookstore-api/books',
		data: JSON.stringify(filters),
		processData: false,
		headers: {
			'Content-Type': 'application/json'
		}
	}).done(function(req) {
		$('[data-products]').html('');
		req.forEach(function(element) {
			$('[data-products]').append(`
			<div class="item">
				<div class="img" style="background: url('${'http://45.8.249.57' + element.coverUrl}'); background-size: cover;"></div>
				<h5>${element.name}</h5>
				<span>${element.price} руб.</span>
				<button class="add-in-cart">В корзину</button>
			</div>
			`)
		})
	}).fail(function (req) {
		console.error(req)
	});
}


$(document).ready(function () {
	let balance = 10200;
	updateBalance(balance)
	
	getCategories()
	getBooks(filters)
	
	$('.dropdown-item').click(function(){	
		console.log($('.dropdown-item').attr('data-category-id'));

	});
	$('#cart-toggle').click(function () {
		$('aside.cart').show(500);
	});
	$('#cart-close').click(function () {
		$('aside.cart').hide(300);
	});
});