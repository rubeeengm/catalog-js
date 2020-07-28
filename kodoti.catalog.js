class KodotiCatalog {
    constructor(obj) {
	this._data = [];
	this._url = obj.url;
	this._target = document.querySelector(obj.element);
	this._config = obj.config;
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
	});

	function _productTemplate(item) {
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
                            <p>${item.description}p>
                        </div>
                        <footer class="card-footer">
                            <a class="card-footer-item shopping-cart-add">Agregar</a>
                            <div class="card-footer-item">${item.price}</div>
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
  
			return self._data;
		    }).catch(error => {
			console.error(error);
		    });
	}
    }
}
