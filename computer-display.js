
class ComputerDisplay {

	constructor(settings) {
		this.selector = settings.selector;
		this.speed = settings.speed || 10;
		this.mode = settings.mode || 'letters'; // words
		this.onPlayStart = settings.onPlayStart || function () { };
		this.onPlayComplete = settings.onPlayComplete || function () { };
		this.onRewindStart = settings.onRewindStart || function () { };
		this.onRewindComplete = settings.onRewindComplete || function () { };

		this.container = document.querySelector(this.selector);

		switch (this.mode) {
			case 'letters':
				this.splitInSpan();
				break;

			case 'words':
				this.splitInWords();
				break;

			default:
				this.splitInWords();
				break;
		}

		this.spans = document.querySelectorAll(this.selector + ' span');
		this.hideSpans();
		this.timers = [];
		this.visibleSpans = 0;
		this.isPlay = false;
		this.isRewind = false;
		return this;
	}

	hideSpans() {
		this.spans.forEach(function (span) {
			// span.style.display = 'none';
			span.style.opacity = '0';
		});
	}

	play() {

		if (this.isPlay) {
			return;
		}

		this.onPlayStart();

		this.isPlay = true;
		this.isRewind = false;
		this.clearTimers();
		let i = this.visibleSpans;

		this.timers.push(setInterval(() => {

			if (this.spans[i] !== undefined) {
				// this.spans[i].style.display = 'inline';
				this.spans[i].style.opacity = '1';
				this.visibleSpans++;
			}

			if (this.spans[i] == undefined) {
				this.clearTimers();
				this.isPlay = false;
				this.onPlayComplete();
				return;
			}

			i++;
		}, 1000 / this.speed));
	}

	rewind() {
		if (this.isRewind) {
			return;
		}

		this.onRewindStart();

		this.isRewind = true;
		this.isPlay = false;

		this.clearTimers();
		let i = this.visibleSpans - 1;

		this.timers.push(setInterval(() => {

			if (i < 0) {
				this.clearTimers();
				this.isRewind = false;
				this.onRewindComplete();
				return;
			}

			if (this.spans[i] !== undefined) {
				// this.spans[i].style.display = 'none';
				this.spans[i].style.opacity = '0';
				this.visibleSpans--;
			}

			i--;
		}, 1000 / this.speed));
	}

	clearTimers() {
		for (const timer of this.timers) {
			clearInterval(timer);
		}
	}

	splitInWords() {
		const that = this;
		var texte = this.container.textContent;
		var words = texte.split(' ');
		this.container.innerHTML = '';
		words.forEach(function (word, index) {
			var span = document.createElement('span');
			var espace = document.createTextNode(' ');
			that.container.appendChild(espace);
			span.textContent = word;
			span.style.setProperty('--index', 1 + index);
			that.container.appendChild(span);
		});
	}

	splitInSpan() {
		const that = this;
		var texte = this.container.textContent;
		var caracteres = texte.split('');
		var centre = Math.floor(caracteres.length / 2);
		this.container.innerHTML = '';
		caracteres.forEach(function (caractere, index) {

			if (caractere === ' ') {
				var espace = document.createTextNode(' ');
				that.container.appendChild(espace);
			} else {
				var span = document.createElement('span');
				span.textContent = caractere;
				span.style.setProperty('--index', 1 + index);
				that.container.appendChild(span);
			}
		});
	}
}

