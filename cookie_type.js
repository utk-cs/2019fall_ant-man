//distinguish cookies by their name and expiration date




/****** Session Cookies ****/
//Usually if that name has "Sess" or "id" indicates a session cookie
 //Examples
    //name = __cfduid indicates a cloudfare cookie. Expires after 30 days
    | .utexas.edu                    | __cfduid             | ddcdfdc9f05162349b842329b78de709c1547688113 | // https://support.cloudflare.com/hc/en-us/articles/200170156-Understanding-the-Cloudflare-Cookies

    //name = __utmb, utmv indicates a google analytics cookies. Expires after 30 minutes
    | .geeksforgeeks.org             | __utmb               | 245605906.1.10.1568151135 | //https://www.optimizesmart.com/google-analytics-cookies-ultimate-guide/#a24
    | .slideshare.net                | __utmv               | 186399478.|1=member_type=LOGGEDOUT=1 |


/****** Tracking Cookies ****/
//Examples
    //name = _ga indicates a google analytics cookie. Expires after 2 years
    | .skyscanner.com                | _ga                  | GA1.2.1196117874.1556671497 | //https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage

    //name = __qca indiates a quantcast cookie, which is a marketing company
    | .soundcloud.com                | __qca                | P0-108408777-1547699109119 | //https://webmasters.stackexchange.com/questions/17912/what-does-the-quantcast-qca-cookie-do
    
    //name = __utma, __utmz indicates a google analytics cookie (unique visitor cookie). Expires after 2 years
    | .calculator.net                | __utma               | 9212199.612212910.1547564371.1550795609.1554246103.3 | //https://www.optimizesmart.com/google-analytics-cookies-ultimate-guide/#a24
    | .simplypsychology.org          | __utmz               | 174296480.1553568244.1.1.utmcsr=google|utmccn=

    //name = _gcl_au  indicates a google analytics cookie (conversion linker). Expires after 2 years //https://support.google.com/tagmanager/thread/6211471?hl=e


    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err;
        }
        
        rows.forEach((row) => {
            console.log("|", row.host_key.padEnd(30), "|", row.name.padEnd(20), "|", decryptor.decrypt(row.encrypted_value), "|");
            if(row.host_name === "_ga") {
                row.type = "Tracking ( Google Analytics)";
                row.expire = "date here - +2 years";
                row.description = "Used to distinguish users"
                row.link = "https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
            }
            else if(row.host_name === "__cfduid") {
                row.type = "Session (Cloudfare)";
                row.expire = "date here - 30 minutes";
                row.description = "Used by the content network, Cloudflare, to identify trusted web traffic"
                row.source = "https://ailab.criteo.com/cookie-declaration/"
            }
            else if(row.host_name === "__qca") {
                row.type = "Tracking (Quantcast)";
                row.expire = "date here - +2 years";
                row.description = "Used by the Marketing firm, Quantcast, to compile and report user data to third-party companies"
                row.source = "https://www.quantcast.com/about-us/"
            }
        });
    });
