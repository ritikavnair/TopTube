 function getPopularYouTubeVideos(countryCode){
    $.ajax({
    url: "https://www.googleapis.com/youtube/v3/videos",
    type : 'GET',            
    dataType: "json",
    data : {"key" : "AIzaSyAyjGM-DInP9eNDk0G_Y9vYcY7PkeY8j3c","part" : "snippet,contentDetails,player", "origin" : "https://"  ,"chart": "mostPopular", "regionCode": countryCode},
    success : function(data, textStatus, jqXHR ){
        console.log(data);
        console.log(textStatus);
        showVideoList(data);
    }
})
.done(function(){console.log("Done.");})
.fail(function(){console.log("Failed.");})
.always(function(){console.log("Completed.");});

}

function showVideoList(data){
    
    var videoDivStart = "<div class='embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' width='560' height='315' src='https://www.youtube.com/embed/";
    var videoDivEnd = "?rel=0'frameborder='0' allowfullscreen></iframe></div>";
        
    $("#videolist").empty();
    for(var i = 0; i< data.items.length; i++){
        var htmlVideo = data.items[i].player.embedHtml;
        var videoId = data.items[i].id;
        //console.log(i +" "+videoId );
        var videoBlock = "<li>"+videoDivStart+videoId+videoDivEnd+"</li><br>";
        //console.log(videoBlock );
        $("#videolist").append(videoBlock);
    }       

}        

function initMap() {
// var uluru = {lat: -25.363, lng: 131.044};
var uluru =new google.maps.LatLng(10,0);
var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center:uluru,
    gestureHandling : "cooperative",
    keyboardShortcuts : false,
    draggable : true
});              


map.addListener("click", function(e){
    var clickedLatLang = e.latLng;
    var marker =new google.maps.Marker();
    marker.setPosition(clickedLatLang);
    //marker = new google.maps.Marker({
        //  position: clickedLatLang,
        // map: map
        //});
    var geoCoder = new google.maps.Geocoder;
    
    reverseGeoCode(map,geoCoder,clickedLatLang,marker);
    });


}

// Reverse geocoding
function reverseGeoCode(map,geoCoder,clickedLatLang,marker){
    geoCoder.geocode({'location':clickedLatLang}, function(result,status){
        if(status == 'OK'){
            if(result[0]){
                var countryCode ="Undefined.";
                var countryName ="Undefined.";
                // Extract country code
                for(var i=0; i<result[0].address_components.length; i++){
                    if(result[0].address_components[i].types[0] == "country"){
                        countryCode = result[0].address_components[i].short_name;
                        countryName = result[0].address_components[i].long_name;

                    }
                }


                console.log("Country: "+ countryCode);
                var infoWindow = new google.maps.InfoWindow({position : clickedLatLang,
                content : countryName});
                //infoWindow.setContent(result[0].formatted_address);
                infoWindow.open(map, marker);
                getPopularYouTubeVideos(countryCode);
            }
            else{
                window.alert('No result found');
            }
            
        }
        else{
            window.alert('Bad location. Error : '+ status );
        }
    });

}
