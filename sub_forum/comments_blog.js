$(function() {
    $("#cancel-comment-reply-link").hide();
    //$(".reply_button").live('click', function(event) { //jQuery upto 1.9
	$(".reply_button").on('click', function(event) { //jQuery 1.9+
        event.preventDefault();
        var id = $(this).attr("id");
        //if ($("#li_comment_" + id).find('ul').size() > 0) { //jQuery upto 1.9
		if ($("#li_comment_" + id).find('ul').length > 0) { //jQuery 1.9+
            $("#li_comment_" + id + " ul:first").prepend($("#comment_form_wrapper"));
        } else {
            $("#li_comment_" + id).append($("#comment_form_wrapper"));
        }
        var depth_level = $('#li_comment_' + id).data('depth-level');
        $("#reply_id").attr("value", id);
        $("#depth_level").attr("value", depth_level);
        $("#cancel-comment-reply-link").show();
    });

    $("#cancel-comment-reply-link").bind("click", function(event) {
        event.preventDefault();
        $("#reply_id").attr("value", "");
        $("#comment_wrapper").prepend($("#comment_form_wrapper"));
        $(this).hide();
    });

    $("#comment_form").bind("submit", function(event) {
        event.preventDefault();
        if ($("#comment_text").val() == "") {
            alert("Please enter your comment");
            return false;
        }
        $.ajax({
            type: "POST",
            //async: false,
            url: "add_comment.php",
            data: $('#comment_form').serialize(),
            dataType: "html",
            cache: false,
            beforeSend: function() {
                $('#comment_wrapper').block({
                    message: 'Please wait....',
                    css: {
                        border: 'none',
                        padding: '15px',
                        backgroundColor: '#ccc',
                        '-webkit-border-radius': '10px',
                        '-moz-border-radius': '10px'
                    },
                    overlayCSS: {
                        backgroundColor: '#ffe'
                    }
                });
            },
            success: function(comment) {
                var reply_id = $("#reply_id").val();
                if (reply_id == "") {
                    $("#comment_wrapper ul:first").prepend(comment);
                }
                else {
					//if ($("#li_comment_" + reply_id).find('ul').size() > 0) { //jQuery upto 1.9
                    if ($("#li_comment_" + reply_id).find('ul').length > 0) { //jQuery 1.9+
                        $("#li_comment_" + reply_id + " ul:first").prepend(comment);
                    }
                    else {
                        $("#li_comment_" + reply_id).append('<ul class="comment">' + comment + '</ul>');
                    }
                }
                $("#comment_text").attr("value", "");
                $("#reply_id").attr("value", "");
                $("#cancel-comment-reply-link").hide();
                $("#comment_wrapper").prepend($("#comment_form_wrapper"));
                $('#comment_wrapper').unblock();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //console.log(textStatus, errorThrown);
                alert(textStatus + " " + errorThrown);
            }
        });
    });
});