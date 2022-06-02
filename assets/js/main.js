let balance = 10200;
let filters = {};
let cart = []

// Обновляем баланс отображающийся на сайте
function updateBalance() {
	$('[data-balance]').text(balance);
}

// Считаем сумму товаров в корзине
function calcAmount() {
	let amount = cart.reduce((acc, product) => acc += product.price * product.quantity, 0);

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
	if (cart.length === 0) {
		$('[data-cart]').html('Корзина пуста')
		return
	}
	$('[data-cart]').html('');
	cart.forEach(product => {
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
			<div class="btn-group">
				<input class="form-control amount" type="number" value="${product.quantity}">
				<button class="btn d-flex align-items-center minus" onclick="amountMinus()">
					<svg width="16" height="10" viewBox="0 0 24 24"><path d="M0 10h24v4h-24z"/></svg>
				</button>
				<button class="btn d-flex align-items-center plus" onclick="amountPlus()">
					<svg width="14" height="10" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/></svg>
				</button>
			</div>
		</div>
		`)
	})
}

// Добавляем товар в корзину 
function addCart(name, price) {
	if (balance < +price) {
		alert('Ошибка. Недостаточно средств')
		return;
	}

	let candidate = cart.find((product) => product.name === name);

	if (candidate) {
		candidate.quantity += 1
	} else {
		cart.push({
			name, 
			price: +price,
			quantity: 1,
		})
	}

	

	balance -= +price

	updateBalance()
	updateCart()
	calcAmount()
}


//Удаляем товар из корзины
function deleteProductToCart(name) {
	let candidate = cart.find((product) => product.name === name);

	if (candidate) {
		balance += candidate.price * candidate.quantity

		cart.splice(cart.findIndex(product => product.name === name), 1)

		updateBalance()
		updateCart()
		calcAmount()
		return
	}

	alert('Ошибка. Позиции не существует')
}



$(document).ready(function () {
	updateBalance();
	
	getCategories();
	getBooks();


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