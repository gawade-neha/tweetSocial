$(document).ready(function() {

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
	  	    },
	        error: function(xhr, textStatus, errorThrown) {
	        	console.log("error");
	            console.log("Error" + xhr + textStatus + errorThrown);
	        }
	});

	displayPendingTweets();

	//loads twitter data
	function displayPendingTweets(){

		var uname, userCount;

	 	var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd='0'+dd;
		} 

		if(mm<10) {
		    mm='0'+mm;
		} 

		today = mm+'/'+dd+'/'+yyyy;


		$.ajax({
		    url: 'http://localhost:3000/currentUser',
		    type: "GET",
		    dataType: 'json',
		    success: function(data) {
		        uname = data[0].username;
		        $('#user').html("Hi, " + uname);
		        $('#uid').html(data[0].userid);
		        $('#uid').hide();
		    },
		    error: function(xhr, textStatus, errorThrown) {
		        alert("Error" + xhr + textStatus + errorThrown);
		    }
      	});
		
		//usercount from register
		$.ajax({
		    url: 'http://localhost:3000/register',
		    type: "GET",
		    dataType: 'json',
		    success: function(data) {
		    	userCount = data.length;

				$.ajax({
				    url: 'http://localhost:3000/db',
				    type: "GET",
				    dataType: 'json',
				    success: function(data) {
				    	
				    	var uname = $('#user').html().split(",");
				    	uname = $.trim(uname[1]);

				    	$.each(data, function(x, value) {
				        	 if(uname === value.username){
				 			 }else{
				 			 	console.log(value);
				 			 	//today = "03/29/2016";
				 			 	//case if today date is greater than schedule date and not posted on twitter then delete it
				 			 	if(today > value.date && value.postedOnTwitter === 0){
				 			 		
				 			 		$.ajax({
									    url: 'http://localhost:3000/db/' + value.id,
									    type: "DELETE",
									    dataType: 'json',
									    success: function(data) {
									    },
									    error: function(xhr, textStatus, errorThrown) {
									        alert("Error" + xhr + textStatus + errorThrown);
									    }
							    	});	
									

				 			 	}else{
                                    $("#postTweets").append(dbData(value, userCount));
				 			 	}
				 			 }
				        });
				    },
				    error: function(xhr, textStatus, errorThrown) {
				        alert("Error" + xhr + textStatus + errorThrown);
				    }
			  	});
		    },
		    error: function(xhr, textStatus, errorThrown) {
		        alert("Error" + xhr + textStatus + errorThrown);
		    }
      	});	
	  	
	}


	//generates dyanmic generated html
	function dbData(jsonData, userCount) {
	     
		 //alert(userCount);
		 //console.log(jsonData);
		 var userId = $('#uid').html();
		 var verifyApproved = jsonData.approved;
		 var idList = jsonData.appUserId;  // list of id of user's who approved this tweet
		 
		 userCount = userCount - 1;

		 //checks if tweet approved is greater than usercount
		 if(verifyApproved >= userCount){

		 	var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
			    dd='0'+dd;
			} 

			if(mm<10) {
			    mm='0'+mm;
			} 

			today = mm+'/'+dd+'/'+yyyy;
			//today = "03/22/2016";

			
			if(today === jsonData.date && jsonData.postedOnTwitter === 0){

			    $.ajax({
				    url: 'http://localhost:3000/db/' + jsonData.id,
				    type: "PUT",
				    contentType: 'application/json',
				    data: JSON.stringify({
			            approved: jsonData.approved,
			            date: jsonData.date,
			            tweet: jsonData.tweet,
			            datePosted: jsonData.datePosted,
			            postedOnTwitter: 1,
			            username : jsonData.username,
			            appUserId : jsonData.appUserId
		       		}),
				    success: function(data) {
			        	var parameters = { tweet: jsonData.tweet };
			        	//post on twitter
				     	$.post( '/tweetPost', parameters, function(data) {
					       	alert(" Status updated successfully on to the twitter");
					       	location.reload(true);
					     });
				
				    },
				    error: function(xhr, textStatus, errorThrown) {
				        alert("Error" + xhr + textStatus + errorThrown);
				    }
				});

			} // don't show if already posted on twitter
			else if(jsonData.postedOnTwitter === 1){

			}
			 // disable approval since tweet schedule to be posted not equal to today's date
			else{
				 $("#postTweets").append('<div class="post_body">');
				 $("#postTweets").append('<div class="tweet_body"><span class="tweet">'+jsonData.tweet+'</span></div> ');
			     $("#postTweets").append('<p class="description">&#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span>'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"><button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"> <span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>  </span></p>');
				 $("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
				 $("#"+jsonData.id).prop("disabled", true);
			}//else
		 }else{

		 	console.log(idList);
		 	console.log(idList.length);
		 
		 	if(idList.length > 0 || idList.length === undefined){ // used undefined because not getting length of single no in javascript
		 		
		 		if(jsonData.postedOnTwitter === 1){  // it is for when tweet is already posted on twitter but no of user's increased since then
		 		}
		 		else{
		 			
		 			if(parseInt(idList) === parseInt(userId)){  
	 				    $("#postTweets").append('<div class="post_body">');
					 	$("#postTweets").append('<div class="tweet_body"><span class="tweet">'+jsonData.tweet+'</span> </div> ');
				     	$("#postTweets").append('<p class="description">&#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span>'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"> <button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>  </span></p>');
					 	$("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
					 	$("#"+jsonData.id).prop("disabled", true);
					}
		 			else if(idList.length === undefined){
		 				$("#postTweets").append('<div class="post_body">');
						$("#postTweets").append('<div class="tweet_body"><span class="tweet">'+jsonData.tweet+'</span> </div> ');
					    $("#postTweets").append('<p class="description">&#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span>'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"> <button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>  </span></p>');
						$("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
		 			}else{
			 			var hasId = idList.indexOf(userId) != -1; //checks if userId already present in approved Idlist 

			   		 	if(hasId === true){ //then disable approve button
			                $("#postTweets").append('<div class="post_body">');
						 	$("#postTweets").append('<div class="tweet_body"><span  class="tweet" >'+jsonData.tweet+'</span> </div> ');
					     	$("#postTweets").append('<p class="description">&#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span>'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"> <button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button> </span></p>');
						 	$("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
						 	$("#"+jsonData.id).prop("disabled", true);
						}else{
							$("#postTweets").append('<div class="post_body">');
						 	$("#postTweets").append('<div class="tweet_body"><span class="tweet">'+jsonData.tweet+'</span> </div> ');
					     	$("#postTweets").append('<p class="description"> &#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span>'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"> <button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button> </span></p>');
						 	$("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
						}
		   		 	}
		   	    }
	   		}else{ //show approve button as no user's has approved it
   				$("#postTweets").append('<div class="post_body">');
			 	$("#postTweets").append('<div class="tweet_body"><span class="tweet" >'+jsonData.tweet+'</span></div> ');
		     	$("#postTweets").append('<p class="description">&#0149;<span>'+ "Posted on account: " +jsonData.datePosted+'</span> <span style="margin:0 0 0 10px">'+ "Posted by: " +jsonData.username+'</span> <span style="margin:0 0 0 75px"> <button id="'+ jsonData.id +'" type="button" class="btn btn-success btn-sm"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button> </span></p>');
			 	$("#postTweets").append('<hr style="border-color: #106cc8;border-width: 2px;"/>');
   			}
   			
		 }	

	}

	//post tweet on twitter
	$("#postTweets").on("click", "button", function() {
		
		var rowId = $(this).attr("id");
    	var approved, date, tweet, datePosted, appUserId;

    
    	//updates approved for this it first gets the data and then updates it.
    	$.ajax({
	    
	        url: 'http://localhost:3000/db/' + rowId,
	        type: 'GET',
	        contentType: 'application/json',
	        dataType: 'json',
	        success: function(data) {
		     	var uid = $('#uid').html();
    	
		     	approved = data.approved + 1;
		     	date = data.date;
		     	tweet = data.tweet;
		     	datePosted = data.datePosted;
		     	postedOnTwitter = data.postedOnTwitter;
		     	username = data.username;
		     	appUserId = data.appUserId; 

		     	if(data.appUserId === ""){
		     		appUserId = "" + uid;
		     	}else{
		     		appUserId += ",";
		     		appUserId += uid;
		     	}
				
		     	//alert(appUserId);
		     	//alert(approved);
		     	
				$.ajax({
				    url: 'http://localhost:3000/register',
				    type: "GET",
				    dataType: 'json',
				    success: function(data) {
				    	var userCount = data.length;
				    	updateApprove(approved, appUserId, userCount);
				    },
			        error: function(xhr, textStatus, errorThrown) {
			        	console.log("error");
			            console.log("Error" + xhr + textStatus + errorThrown);
			        }

				});
		     	
		     	
		     	function updateApprove(approved, appUserId, userCount) {
                	
                	// gets today date
                	var today = new Date();
					var dd = today.getDate();
					var mm = today.getMonth()+1; //January is 0!
					var yyyy = today.getFullYear();

					if(dd<10) {
					    dd='0'+dd;
					} 

					if(mm<10) {
					    mm='0'+mm;
					} 

					today = mm+'/'+dd+'/'+yyyy;


					if(approved >= userCount-1){
						// if today date is same as date schedule to post
						if(today === date){

			            	$.ajax({
							    url: 'http://localhost:3000/db/' + rowId,
							    type: "PUT",
							    contentType: 'application/json',
							    data: JSON.stringify({
						            approved: approved,
						            date: date,
						            tweet: tweet,
						            datePosted: datePosted,
						            postedOnTwitter: 1,
						            username : username,
						            appUserId :appUserId
					       		}),
							    success: function(data) {
						        	var parameters = { tweet: tweet };
							     	$.post( '/tweetPost', parameters, function(data) {
								       	alert(" Status updated successfully on to the twitter");
								       	//$("#"+data.id).prop("disabled", true);
								       	location.reload(true);
								     });
							
							    },
							    error: function(xhr, textStatus, errorThrown) {
							        alert("Error" + xhr + textStatus + errorThrown);
							    }
					      	});
						}else{

							$.ajax({
							    url: 'http://localhost:3000/db/' + rowId,
							    type: "PUT",
							    contentType: 'application/json',
							    data: JSON.stringify({
						            approved: approved,
						            date: date,
						            tweet: tweet,
						            datePosted: datePosted,
						            postedOnTwitter: postedOnTwitter,
						            username : data.username,
						            appUserId :appUserId
					       		}),
							    success: function(data) {
						     		alert("Tweet is schedule to update on mentioned date");
						     		$("#"+data.id).prop("disabled", true);
							    },
							    error: function(xhr, textStatus, errorThrown) {
							        alert("Error" + xhr + textStatus + errorThrown);
							    }
					      	});
						}//else
				  }//if
				  else{
				  			$.ajax({
							    url: 'http://localhost:3000/db/' + rowId,
							    type: "PUT",
							    contentType: 'application/json',
							    data: JSON.stringify({
						            approved: approved,
						            date: date,
						            tweet: tweet,
						            datePosted: datePosted,
						            postedOnTwitter: postedOnTwitter,
						            username : data.username,
						            appUserId :appUserId
					       		}),
							    success: function(data) {
						     		alert("Tweet is scheduled to be updated");
						     		//location.reload(true)
						     		$("#"+data.id).prop("disabled", true);
							    },
							    error: function(xhr, textStatus, errorThrown) {
							        alert("Error" + xhr + textStatus + errorThrown);
							    }
					      	});
				  }

                }

		    },
		    error: function(xhr, textStatus, errorThrown) {
		        alert("Error" + xhr + textStatus + errorThrown);
		    }
    	});

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



	//autofill textbox for group members
	$(function(){
		var availableTags= new Array();
		$.ajax({
			url: 'http://localhost:3000/register',
			type: 'GET',
			contentType: 'application/json',
			dataType: 'json',
			success: function(data) {
				for(var i=0;i<data.length;i++){
					console.log(data[i].username);
					availableTags.push(data[i].username);
				}
				console.log(availableTags);

			},
			error: function(xhr, textStatus, errorThrown) {
				console.log("error");
				console.log("Error" + xhr + textStatus + errorThrown);
			}
		});
		$( "#groupmem" ).autocomplete({
			source: availableTags
		});


	});

/*

	//add users to group attribute of json data
	$("#makegroup").on("click", "button", function() {

		var rowId = $(this).attr("id");
		var groupmembers;


		//updates approved for this it first gets the data and then updates it.
		$.ajax({

			url: 'http://localhost:3000/db/' + rowId,
			type: 'GET',
			contentType: 'application/json',
			dataType: 'json',
			success: function(data) {
				var uid = $('#uid').html();

				approved = data.approved + 1;
				date = data.date;
				tweet = data.tweet;
				datePosted = data.datePosted;
				postedOnTwitter = data.postedOnTwitter;
				username = data.username;
				appUserId = data.appUserId;

				if (data.appUserId === "") {
					appUserId = "" + uid;
				} else {
					appUserId += ",";
					appUserId += uid;
				}

			}});
	});*/
});
	
