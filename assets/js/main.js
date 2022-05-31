$(document).ready(function(){
	$('#cart-toggle').click(function(){
		$('aside.cart').show(500);
	});
	$('#cart-close').click(function(){
		$('aside.cart').hide(300);
	});
});