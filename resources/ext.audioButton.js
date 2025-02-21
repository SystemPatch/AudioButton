( function () {
	function deactivate( button ) {
		var audio = button.previousElementSibling;
		button.dataset.state = 'error';
		button.title = mw.message( 'audiobutton-error-not-supported' ).text();
		var src = audio.firstElementChild.src;
		if (src.startsWith(window.location.origin)) {
			button.href = src;
		} else {
			console.warn('Blocked potentially unsafe audio source');
		}
		audio.remove();
	}

	function updateButtonState( event ) {
		var audio = event.currentTarget,
			button = audio.nextElementSibling;
		if ( audio.paused || audio.ended ) {
			button.dataset.state = 'play';
		} else {
			button.dataset.state = 'pause';
		}
	}

	function playPause( event ) {
		event.preventDefault();
		event.stopPropagation();
		var audio = event.currentTarget.previousElementSibling;
		if ( audio.paused || audio.ended ) {
			audio.play().catch((err) => {
				console.error('Audio play failed:', err);
			});
		} else {
			audio.pause();
		}
	}

	$( function () {
		Array.prototype.forEach.call( document.querySelectorAll( 'a.ext-audiobutton' ), function ( button ) {
			var audio = button.previousElementSibling;
			button.textContent = '';
			if ( button.dataset.state === 'error' ) {
				return;
			} else if ( audio.canPlayType( audio.firstElementChild.type ) ) {
				button.addEventListener( 'click', playPause );
			} else {
				deactivate( button );
			}
		} );

		Array.prototype.forEach.call( document.querySelectorAll( 'audio.ext-audiobutton' ), function ( audio ) {
			var volume = parseFloat(audio.dataset.volume);
			audio.volume = (isNaN(volume) || volume < 0 || volume > 1) ? 1 : volume;
			audio.addEventListener( 'play', updateButtonState );
			audio.addEventListener( 'pause', updateButtonState );
			audio.addEventListener( 'ended', updateButtonState );
		} );
	}() );
}() );
