(function (root) {
	var doc = root.document,
		map_element = doc.getElementById('map'),
		input = doc.getElementById('pac-input'),
		first_change = false,
		searchBox = new google.maps.places.SearchBox(input),
		map,
		initialize = function () {
			var markers = [];

			map = new google.maps.Map(map_element, {
					mapTypeId: google.maps.MapTypeId.SATELLITE
				});

			google.maps.event.addListener(searchBox, 'places_changed', function () {
				var places = searchBox.getPlaces(),
					bounds = new google.maps.LatLngBounds(),
					marker,
					place,
					image,
					i;

				if (!first_change) {
					first_change = true;
					input.style.left = '87px';
					input.style.top = '2px';
					$('#overlay, #welcome').fadeOut();
					$('#more-controls').fadeIn();
				}

				for (i = 0, marker; marker = markers[i]; i++)
					marker.setMap(null);

				markers = [];
				for (i = 0; place = places[i]; i++) {
					bounds.extend(place.geometry.location);
				}

				map.fitBounds(bounds);
			});

			google.maps.event.addListener(map, 'bounds_changed', function() {
				searchBox.setBounds(map.getBounds());
			});

			var parsed_kml = [],
				myParser = new geoXML3.parser({
					suppressInfoWindows: true,
					map: map,
					afterParse : function(doc){
						parsed_kml = doc;
					}
				});

			// myParser.parse('kmls/landshit.kml'); //accepts kml file or array of kml files
			// myParser.parse('kmls/output.kml'); //accepts kml file or array of kml files
			// myParser.parse('kmls/doc.kml'); //accepts kml file or array of kml files
			// myParser.parse('kmls/nationwide-li.kml'); //accepts kml file or array of kml files


			myParser.parse('kmls/laguna.xml'); //accepts kml file or array of kml files
		};

	google.maps.event.addDomListener(window, 'load', initialize);

	root.onresize = function () {
		map_element.style.height = root.innerHeight + 'px';
		map_element.style.width = root.innerWidth + 'px';
		doc.getElementById('canvas').setAttribute('height', root.innerHeight + 'px');
		doc.getElementById('canvas').setAttribute('width', root.innerWidth + 'px');
		doc.getElementById('canvas').style.height = root.innerHeight + 'px !important';
		doc.getElementById('canvas').style.width = root.innerWidth + 'px !important';
		console.log('asdfasdfasdf');
		if (!first_change) {
			input.style.left = (root.innerWidth - 400) / 2 + 'px';
			input.style.top = (root.innerHeight - 32) / 2 + 'px';
			input.style.display = 'inline';
			input.focus();
		}
	};

	doc.getElementById('print_button').addEventListener('click', function (e) {
		window.print();
	});

	doc.getElementById('draw_button').addEventListener('click', function (e) {
		var elem = e.target;
		if (elem.className === 'on') {
			elem.className = '';
			doc.getElementById('canvas').style.opacity = '0.3';
			doc.getElementById('canvas').style.pointerEvents = 'none';
		}
		else {
			elem.className = 'on';
			doc.getElementById('canvas').style.opacity = '1';
			doc.getElementById('canvas').style.pointerEvents = 'auto';
			$('#canvas').sketch({defaultColor: "#f00"});
		}
	});

	doc.getElementById('clear_button').addEventListener('click', function (e) {
		var ctx = doc.getElementById('canvas').getContext('2d');
		$('#canvas').sketch('actions', []);
		ctx.clearRect(0, 0, doc.getElementById('canvas').width, doc.getElementById('canvas').height);
	});

	root.onresize();

	setTimeout(function () {
		$('#overlay').animate({opacity : 0.9});
	}, 1000);

} (this));
