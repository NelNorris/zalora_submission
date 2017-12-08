var bag = 0;
var wishlist = 0;
var currentSize = "";
var sizeSystem = "";

function addCart_Add() {
	$(".sel-cart-add-button").children("span").html(".");
	$(".sel-cart-add-button").removeClass("add-to-cart--none");
	$(".sel-cart-add-button").addClass("add-to-cart--adding");
}
function addCart_Finish() {
	$(".sel-cart-add-button").children("span").html("Added to bag");
	$(".sel-cart-add-button").removeClass("add-to-cart--adding");
	$(".sel-cart-add-button").addClass("add-to-cart--finishing");
}
function addCart_Reset() {
	$(".sel-cart-add-button").children("span").html("Add to bag");
	$(".sel-cart-add-button").removeClass("add-to-cart--finishing");
	$(".sel-cart-add-button").addClass("add-to-cart--none");
}

function change_sizeSystem() {
	$("#js-size-list li").css({"display":"none"});
	$("#js-size-list li[data-sizesystem='" + sizeSystem + "'").css({"display":"block"});
}

$(document).ready(function() {
	$("#js-size-system-list .ui-listBox-item").on("click", function() {
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
		sizeSystem = ($("#js-size-system-list li.active").html());
		$(".size_system_selection .catalog-filter-text").html(sizeSystem);
		change_sizeSystem();
	});
	$("#js-size-list .ui-listBox-item").on("click", function() {
		$(this).siblings("li").removeClass("active");
		$(this).addClass("active");
		currentSize = $("#js-size-list li.active").html();
		$(".size_selection .catalog-filter-text").html(currentSize);
	});

	$(".sel-cart-add-button").on("click", function() {
		if ($("#js-size-list li").hasClass("active")) {
			addCart_Add();
			setTimeout(
			  function() 
			  {
			    addCart_Finish();
			  }, 1000);
			setTimeout(
			  function() 
			  {
			    addCart_Reset();
			  }, 3000);
			bag += 1;
			if (bag > 0) {
				$(".icon_header-bag .headCount").removeClass("hidden");
				$(".icon_header-bag .headCount").html(bag);
			}
		}
	});
});