import currencies from './currencies.js'

export default () => {
	
	const convertionInSlpElement = document.querySelector('input[name="slp_price"]');
	const convertionInLocalElement = document.querySelector('input[name="local_price"]');
	const convertionInUsdElement = document.querySelector('input[name="usd_price"]');
	const optionsConvertionElement = document.querySelector('#optionsConvertion');

	document.onreadystatechange = function (){
		if (document.readyState === "complete") {
	    calculateOptionsWidth();
	  }
	}

	const Slp = 'SLP';
	const Usd = 'USD';
	const Local = 'LOCAL';

	let slpPrice = 0;
	let localPrice = 0;
	let usdConversions = {};

	optionsConvertionElement.addEventListener('change', e => {
		const price = usdConversions[e.target.value];
		document.querySelector('.custom-select__trigger > span').innerText = e.target.value.toUpperCase();
		updateCurrency({ price });
	});

	convertionInSlpElement.addEventListener('input', e => updateValue(Slp, e.target.value));
	convertionInLocalElement.addEventListener('input', e => updateValue(Ves, e.target.value));
	convertionInUsdElement.addEventListener('input', e => updateValue(Usd, e.target.value));

	convertionInSlpElement.addEventListener('blur', e => resetValues(e));
	convertionInLocalElement.addEventListener('blur', e => resetValues(e));
	convertionInUsdElement.addEventListener('blur', e => resetValues(e));

	Object.keys(currencies).forEach(key => {
		const optionElement = document.createElement('div');
		optionElement.classList.add('custom-option');
		if(key === 'ves'){
			optionElement.classList.add('selected');
			document.querySelector('.custom-select__trigger span').textContent = key.toUpperCase();
		}

		const flagElement = document.createElement('img');
		flagElement.classList.add('custom-option__flag');
		flagElement.src = `static/${key}.png`;

		const spanElement = document.createElement('span');
		spanElement.textContent = currencies[key];

		optionElement.dataset.value = key;
		
		optionElement.append(flagElement);
		optionElement.append(spanElement);
		optionsConvertionElement.append(optionElement);
	});

	document.querySelector('.custom-select__trigger').addEventListener('click', function() {
		this.querySelector('.arrow').classList.toggle('arrow--open');
	  optionsConvertionElement.classList.toggle('open');
	});

	for (const option of document.querySelectorAll(".custom-option")) {
	  option.addEventListener('click', function(e) {
      if (!this.classList.contains('selected')) {
        this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
        this.classList.add('selected');
        console.log(this);
        document.querySelector('.custom-select__trigger > span').textContent = this.dataset.value.toUpperCase();
        hideOptions();
      	const price = usdConversions[e.target.dataset.value];
				updateCurrency({ price });
      }
	  })
	}

	window.addEventListener('click', function(e) {
    const select = document.querySelector('.custom-select');
    if (!select.contains(e.target) && optionsConvertionElement.classList.contains('open')) {
    	hideOptions();
    }
	});

	const optionElement = document.createElement('div');
	optionElement.dataset.value = 'none';
	optionElement.innerHTML = '<div style="background: #f44336;">Iconos diseñados por <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.es/" title="Flaticon">www.flaticon.es</a></div>';
	optionsConvertionElement.append(optionElement);


	const getSlpPrice = async newValue => {
		const url = 'https://api.coingecko.com/api/v3/simple/price?ids=smooth-love-potion&vs_currencies=usd';
		try{
			const res = await fetch(url);
			const data = await res.json();
			slpPrice = data["smooth-love-potion"].usd;
			convertionInSlpElement.value = 1;
			updateValue(Slp, convertionInSlpElement.value);
			checkData();
		} catch (e){
			console.log(e);
		}
	}
	const getConversions = async newValue => {
		const url = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.min.json';
		try{
			const res = await fetch(url);
			const data = await res.json();
			usdConversions = data.usd;
			updateCurrency({ price: data.usd.ves });
			checkData();
		} catch (e){
			console.log(e);
		}
	}

	const updateValue = (currency, value) => {

		const parsedValue = value === '' ? 1 : parseFloat(value);

		if(currency === Slp){
			convertionInLocalElement.value =  (parsedValue * slpPrice * localPrice).toFixed(2);
			convertionInUsdElement.value = (parsedValue * slpPrice).toFixed(2);

		} else if(currency === Local){
			convertionInSlpElement.value = (parsedValue / (slpPrice * localPrice)).toFixed(2);
			convertionInUsdElement.value = (parsedValue / localPrice).toFixed(2);

		} else if(currency === Usd){
			 convertionInSlpElement.value = (parsedValue / slpPrice).toFixed(2);
			 convertionInLocalElement.value = (parsedValue * localPrice).toFixed(2);
		}
	}
	const resetValues = e => {
		if (e.target.value === '' || parseFloat(e.target.value) === 0) {
			convertionInSlpElement.value = 1;
			updateValue(Slp, 1);
		};
	}
	const updateCurrency = currency => {
		localPrice = currency.price;
		updateValue(Slp, convertionInSlpElement.value);
		updateValue(Usd, convertionInUsdElement.value);
	}
	const checkData = () => {
		if (slpPrice !== 0 && localPrice !== 0) {
			setTimeout(() => {
				document.querySelector('.card').classList.toggle('animation');
				document.querySelector('.card .card__loader').classList.toggle('card__loader--loading');
				document.querySelector('.arrow').classList.add('arrow--ani');
				setTimeout(() => {
					document.querySelector('.card .card__loader').style.display = 'none';
					console.log('esto tambien');
				}, 500);
			}, 500);
		}
	}
	function calculateOptionsWidth(){
		const width = document.querySelector('.form').clientWidth;
		optionsConvertionElement.style.width = `${width}px`;
	}
	function hideOptions(){
		optionsConvertionElement.classList.remove('open');
		document.querySelector('.arrow--open').classList.remove('arrow--open');
	}

	getSlpPrice();
	getConversions();
	
}