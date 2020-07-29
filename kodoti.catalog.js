class KodotiShoppingCart {
    constructor(obj){
	this._total = document.querySelector(obj.total);
	this._amount = document.querySelector(obj.amount);
	this._culture = obj.culture;
	this._data = [];
	this._key = 'kodoti-shopping-cart';

	this.render();
    }

    render(){
	this._total.innerText = this._data.length;
	this._amount.innerText = (
	    this._data.reduce((a,b) => {
		if(a.price){
		    return a.price + b.price;
		}

		return a + b.price;
	    }, 0) * this._culture.exchangeRate
	).toLocaleString(
	    this._culture.code
	    , {
		style: 'currency'
		, currency: this._culture.currency
	    }
	);
    }

    _initialize(items){
	let value = localStorage.getItem(this._key);

	if(value){
	    let ids = JSON.parse(value);
	    this._data = items.filter(x => ids.includes(x.id));
	    this.render();
	}
    }

    add(item){
	let self = this;

	if(this._data.some(x => x.id === item.id)){
	    alert("El producto ya ha sido agregado");
	    return;
	}

	this._data.push(item);
	this.render();
	updateLocalStorage();

	function updateLocalStorage(){
	    let value = JSON.stringify(
		self._data.map(x => x.id)
	    );

	    localStorage.setItem(self._key, value);
	}
    }
}

class KodotiCatalog {
    constructor(obj) {
	this._data = [];
	this._url = obj.url;
	this._target = document.querySelector(obj.element);
	this._config = obj.config;
	this._cart = obj.cart;
    }

    render() {
	let self = this;

	_getDataSource().then(items => {

	    let template = [];

	    template.push('<div class="columns is-multiline">');

	    items
		.sort(self._config.sort || ((a,b) => true))
		.forEach(item => template.push(_productTemplate(item)));

	    template.push('</div>');

	    self._target.innerHTML = template.join('');

	    _addCartEvents();
	});

	function _addCartEvents(){
	    let controls = self._target.querySelectorAll('.shopping-cart-add');

	    for(let index = 0; index < controls.length; index++){
		controls[index].addEventListener('click', function(){
		    let id = controls[index].dataset.id;
		    self._cart.add(
			self._data.find(x => x.id == id)
		    );
		});
	    }
	}

	function _productTemplate(item) {
	    let price = (item.price * self._config.culture.exchangeRate)
			    .toLocaleString(
				self._config.culture.code
				, {
				    style: 'currency'
				    , currency: self._config.culture.currency
				}
			    );

	    return `
	    	<div class="column is-one-quarter">
               	    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${item.image}" alt="${item.nombre}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-size-6 is-uppercase">${item.name}</p>
                            <p>${item.description}</p>
                        </div>
                        <footer class="card-footer">
                            <a data-id="${item.id}"  class="card-footer-item shopping-cart-add">Agregar</a>
			    <div class="card-footer-item">${price}</div>
			</footer>
                     </div>
                </div>
	    `;
	}

	function _getDataSource() {
	    self._target.innerHTML = "Cargando ...";

	    if(self._data.length !== 0){
		console.log("Obteniendo de memoria");
		return new Promise((resolve) => resolve(self._data));
	    }

	    console.log("Obteniendo del endpoint");

	    return fetch(self._url)
		    .then(response => {
		    	if(response.ok){
			    return response.json();
			}

			throw 'Ocurrió un error: ' + response.status;
		    }).then(response => {
			self._data = response;
			self._cart._initialize(self._data);

			return self._data;
		    }).catch(error => {
			console.error(error);
		    });
	}
    }
}
