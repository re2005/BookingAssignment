// you can enter your JS here!



(function (){


	////////////////////////////////////////////////////////////
	// PAGE NAVIGATION
	///////////////////////////////////////////////////////////
	
	$(document).on('click', '.one_photo', function(e) {
		e.preventDefault();
		slideShow()
		var index = $( this ).index();
		currentPhoto = index;
		openPhoto(index);
	});

	$(document).on('click', '#next', function(e) {
		e.preventDefault();
		navSlider("next");
	});

	$(document).on('click', '#prev', function(e) {
		e.preventDefault();
		navSlider();
	});

	$(document).on('click', '.close', function(e) {
		e.preventDefault();
		closePhotos()
	});

	$(document).keyup(function(e) {
		if (e.keyCode == 27) { closePhotos() }   // esc
		if (e.keyCode == 39) { navSlider("next"); }   // right
		if (e.keyCode == 37) { navSlider(); }   // left
	}); 





	////////////////////////////////////////////////////////////
	// CREATE SLIDESHOW ELEMENTS and FUNCTIONS
	///////////////////////////////////////////////////////////

	var currentPhoto;
	var totalPhotos;
	createSlider =  function() {
		var  slider = "<div id=photoSlider><div class=wrap/><div class=nav><span class=bar/><span id=prev/><span id=next/><span class=close/>";
		$( 'body' ).prepend(slider);
		var index = $( '.one_photo' ).size();
		totalPhotos = index;
	}
	setTimeout(function(){ createSlider(); }, 100);

	openPhoto = function(index,nav){
		if ( index ) {
			var url = getPhotoData(index).url;
			var alt = getPhotoData(index).alt;
			if ( nav ) {
				$( '#photoSlider h2' ).html(alt);
				$( "#photoSlider .wrap" ).prepend('<img src='+url+'>');
				$( "#photoSlider .wrap img" ).last().fadeOut(200, function() {
					$(this).remove();
				});;
			}
			else {
				$( "#photoSlider .wrap" ).prepend('<img src='+url+'><h2>');
				$( '#photoSlider' ).hide().fadeIn(200, function() {
					$( '#photoSlider .wrap' ).css( "top", "5%" );
					$( '#photoSlider h2' ).html(alt);
					$('.nav').delay(500).css( "top", "5%" );
				});
			}
		}
	}

	closePhotos = function(){
		$( '#photoSlider' ).fadeOut(200, function() {
			$( this ).hide();
			$( '#photoSlider .wrap' ).css( "top", "-100%" ).empty();
			$('.nav').delay(500).css( "top", "-100%" );
			clearTimeout( slideTimer );
		});
	}

	navSlider = function(nav) {
		if (nav == "next") {
			if (currentPhoto == (totalPhotos - 1)) {
				currentPhoto = 0;
				openPhoto(currentPhoto,"true");
			} else {
				currentPhoto = currentPhoto + 1 ;
				openPhoto(currentPhoto,"true");
			}
		}
		else {
			if (currentPhoto == 0) {
				currentPhoto = 13;
				openPhoto(currentPhoto,"true");
			} else {
				currentPhoto = currentPhoto -1 ;
				openPhoto(currentPhoto,"true");
			}           
		}
	}

	getPhotoData = function(index){
		var photos = [];
		$( ".photos ul li a" ).each(function( index ) {
			var url = $(this).attr( 'href' );
			var alt = $(this).children().attr( 'alt' );
			photos.push({'url': url,'alt':alt});
		});
		return photos[index];
	}

	slideShow = function() {
		slideTimer = window.setTimeout(
			function() {
				$( "#next" ).trigger( "click" );
				slideShow();
			}, 3000);
	}



	////////////////////////////////////////////////////////////
	// LOAD DATA and BUILD PAGE
	///////////////////////////////////////////////////////////

	$.ajax({
		dataType: "json",
		url: "js/data.json",
		jsonp: "$callback",
		success: feedPage
	});
	function feedPage( data ) {
		$("#photoTemplate").tmpl(data).appendTo(".photos");
		$("#headerTemplate").tmpl(data).appendTo("header");
		$("#descriptionTemplate").tmpl(data).appendTo(".description");
		$("#facilitiesTemplate").tmpl(data).appendTo("#facilities");
		$("#roomsTemplate").tmpl(data).appendTo("tbody");
		$("#reviewsTemplate").tmpl(data).appendTo(".reviews_list");

		pagination();
	}




	////////////////////////////////////////////////////////////
	// CALCULATE THE TOTAL PRICE
	///////////////////////////////////////////////////////////

	$(document).on('change', '.room_quantity select', function() {
		var cost = $(this).attr('data-price');
		calculateTotal();
	})

	function calculateTotal(){
		var t_sum = 0;
		$( "select" ).each(function( index ) {
			var qnt = $(this).val()
			var price = $(this).attr( 'data-price' );
			var sum = parseFloat(price.replace(',','.')) * parseFloat(qnt);
			t_sum += sum;
			total_sum = t_sum.toFixed(2);
			$("#total_price").text(total_sum);
		});
		$(".rooms h3").addClass("alert_1").delay(1000).queue(function(next){
			$(this).removeClass();
			next();
		});
	}

	function priceOrder(){
		orderRoom = [];
		$( ".one_room" ).each(function() {
			var occupancy = $(this).find(".room_occupancy").text();
			var price = $(this).find("select").attr( 'data-price' );
			orderRoom.push({occupancy,price});

		});

		var test = orderRoom.sort(function(a, b){return a-b});
	}

	var f_sl = 1;
	var f_nm = 1;
	$(document).on('click', '.room_occupancy, .room_price', function(e) {
		e.preventDefault();
		f_nm *= -1;
		var n = $(this).prevAll().length;
		sortTable(f_nm,n);		

	});

	function sortTable(f,n){
		var rows = $('.rooms_table tbody  tr').get();

		rows.sort(function(a, b) {
			var A = $(a).children('td').eq(n).text().toUpperCase();
			var B = $(b).children('td').eq(n).text().toUpperCase();
			if(A < B) {
				return -1*f;
			}
			if(A > B) {
				return 1*f;
			}
			return 0;
		});
		$.each(rows, function(index, row) {
			$('.rooms_table').children('tbody').append(row);
		});
	};




pagination = function(){
	var perPage = 5;
	var total = $(".one_review").size();

	console.log(total);
}














	// Google Maps
	function initialize() {
		var mapCanvas = document.getElementById('map-canvas');
		var mapOptions = {
			center: new google.maps.LatLng(48.8421607,2, -2.3994408,13),
			zoom: 12,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		}
		var map = new google.maps.Map(mapCanvas, mapOptions)
	}
	google.maps.event.addDomListener(window, 'load', initialize);


})();


