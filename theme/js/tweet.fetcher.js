$(function() {
    console.log("Tweet fetcher operational");
    $template = '<div class="media well tweet-card {ID}">';
    $template += '<div class="item-header">';
    $template += '<div class="avatar pull-left media-object">{AVATAR}</div>';
    $template += '<span class="name">{USER_NAME}</span> <span class="username">@{USER_HANDLE}</span> <time class="time pull-right timeago" datetime="{DATEISO}"></time>';
    $template += '</div>';
    $template += '<div class="content">';
    $template += '<div class="body">';
    $template += '{IMG}';
    $template += '{TEXT}';
    $template += '</div>';
    $template += '</div>';
    $template += '</div>';


    JQTWEET = {

        // Set twitter hash/user, number of tweets & id/class to append tweets
        // for multiple hashtags, you can separate the hashtag with OR, eg:
        // hash: '%23jquery OR %23css'
        search: '#trump OR #sbutlt', //leave this blank if you want to show user's tweet
        numTweets: 5, //number of tweets to load
        appendTo: '.wall',
        template: $template,
        sinceid: 720825277157236699, //id of oldest tweet to load

        // https://dev.twitter.com/docs/using-search
        loadTweets: function() {

            var request;

            // different JSON request {hash|user}

            request = {
                q: JQTWEET.search,
                count: JQTWEET.numTweets,
                sinceid: JQTWEET.sinceid,
                api: 'search_tweets'
            }

            //        console.log(request);
            console.log(JQTWEET.sinceid);
            $.ajax({
                url: '/api/grabtweets.php',
                type: 'POST',
                dataType: 'json',
                data: request,
                success: function(data, textStatus, xhr) {
                    console.log(data);
                    if (data.httpstatus == 200) {
                        if (JQTWEET.search) data = data.statuses;

                        var text, name, img;

                        try {
                            // append tweets into page
                            //console.log(data);
                            for (var i = 0; i < data.length; i++) {
                                console.log(data[i]);

                                img = '';
                                url = 'http://twitter.com/' + data[i].user.screen_name + '/status/' + data[i].id_str;
                                avatar = '<img src="' + data[i].user.profile_image_url_https + '" />';

                                if (data[i].retweeted_status) {

                                } else {
                                    console.log(JQTWEET.sinceid + " - " + data[i].id);


                                    try {
                                        if (data[i].entities['media']) {
                                            img = '<img class="pull-right" src="' + data[i].entities['media'][0].media_url + '" />';
                                        }
                                    } catch (e) {
                                        //no media
                                        console.log("no media");
                                    }
                                    $tweetCard = JQTWEET.template.replace('{TEXT}', JQTWEET.ify.clean(data[i].text))
                                        .replace('{USER_HANDLE}', data[i].user.screen_name)
                                        .replace('{IMG}', img)
                                        .replace('{AVATAR}', avatar)
                                        .replace('{USER_NAME}', data[i].user.name)
                                        .replace('{ID}', data[i].id)
                                        .replace('{AGO}', JQTWEET.timeAgo(data[i].created_at))
                                        .replace('{DATE}', JQTWEET.dateString(data[i].created_at))
                                        .replace('{DATEISO}', JQTWEET.dateISO(data[i].created_at));


                                    //    console.log($tweetCard);
                                    //$(JQTWEET.appendTo).append( $tweetCard );
                                    if (!$(".wall ." + data[i].id)[0]) {
                                        $('.wall').cycle('add', $tweetCard);
                                        console.log("adding " + data[i].id);
                                    }


                                    if (JQTWEET.sinceid < data[i].id) {
                                        JQTWEET.sinceid = data[i].id;
                                        console.log(JQTWEET.sinceid);
                                    }

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

        },

        dateString: function(dateString) {
          var date = new Date(dateString);

          if ($.browser.msie) {
              // IE can't parse these crazy Ruby dates
              date = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
          }


          return date;
        },

        dateISO: function(dateString) {
          var date = new Date(dateString);

          if ($.browser.msie) {
              // IE can't parse these crazy Ruby dates
              date = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
          }

          return date.toISOString();
        },
        /**
         * relative time calculator FROM TWITTER
         * @param {string} twitter date string returned from Twitter API
         * @return {string} relative time like "2 minutes ago"
         */
        timeAgo: function(dateString) {
            var rightNow = new Date();
            var then = new Date(dateString);

            if ($.browser.msie) {
                // IE can't parse these crazy Ruby dates
                then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
            }

            var diff = rightNow - then;

            var second = 1000,
                minute = second * 60,
                hour = minute * 60,
                day = hour * 24,
                week = day * 7;

            if (isNaN(diff) || diff < 0) {
                return ""; // return blank string if unknown
            }

            if (diff < second * 2) {
                // within 2 seconds
                return "right now";
            }

            if (diff < minute) {
                return Math.floor(diff / second) + " seconds ago";
            }

            if (diff < minute * 2) {
                return "about 1 minute ago";
            }

            if (diff < hour) {
                return Math.floor(diff / minute) + " minutes ago";
            }

            if (diff < hour * 2) {
                return "about 1 hour ago";
            }

            if (diff < day) {
                return Math.floor(diff / hour) + " hours ago";
            }

            if (diff > day && diff < day * 2) {
                return "yesterday";
            }

            if (diff < day * 365) {
                return Math.floor(diff / day) + " days ago";
            } else {
                return "over a year ago";
            }
        }, // timeAgo()


        /**
         * The Twitalinkahashifyer!
         * http://www.dustindiaz.com/basement/ify.html
         * Eg:
         * ify.clean('your tweet text');
         */
        ify: {
            link: function(tweet) {
                return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
                    var http = m2.match(/w/) ? 'http://' : '';
                    return m4;
                });
            },

            at: function(tweet) {
                return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
                    return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
                });
            },

            list: function(tweet) {
                return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
                    return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
                });
            },

            hash: function(tweet) {
                return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
                    return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
                });
            },

            clean: function(tweet) {
                return this.hash(this.at(this.list(this.link(tweet))));
            }
        } // ify


    };

});
