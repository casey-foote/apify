## 🏡 What is Bayut Real Estate Properties Scraper?

This Bayut properties Scraper will enable you scrape any sale/rent listing from  collection from [bayut.com](https://www.bayut.com/).

You can simply take your listing url from browser and enter it into this actor. This actor will crawl through all pages of particular listing and generate dataset for you.

Listing url is something you get when you perform the search on bayut site. Example listing urls :

- https://www.bayut.com/for-sale/property/dubai/al-satwa/
- https://www.bayut.com/to-rent/property/dubai/al-satwa/
- https://www.bayut.com/for-sale/3-bedroom-apartments/dubai/dubai-marina/

## 🚪 What can this Bayut Scraper do?

📈 Extract Bayut market data listings on Bayut 

👀 This actor is not just scraper but also has monitoring capability. You can turn on monitoring mode and it will give you only newly added properties compared to your previous scrapes.

📩  This actor also helps yu to identify which properties are not listed anymore. Please refer to [Identifying delisted properties](#identifying-delisted-properties) 

⬇️ Download Bayut real estate data in Excel, CSV, JSON, and other formats


## 🌳 What Bayut data can I extract using this tool?

|       📝         |             📝            |
|------------------|----------------------------|
| Listing Title    | Full Address               |
| Listing URL      | ReferenceNo                |
| Permit Number    | DED                        |
| Bathrooms        | Bedrooms                   |
| Agent Name       | Agent Phone                |
| Listing Type     | Property Type              |
| Latitude         | Longitude                  |
| Completion       | Average Rent               |
| Text Description | Formatted HTML Description |
| Amenities        | Images                     |
| Price            | Size                       |
| RERA             | BRN                        |
| Completion Status| Agency Name                |


## ⬇️ Input

For simple usecase, you just need to provide browser url of bayut search result page & that's all. You can leave other fields as they are to be sensible defaults.

### Input example


```json
{
    "listUrls": [
        {
            "url": "https://www.bayut.com/for-sale/3-bedroom-apartments/dubai/dubai-marina/"
        }
    ],
    "propertyUrls": [
        {
            "url": "https://www.bayut.com/property/details-8023002.html"
        }
    ],
    "fullScrape": true,
    "monitoringMode": false,
    "includePriceHistory": false,
    "enableDelistingTracker" : false
}
```

You can either provide `listUrls` to search properties from or provide `propertyUrls` directly to crawl.

Understading monitoring mode :

- `fullScrape` : This option is by default turned on. When enabled it always force actor to scrape complete listing from all pagination pages regardless of monitoring is enabled or not.


- `monitoringMode` : This option when turned on will only scrape newly added property listings compared to previously scraped properties by this actor. It's important to turn off fullScrape setting if you are using this mode. If you keep fullScrape on, it will re-scrape complete listing again.

- `includePriceHistory` : This option when turned on will also scrape procie history of given property when available with bayut. This may affect the speed of scraping considerably. Please turn it on only if you need this data.

- `enableDelistingTracker` : This option when turned on will start tracking date against each property under Apify Key Value store. This KV store can be queried later to find out which properties are delisted.

## ⬆️ Output

The scraped data is stored in the dataset of each run. The data can be viewed or downloaded in many popular formats, such as *JSON, CSV, Excel, XML, RSS, and HTML*.

### Output example
The result for scraping a single property like this:

```json
{
	"type": "sale",
	"referenceNo": "Bayut - 1844-Rp-S-0930",
	"completion": "Ready",
	"averageRent": "Not available",
	"addedOn": "29 May 2023",
	"permitNumber": "1614389770",
	"dED": "844251",
	"rERA": "23701",
	"bRN": "42666",
	"id": "7515507",
	"title": "Prime Location-Residential+commercial+offices Plot-G+8",
	"completionStatus": "completed",
	"images": [
		"https://bayut-production.s3.eu-central-1.amazonaws.com/image/400340335/2453b599f4a9484cb844fa4dec643dd2",
		"https://bayut-production.s3.eu-central-1.amazonaws.com/image/400340423/b301636057304235903c056e85e01374",
		"https://bayut-production.s3.eu-central-1.amazonaws.com/image/400340445/aece2164910a4bc4adc9205b6e916a9e"
	],
	"coordinates": {
		"latitude": 25.222472556121,
		"longitude": 55.275030705226
	},
	"size": "13,350 sqft",
	"price": 20000000,
	"amenities": [
		"ATM Facility",
		"Freehold"
	],
	"bathrooms": 0,
	"bedrooms": 0,
	"descriptionHtml": "Bawadikji Real Estate  is pleased to offer you, residential  plots at Jumeirah Gardens City, Al Satwa Dubai. <br /><br /><br />Plot Usage:  Residential+commercial+offices Plot . <br />Plot Size – 13,300 sqft<br /> <br />Permitted Height G+8<br />Ownership: Freehold<br /> <br />No time limit for Construction<br /><br /><br />The development follows Dubai Development Authority (DDA) rules and regulations in terms of design &amp; construction<br /><br /><br />The development follows Dubai Development Authority (DDA) rules and regulations in terms of design &amp; construction dda. gov. ae/dda-services/zoning-services/<br />Jumeirah Garden City is set to emerge as a medium density, mixed-use neighbourhood that features residential apartments, retail spaces, public facilities, hotels, and parks. It will continue to house popular landmarks such as Jumma Masjid and other utilities. Jumeirah Garden City is located within an existing urban fabric parallel to Sheikh Zayed Road in Dubai.",
	"displayAddress": "Jumeirah Garden City, Al Satwa, Dubai",
	"agent": "Mouhammad  Soubhi Fakkas",
	"agencyName": "Bawadikji Real Estate",
	"agentPhone": "+971524912594",
	"propertyType": "Residential Plot",
	"url": "https://www.bayut.com/property/details-7515507.html"
}
```

## ❓Limitations

Since Bayut allows only 50000 properties per listing/search result, you might want to break down your listing urls into smaller area if it has more than 50K results. Good News is that even if multiple list urls contains overlapping results, they will get deduplicated within same run data.

## 🔎 Identifying delisted properties

This actor provides you monitoring mode configuration using which you can get only incremental updates about newly added properties. In case, you also want to identify which properties are delisted from platform, you can use any of the following techniques with the help of this actor.

1. Running Always in full scraper mode :
    Run this actor always in full scrape mode and cross check the new incoming batch of data with your existing database. If any property that exists in yoru database but not in newly scraped data batch, that means it's not listed anymore

2. Use Key Value Store generated by scraper :
    If your are monitoring very large batch of data and you don't want to scrape everything all the time, this method involves bit of technicality but achieves the goal efectively. Apify has storage feature called [Key-value store](https://docs.apify.com/api/v2/#/reference/key-value-stores/key-collection/get-list-of-keys). When you run this scrape, this scraper stores every single property in key value store along with timestamp in `bayut-properties` store. Inside this store, key is property id itself and value is timestamp like this

    ```
    { lastSeen : '2023-11-02T05:59:25.763Z'}
    ```

    Whenever you run this scraper, it will update the timestamp against particular id if it finds property on the platform. e.g. if we have 2 proprties with id `prop1` and `prop2` and we scraped them both on November 1, key value storage would look like this :

    ```
    prop1 -> { lastSeen : '2023-11-01T05:59:25.763Z'}
    prop2 -> { lastSeen : '2023-11-01T05:59:25.763Z'}
    ```

    Now if you run this scraper again on December 1 and prop1 is not on the platform anymore but prop2 is still there, key value storage would change like this :

    ```
    prop1 -> { lastSeen : '2023-11-01T05:59:25.763Z'}
    prop2 -> { lastSeen : '2023-12-01T05:59:25.763Z'}
    ```

    That means if any property has `lastSeen` less than latest batch you loaded, that property is delisted now. You can directly iterate through whole Key value storage using Apify key value storage API to identify this. Please refer to [this](https://docs.apify.com/api/v2/#/reference/key-value-stores/key-collection/get-list-of-keys) API documentation to do the same. Please remember store name generated by this scrape will be `bayut-properties`.

    Alternatively, you can iterate through your existing database active properties and use [this](https://docs.apify.com/api/v2/#/reference/key-value-stores/record/get-record) API to identify listing status.

    For this approach to work, it's important that you enable this feature via `enableDelistingTracker` (Enable Delisting tracker) input.


## 🙋‍♀️ For custom solutions

In case you need some custom solution, you can contact me : [dhrumil@techvasu.com](mailto:dhrumil@techvasu.com)

Or learn more about me on github : [https://github.com/dhrumil4u360](https://github.com/dhrumil4u360)