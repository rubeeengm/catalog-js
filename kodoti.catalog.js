class KodotiCatalog {
    constructor(obj) {
	this._data = [];
	this._url = obj.url;
    }

    render() {
	let self = this;

	_getDataSource().then(items => {});

	function _getDataSource() {
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
