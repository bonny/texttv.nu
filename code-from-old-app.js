

        ## Load page range
		// Cache requests by adding timestamp that is rounded to nearest minute + nearest 15 seconds
		// so all requests within a minute can get cached by nginx
		// Request URL will be like: http://texttv.nu/api/get/110-111/?cb=2014-3-2_19:7:29:15
		var cacheBusterTime = new Date();
		var cacheBusterString = cacheBusterTime.getUTCFullYear() + "-" + cacheBusterTime.getUTCDay() + "-" + cacheBusterTime.getUTCDate() + "_" + cacheBusterTime.getUTCHours() + ":" + cacheBusterTime.getUTCMinutes();
		var seconds = cacheBusterTime.getUTCSeconds();
		var secondsInterval = 15;
		seconds = seconds - ( seconds % secondsInterval );
		cacheBusterString += cacheBusterString + ":" + seconds;

        ---

        ## Hitta uppdatering till sida
        // hitta ID på sidan som har högst id och kolla den
        // http://texttv.nu/api/updated/100,300,700/1439310425
		var apiEndpoint = "http://api.texttv.nu/api/updated/" + pageRange + "/" + pageWithMaxDate.date_updated_unix;

		---

        ## Share page
        // Call the texttv api to get permalink and screenshot
        // http://digital.texttv.nu/api/share/2664651
        var apiEndpoint = "http://api.texttv.nu/api/share/" + pageIDs;

        