'use strict';

(function(){
    let catalog = new KodotiCatalog({
    	url: 'catalog.json'
    	, element : '#catalog'
    });
    
    catalog.render();
})();
