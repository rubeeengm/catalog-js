'use strict';

(function(){
    let config = {
	sort: null
    };

    let catalog = new KodotiCatalog({
    	url: 'catalog.json'
    	, element : '#catalog'
	, config
    });
    
    catalog.render();

    document.querySelector('#filter').addEventListener('change', function(){
	switch(this.options[this.selectedIndex].value) {
	    case 'price-asc':
		config.sort = ((a,b) => a.price - b.price);
	    break;

	    case 'price-desc':
		config.sort = ((a,b) => b.price - a.price);
	    break;
	}
	
	catalog.render();
    });
})();
