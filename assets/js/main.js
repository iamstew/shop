var cart = [];
let cost = 0;

//анимация коризны
function cartToggle(){
	if (document.querySelector('.cart').classList.contains('active')) {
		document.querySelector('.cart').classList.remove('active');
		setTimeout(function(){document.querySelector('.cart').style.display = 'none'}, 500);
	}else{
		document.querySelector('.cart').style.display = 'flex';
		setTimeout(function(){document.querySelector('.cart').classList.add('active')},10);
	}
};

//обновление корзины
function updateCart(){
	let cart_main = document.querySelector('[data-cart]')

	if (cart.length === 0){
		cart_main.innerHTML = 'Корзина пуста'
		cart_main.style.padding = '20px 0'
		cart_main.style.fontStyle = 'italic'
		return
	}
	
	cart_main.innerHTML = ''
	cart_main.style.padding = '0'
	cart_main.style.fontStyle = 'normal'
	cart.forEach((book) => {
		cart_main.insertAdjacentHTML('beforeend',`
			<div class="book__cart">
				<div class="cart__data">
					<img class="cart__image" src="${book.image}" alt >
					<div class="book__title">
						<span>
							<h3 itemprop="name">${book.name}</h3>
							<p itemprop="description" class="book__description">${book.descrip}</p>
						</span>
						<span class="amount-cost">
							<span class="book__cost">${book.price}</span>
							<span>
								<button class="amount__minus" onclick="minusCost(${book.id})">
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
										<path fill="#fff" d="M0 10h24v4h-24z"/>
									</svg>
								</button>
								<span class="amount__in__cart" data-id="${book.id}">${book.amount}</span>
								<button class="amount__plus" onclick="plusCost(${book.id})">
									<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
										<path fill="#fff" d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
									</svg>
								</button>
							</span>
						</span>
					</div>
				</div>
				<a class="delete__from__cart" onclick="deleteFromCart(${book.id})">
					<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
						<path fill="#232324" d="M19 24h-14c-1.104 0-2-.896-2-2v-16h18v16c0 1.104-.896 2-2 2m-9-14c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6 0c0-.552-.448-1-1-1s-1 .448-1 1v9c0 .552.448 1 1 1s1-.448 1-1v-9zm6-5h-20v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2zm-12-2h4v-1h-4v1z"/>
					</svg>
				</a>
			</div>
		`)
	})
};

//добавление книги в корзину
function addInCart(id, name, descrip, price, image){
	let item = cart.find((book) => book.id === id)

	if (item){
		item.amount++
	}else{
		cart.push({
			id,
			name: name,
			descrip: descrip,
			price: +price,
			image:image,
			amount: 1,
		})
	}
	console.log(cart)

	updateCart()
	updateAllCost()
}

//удаление из корзины
function deleteFromCart(id){
	cart.splice(cart.findIndex((book) => book.id == id), 1);

	updateCart()
	updateAllCost()
}

//сумма корзины
function updateAllCost(){
	let cost = cart.reduce((acc, product) => acc += product.price * product.amount, 0);
	let items = cart.reduce((acc, product) => acc += product.amount, 0);

	document.querySelector('[data-cost]').innerText = cost;
	document.querySelector('.items-in-cart'). innerText = items;
}

//увеличение товаров в корзине
function plusCost(id){
	cart.find((book) => book.id == id).amount++

	updateCart()
	updateAllCost()
}

//уменьшение товаров в корзине
function minusCost(id){
	cart.find((book) => book.id == id).amount--

	if (cart.find((book) => book.id == id).amount === 0){
		deleteFromCart(id)
	}else{
		updateCart()
		updateAllCost()
	}
}

//скролл функция
window.addEventListener('scroll', function(){
	if (window.scrollY >= document.querySelector('.library__image').offsetHeight){
		document.querySelector('.scrollTop').style.display = 'block';
	}else{
		document.querySelector('.scrollTop').style.display = 'none';
	}
});

//кнопка скролла
document.querySelector('.scrollTop').onclick = () => {
	window.scrollTo(pageYOffset, 0);
};

//отслеживание клика для добавления в корзину
document.onclick = event => {
	if (event.target.classList.contains('add-in-cart')){
		let name = document.querySelector(".card__name[data-id='"+event.target.dataset.id+"']").innerText;
		let descrip = document.querySelector(".description[data-id='"+event.target.dataset.id+"']").innerText;
		let price = document.querySelector(".book__cost[data-id='"+event.target.dataset.id+"']").innerHTML;
		let image = document.querySelector(".card__book[data-id='"+event.target.dataset.id+"']").src;
		addInCart(event.target.dataset.id,name, descrip, price, image);
	}
};

document.querySelector('.buy__books').onclick = () => {
	if (cart.length != 0){
		alert('Покупка прошла успешно!')
		cart = []

		updateCart()
		updateAllCost()
	}
}

updateCart()
updateAllCost()