$(document).ready(function () {
			
    var objectArray = new Array(); 
    var trackingArray = new Array();
    var resetTime = new Date();

    //Hide the info area by default
    $('#descriptionContainer .inner').hide();
    $('#descriptionContainer .inner').addClass('hideBg');

    //This will take the data from the objectData file and put it into the objectArray for use on the site. It only needs to be read once at load, and never written to.
    $.ajax('objectData.json', 
    {
        dataType: 'json', // type of response data
        timeout: 5000,     // timeout milliseconds
        success: function (data,status,xhr) {   // success callback function
            $.each(data.objects, function(i, item) {
                //push the objects to the objects array
                objectArray.push(item);

                $('#iconContainer').append(
                    '<button class="infoButton" data-info="'+ item.objectUID +'">' +
                        '<div class="icon iconBox">' +
                            '<div><img src="' + item.objectIcon + '"></div>' +
                            '<div><p>' + item.objectName + '</p></div>' +
                        '</div>' +
                    '</button>'
                )

                initClick();

            });
        },
        error: function (jqXhr, textStatus, errorMessage) { // error callback 
            $('p').append('Error: ' + errorMessage);
        }
    });

    //This reads the tracking file and if there's a timestamp written to the Reset Time field, it uses that, and if not, it creates a new one set to the current time.
    //Then it writes all the tracking objects to a local array to be manipulated as users scan items
    $.ajax('foundData.json', 
    {
        dataType: 'json', // type of response data
        timeout: 5000,     // timeout milliseconds
        success: function (data,status,xhr) {   // success callback function
            console.log(data.lastResetTime);
            //push the resetTime (timestamp) into a Date object
            if( data.lastResetTime != "" ) {
                console.log("Date found; set to data's reset time");
                resetTime = data.lastResetTime;
            }else{
                console.log("No date found; setting date to now");
                resetTime = (new Date()).toISOString();
            }
            //push the objects into the tracking array
            $.each(data.objects, function(i, item) {
                trackingArray.push(item);
            });

            //Set up buttons to show proper colours
            setTrackedVisuals();
        },
        error: function (jqXhr, textStatus, errorMessage) { // error callback 
            $('p').append('Error: ' + errorMessage);
        }
    });

    function initClick() {
        $('.infoButton').click( function() {
            var dataUID = parseInt( $(this).attr('data-info') );
            $.each( objectArray, function(i, item) {
                if( item.objectUID == dataUID) {
                    //Always show the icon and object name
                    $('#descIcon').attr( 'src', item.objectIcon);
                    $('#descTitle').text( item.objectName);
                    $('#sceneImage').attr('src', item.objectBackground);
                    //Depending on whether item was marked as found, update the description and tracking status 
                    $.each( trackingArray, function(i, trackingItem) {
                        if( item.objectUID == trackingItem.objectUID) {
                            if( trackingItem.found == true ) {
                                $('#descIcon').addClass( 'foundIcon');
                                $('#descIcon').removeClass( 'unfoundIcon');
                                $('#descFound').addClass( 'foundIcon');
                                $('#descFound').removeClass( 'unfoundIcon');
                                $('#descCheckmark').removeClass('hideBg');
                                $('#descFound').html( '<span class="greenText">Found</span>');
                                $('#descText').text( item.objectDesc);
                                $('#descText').append( '<br><br><span class="greenText">This item has been found ' + trackingItem.foundTimestamps.length + ' times!</span>');
                            }
                            else
                            {
                                $('#descIcon').addClass( 'unfoundIcon');
                                $('#descIcon').removeClass( 'foundIcon');
                                $('#descFound').addClass( 'unfoundIcon');
                                $('#descFound').removeClass( 'foundIcon');
                                $('#descCheckmark').addClass('hideBg');
                                $('#descFound').text( 'Still hidden...');
                                $('#descText').text( item.objectHint);
                                $('#descText').append( '<br><br><span class="greenText">This item has been found ' + trackingItem.foundTimestamps.length + ' times!');
                            }
                        }
                    });
                }     
            });
            //Show the container once all fields are filled
            $('#descriptionContainer .inner').removeClass('hideBg');
            $('#descriptionContainer .inner').show();
        });
    }
    
    function setTrackedVisuals() {
        
        $.each( trackingArray, function(i, trackingItem) {
            $('.infoButton').each(function(i, infoButton) {
                var dataUID = parseInt( $(infoButton).attr('data-info') );
                if( dataUID == trackingItem.objectUID) {
                    if( trackingItem.found == true ) {
                        $(infoButton).addClass( 'foundIcon');
                        $(infoButton).removeClass( 'unfoundIcon');
                    }
                    else
                    {
                        $(infoButton).addClass( 'unfoundIcon');
                        $(infoButton).removeClass( 'foundIcon');
                    }
                }
            });

            //Set the description container to hidden and background image to default
            $('#sceneImage').attr('src', 'img/scene-image.png');
            //Show the container once all fields are filled
            $('#descriptionContainer .inner').addClass('hideBg');
            $('#descriptionContainer .inner').hide();
            
        });
    }

    $('.testButton').click( function() {
        var dataUID = parseInt( $(this).attr('data-info') );
        console.log(dataUID);

        $.each( trackingArray, function(i, trackingItem) {
            if( dataUID == trackingItem.objectUID) {
                trackingItem.found = true;
                trackingItem.foundTimestamps.push( (new Date()).toISOString() );
            }
        });

        setTrackedVisuals();
        overwriteTrackingData();
    });

    //Write to the tracker file (overwrites the whole file)
    function overwriteTrackingData(){
        console.log(resetTime);
        $.ajax({
        type: 'POST',
        url: "postFoundData.php",
        data: JSON.stringify(
            {
            "lastResetTime": resetTime,
            "objects": trackingArray
            }
          ),
        success: function(result) {
            //alert('the data was successfully sent to the server');
        }
        })
    }

    $('.resetButton').click( function() {
        
        //Set the description container to hidden and background image to default
        $('#sceneImage').attr('src', 'img/scene-image.png');
         //Show the container once all fields are filled
         $('#descriptionContainer .inner').addClass('hideBg');
         $('#descriptionContainer .inner').hide();

        //Set all found to false
        $.each( trackingArray, function(i, trackingItem) {
            trackingItem.found = false;
        });

        //Reset button visuals (turns all grey)
        setTrackedVisuals();
        //Send data to tracker to reset on refresh
        overwriteTrackingData();

    });
    
});