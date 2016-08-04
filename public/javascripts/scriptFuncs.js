
$(document).ready(function() {

	/*var url = window.location.href;
		var res = url.split("/"); 
		var userid = $.trim(res[4]);
   */
	//gets username based on id
	$.ajax({
	        url: 'http://localhost:3000/currentUser',
	        type: 'GET',
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function(data) {
	        	if(data[0].logInFlag === 0){
	        		var url = "http://localhost:8000/";
					window.location.replace(url);
				
	        	}
	        	console.log(data[0].username);
	        	$('#user').html("Hi, " + data[0].username);
	  	    },
	        error: function(xhr, textStatus, errorThrown) {
	        	console.log("error");
	            console.log("Error" + xhr + textStatus + errorThrown);
	        }
	});

	
	//for character count twitter
	var $textarea = $('textarea');
	var $chars_remaining = $('#charCount');

	$textarea.keyup(function(){
	    $chars_remaining.html((140 - parseInt($textarea.val().length)));
	});

	$textarea.keydown(function(){
	    $chars_remaining.html((140 - parseInt($textarea.val().length)));
	    $('#divMess').hide();
	});

	$( "#datepicker" ).datepicker({ minDate: 0 });

	$('#divMess').hide();


	//for button submission
	$('#btnSubmit').click(function(event){

		event.preventDefault();

		var username = $('a', 'li.act').text().split(",");
		username = $.trim(username[1]);
		
		var tweet = $textarea.val();
		var date = $('#datepicker').val();
		
		var datePosted = new Date();
		var dd = datePosted.getDate();
		var mm = datePosted.getMonth()+1; //January is 0!
		var yyyy = datePosted.getFullYear();
		
		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		datePosted = mm+'/'+dd+'/'+yyyy;

       	if(tweet === "" || date === ""){
       		 $('#divMess').show();
		     $("#message").html("Tweets can't be blank.. Thanks");
       	}else{
		    $.ajax({
		        url: 'http://localhost:3000/db',
		        type: 'POST',
		        contentType: 'application/json',
		        data: JSON.stringify({
		            tweet: tweet,
		            approved:0,
		            date: date,
		            datePosted:datePosted,
		            postedOnTwitter:0,
		            username:username,
		            appUserId:""
		        }),
		        dataType: 'json',
		        success: function(data) {
		            //console.log(data);
		            $('#divMess').show();
		            $("#message").html("Tweet posted successfully");
		        },
		        error: function(xhr, textStatus, errorThrown) {
		            console.log("Error" + xhr + textStatus + errorThrown);
		        }
		    });
		}

    });


	$('#logout').click(function(event){
		event.preventDefault();

		$.ajax({
	        url: 'http://localhost:3000/currentUser',
	        type: 'GET',
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function(data) {
	        	$.ajax({
				    url: 'http://localhost:3000/currentUser/' + 1,
				    type: "PUT",
				    contentType: 'application/json',
				    data: JSON.stringify({
			            username : data[0].username,
			            userid : data[0].id,
			            logInFlag : 0
		       		}),
				    success: function(data) {
				    	alert("logout successfully");
			        	var url = "http://localhost:8000/";
						window.location.replace(url);
				
				    },
				    error: function(xhr, textStatus, errorThrown) {
				        alert("Error" + xhr + textStatus + errorThrown);
				    }
				});
	  	    },
	        error: function(xhr, textStatus, errorThrown) {
	        	console.log("error");
	            console.log("Error" + xhr + textStatus + errorThrown);
	        }
		});

	});

});