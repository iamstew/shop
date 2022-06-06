let filters = {};
const raw = localStorage.getItem('data')
const data = JSON.parse(raw)

// Проверяем локальное хранилище на наличие данных
function checkLocalStorage(){
	if (localStorage.data == null){
		const storage = {
			balance: 10200,
			cart : []
		}
		localStorage.setItem('data', JSON.stringify(storage))
	}
}

// Обновляем локальное хранилище 
function updateLocalStorage(){
	localStorage.setItem('data', JSON.stringify(data))
}

// Обновляем баланс отображающийся на сайте
function updateBalance() {
	$('[data-balance]').text(data.balance);
	updateLocalStorage()
}

// Считаем сумму товаров в корзине
function calcAmount() {
	let amount = data.cart.reduce((acc, product) => acc += product.price * product.quantity, 0);

	$('[data-amount]').text(amount)
}

// Добавлаем фильтр по категориям
function setCategory(id) {
	filters.categoryId = id

	getBooks()
}

// Добавляем сортировку
function setSorted(sort, sort_type) {
	filters[sort] = sort_type

	getBooks()
}

// Не используется. Очистить фильтр и вывести все товары
function clearFilters() {
	filters = {}

	getBooks()
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
				<a href="#" class="dropdown-item" onclick="setCategory(${element.id});">${element.name}</a>
			</li>
			`)
		});
	}).fail(function (req) {
		console.error(req)
	});
}

// Получаем список всех товаров от сервера и выводим на страницу
function getBooks() {
	$('[data-products]').html(`Товары отсутствуют`);
	$.ajax({
		type: 'POST',
		url: 'http://45.8.249.57/bookstore-api/books',
		data: JSON.stringify({filters}),
		processData: false,
		headers: {
			'Content-Type': 'application/json'
		}
	}).done(function(req) {
		$('[data-products]').html('');
		if (req.length === 0) {
			$('[data-products]').html(`Товары отсутствуют`);
			return;
		}
		req.forEach(function(element, idx) {
			$('[data-products]').append(`
			<div class="item" data-product-id="${idx}">
				<div class="img" style="background: url('${element.coverUrl}'); background-size: cover;"></div>
				<h5>${element.name}</h5>
				<span>${element.price} руб.</span>
				<button class="add-in-cart" onclick="addCart('${element.name}', '${element.price}')">В корзину</button>
			</div>
			`)
		})
	}).fail(function (req) {
		console.error(req)
	});
}

// Обновляем содержимое корзины
function updateCart() {
	if (data.cart.length === 0) {
		$('[data-cart]').html('Корзина пуста')
		return
	}
	updateLocalStorage()
	$('[data-cart]').html('');
	data.cart.forEach(product => {
		$('[data-cart]').append(`
		<div class="item-in-cart">
			<h6>${product.name}</h6>
			<span>${product.price*product.quantity} руб.</span>
			<a class="remove-from-cart" onclick="deleteProductToCart('${product.name}')">
				<svg viewBox="0 0 24 24" width="12" height="12">
					<g id="_01_align_center" data-name="01 align center">
						<polygon
							points="24 1.414 22.586 0 12 10.586 1.414 0 0 1.414 10.586 12 0 22.586 1.414 24 12 13.414 22.586 24 24 22.586 13.414 12 24 1.414" />
					</g>
				</svg>
			</a>
			<span class="amount" type="number">Количество: ${product.quantity}</span>
			<button class="btn d-flex align-items-center minus" onclick="amountMinus('${product.name}')">
				<svg width="16" height="10" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
			</button>
			<button class="btn d-flex align-items-center plus" onclick="amountPlus('${product.name}')">
				<svg width="16" height="10" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
			</button>
		</div>
		`)
	})
}

// Добавляем товар в корзину 
function addCart(name, price) {
	if (data.balance < +price) {
		alert('Ошибка. Недостаточно средств')
		return;
	}
	let candidate = data.cart.find((product) => product.name === name);

	if (candidate) {
		candidate.quantity += 1
	} else {
		data.cart.push({
			name, 
			price: +price,
			quantity: 1,
		})
	}

	

	data.balance -= +price

	updateBalance()
	updateCart()
	calcAmount()
}

// Удаляем товар из корзины
function deleteProductToCart(name) {
	let candidate = data.cart.find((product) => product.name === name);

	if (candidate) {
		data.balance += candidate.price * candidate.quantity

		data.cart.splice(data.cart.findIndex(product => product.name === name), 1)

		updateBalance()
		updateCart()
		calcAmount()
		return
	}

	alert('Ошибка. Позиции не существует')
}

// Увеличиваем количество товаров в корзине
function amountPlus(name){
	let candidate = data.cart.find((product) => product.name === name);

	if (data.balance < candidate.price){
		alert('Ошибка. Недостаточно средств')
		return;
	}

	if (candidate){
		candidate.quantity += 1
	
		data.balance -= candidate.price
		
		updateBalance()
		updateCart()
		calcAmount()
		return
	}
}

// Уменьшаем количество товаров в корзине
function amountMinus(name){
	let candidate = data.cart.find((product) => product.name === name);
	
	if (candidate){
		if (candidate.quantity === 1){
			deleteProductToCart(name)
		}else{
			data.balance += candidate.price
			candidate.quantity -= 1
		}
	
		updateBalance()
		updateCart()
		calcAmount()
		return
	}
}

// Покупка товаров
function buyProducts(){
	data.cart = [];
	alert('Покупка прошла успешно');
	
	updateBalance()
	updateCart()
	calcAmount()
	return
}


$(document).ready(function () {
	checkLocalStorage()
	
	updateBalance()
	
	updateCart()
	getCategories()
	getBooks()


	// Поиск книги по наименованию
	$('#search').on('change', function(event) {
		filters.search = $(this).val()

		getBooks()
	})
	
	// Анимации корзины
	$('#cart-toggle').click(function () {
		$('aside.cart').show(300);
		$('#buy-block').animate({opacity:1},700);
	});
	$('#cart-close').click(function () {
		$('aside.cart').hide(300);
		$('#buy-block').animate({opacity:0},100);
	});
});