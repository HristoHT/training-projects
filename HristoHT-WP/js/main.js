var map, quakes;

function initMap() {
    window.addEventListener('load', (event) => {        
        console.log(document.getElementById('map'));
        var uluru = {lat: -25.344, lng: 131.036};
        map = new google.maps.Map(document.getElementById('map'), {zoom: 1, center: uluru});

        getRequest();

        document.querySelector('#button').onclick = (e) => {
            getRequest(generateFilters());
        }
     });
} 

function addMarker(data){
    const infowindow = new google.maps.InfoWindow({
        content: `
            <div>The place of the earthquake is <b>${data.place}</b></div>
            <div>The magnitude of the earthquake is <b>${data.mag}</b></div>
            <div>The date of the earthquake is <b>${(new Date((new Date()).getTime() - data.tm)).toLocaleDateString()}</b></div>
        `
      });
    
    const marker = new google.maps.Marker({
        position: { 
            lat: Number(data.lat)||0, 
            lng: Number(data.lon)||0
        },
        title: 'Date:' + (new Date((new Date()).getTime() - data.tm)).toLocaleDateString() + ', magnitude: ' + data.mag,
        map: map
    });

    marker.addListener("click", () => {
        infowindow.open(map, marker);
      });    
}

function getRequest(queries = []) {
    fetch(`wp-content/plugins/google-map/get-markers.php?${Object.keys(queries).map(key => `${key}=${queries[key]}`).join('&')}`)
    .then(res => res.json())
    .then(data => {
        // data = data.data;
        console.log(data);
        data.forEach(element => {
            addMarker(element);
        });
    }).catch(e => {
        console.log(e.stack);
    });
}