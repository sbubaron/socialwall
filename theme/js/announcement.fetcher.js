$(function() {
    console.log("Announcement fetcher operational");
    $template = '<div class="media well announcement-card">';
    //$template += '<div class="item-header">';
    //$template += '<div class="avatar pull-left media-object">{AVATAR}</div>';
    //$template += '<span class="name">{USER_NAME}</span>   <span class="username">@{USER_HANDLE}</span>   <span class="time pull-right">{AGO}</span>';
    //$template +=  '</div>';
    $template += '<div class="content">';
    $template += '<div class="body">';
    //$template +=  '{IMG}';
    $template += '{TEXT}';
    //$template += '</div>';
    $template += '</div>';
    $template += '</div>';


    JQANNOUNCE = {

        appendTo: '.wall',
        template: $template,
        sinceid: -1,

        // core function of jqtweet
        // https://dev.twitter.com/docs/using-search
        loadAnnouncements: function() {

            var request;


            $.ajax({
                url: '/api/gsheet-json.php',
                type: 'POST',
                dataType: 'json',
                data: request,
                success: function(data, textStatus, xhr) {
                    //  console.log(data);

                    console.log(data);
                    console.log(JQANNOUNCE.sinceid);

                    if (data.length > 0) {



                        var text, name, img;

                        try {
                            // append tweets into page

                            for (var i = JQANNOUNCE.sinceid; i < data.length; i++) {


                                if (i > 0 && data[i].id > JQANNOUNCE.sinceid) {
                                    $announceCard = JQANNOUNCE.template.replace('{TEXT}', data[i].Title);
                                    $('.wall').cycle('add', $announceCard);

                                    JQANNOUNCE.sinceid = data[i].id;
                                    console.log(JQANNOUNCE.sinceid);
                                }
                            }


                        } catch (e) {
                            //item is less than item count
                            console.log("item is less than count");
                            console.log(e);
                        }

                    } else console.log('no data returned');


                }

            });

        }

    };

});
