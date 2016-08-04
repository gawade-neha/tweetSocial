$(document).ready(function() {

	$('#divMess').hide();

	$.ajax({
	        url: 'http://localhost:3000/currentUser',
	        type: 'GET',
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function(data) {
	        	if(data.length > 0){
		        	if(data[0].logInFlag === 1){
		        		var url = "http://localhost:8000/index.html";
						window.location.replace(url);
					}
				}
	        },
	        error: function(xhr, textStatus, errorThrown) {
	        	console.log("error");
	            console.log("Error" + xhr + textStatus + errorThrown);
	        }
	});

	$("#username").keydown(function(){
	    $('#divMess').hide();
	});

	$("#password").keydown(function(){
	    $('#divMess').hide();
	});


	$('#submit').click(function(event){

		event.preventDefault();
		
		var username = $('#username').val();
		var password = $('#password').val();
		
		if(username === "" || password === ""){
		   $('#divMess').show();
		   $('#message').html("username and password can't be blank");
		}else{
			$.ajax({
		        url: 'http://localhost:3000/register',
		        type: 'GET',
		        contentType: 'application/json',
		        dataType: 'json',
		        success: function(data) {
		        	
		        	if(data.length === 0){
		        		alert("No such user present");
			            
		        	}else{

		        		var flag = 0, valId;

		        		//check if user is present on the system or not
						for (var i = data.length - 1; i >= 0; i--) {
							if(data[i].username === username && data[i].password === password){
								flag = 1;
								valId = data[i].id;
								break;
							}
						}
						
						if(flag === 1){
							$.ajax({
							        url: 'http://localhost:3000/currentUser/'+ 1,
							        type: 'PUT',
							        contentType: 'application/json',
							        data: JSON.stringify({
							           username : username,
							           userid : valId,
							           logInFlag:1,
							           id : 1
							        }),
							        success: function(data) {
							        	var url = "http://localhost:8000/index.html";
							            window.location.replace(url);
							            return false;
							        },
							        error: function(xhr, textStatus, errorThrown) {
							        	console.log("error");
							            console.log("Error" + xhr + textStatus + errorThrown);
							        }
									        
							});
						}else{
                              $('#divMess').show();
		                      $('#message').html("No such user present");
						}  
				    }
			    },
			    error: function(xhr, textStatus, errorThrown) {
			    	console.log("error");
			        console.log("Error" + xhr + textStatus + errorThrown);
			    }
			
			});
        }

 	});

});