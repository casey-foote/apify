## 🏡 What is Dubizzle Real Estate Properties Scraper?

This Dubizzle properties Scraper will enable you scrape any sale/rent listing from  collection from [dubizzle.com](https://www.dubizzle.com/).

You can simply take your listing url from browser and enter it into this actor. This actor will crawl through all pages of particular listing and generate dataset for you.

Listing url is something you get when you perform the search on dubizzle site. Example listing urls :

- https://dubai.dubizzle.com/en/property-for-sale/residential/?building=14025
- https://dubai.dubizzle.com/en/property-for-sale/residential/?building=14025
- https://dubai.dubizzle.com/property-for-sale/residential/apartment/?building=14025

## 🚪 What can this Dubizzle Scraper do?

📈 Extract Dubizzle market data listings on Dubizzle 

👀 This actor is not just scraper but also has monitoring capability. You can turn on monitoring mode and it will give you only newly added properties compared to your previous scrapes.

📩  This actor also helps yu to identify which properties are not listed anymore. Please refer to [Identifying delisted properties](#identifying-delisted-properties) 

⬇️ Download Dubizzle real estate data in Excel, CSV, JSON, and other formats


## 🌳 What Dubizzle data can I extract using this tool?

|       📝         |             📝            |
|------------------|----------------------------|
| Listing Title    | Full Address               |
| Listing URL      | ReferenceNo                |
| reraDedLicenceNo | Completion Status          |
| Bathrooms        | Bedrooms                   |
| Agent Name       | Agent Phone                |
| Listing Type     | Property Type              |
| Latitude         | Longitude                  |
| Completion       | Agency Email               |
| Text Description | Formatted HTML Description |
| Amenities        | Images                     |
| Price            | Size                       |
| Furnishing       | Listing Date               |


## ⬇️ Input

For simple usecase, you just need to provide browser url of dubizzle search result page & that's all. You can leave other fields as they are to be sensible defaults.

### Input example


```json
{
    "listUrls": [
        {
            "url": "https://dubai.dubizzle.com/property-for-sale/residential/?neighborhood=60155"
        }
    ],
    "propertyUrls": [
        {
            "url": "https://dubai.dubizzle.com/property-for-sale/residential/villahouse/2023/10/1/a-house-for-sale-in-al-ghubaiba-in-excelle-12-933/"
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

- `includePriceHistory` : This option when turned on will also scrape procie history of given property when available with dubizzle. This may affect the speed of scraping considerably. Please turn it on only if you need this data.

- `enableDelistingTracker` : This option when turned on will start tracking date against each property under Apify Key Value store. This KV store can be queried later to find out which properties are delisted.

## ⬆️ Output

The scraped data is stored in the dataset of each run. The data can be viewed or downloaded in many popular formats, such as *JSON, CSV, Excel, XML, RSS, and HTML*.

### Output example
The result for scraping a single property like this:

```json
{
	"title": "Super Deluxe Villa for sale in Helwan \\ corner on two streets, the second piece of the main street",
	"url": "https://dubizzle.com/s/DawgnO",
	"images": [
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/6670f3f1d9b0498cb721937714ad993c-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/3dbfefb6a57a4aa58b3e65f0a1e12d2f-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/76faacb345e74c33b72fb607727281cb-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/7eb1ed1f4ecc448ab9643b28a0574e51-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/ca5c94a9e78a461aa85220cc1478e2f0-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/3e03351d4dc64846bdf52aeaa5c5beb7-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/c0311775da134f188971db0ea771022e-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/b90252c97f844eed8e67d9683a96665f-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/48331006c9cd485aba6e9232295cc77e-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/50e7681bce7c45b698b86dfaeecfd430-.jpg?impolicy=legacy&imwidth=800",
		"https://dbz-images.dubizzle.com/images/2023/11/05/dd1e10ef-e6fa-487a-b48d-f78d4f54b67a/086dcbc6df564971a7465914b4a47649-.jpg?impolicy=legacy&imwidth=800"
	],
	"price": 3000000,
	"bedrooms": 5,
	"bathrooms": 8,
	"size": 8000,
	"coordinates": {
		"lat": 25.348499298096,
		"lng": 55.416801452637
	},
	"location": "Al Ghubaiba, Sharjah, UAE",
	"type": "sale",
	"description": "Super Deluxe Villa for sale in Helwan area in Sharjah <br> The land area is 8000 square feet, a corner on two streets, the second piece of the main street <br> The building area is 4600 square feet<br> The villa consists of:<br>5 master rooms, each room has a private bathroom with a dressing <br>4 on the top floor and one room on the ground floor <br>Two halls <br>big sitting room <br>A kitchen with two doors, internal and external. <br>A maid's room and an ironing room have an external door <br>The materials used in the villa are first class <br>Air conditioning duct general <br>Interlock from Arabic German does not change color <br><br>3 million dirhams required",
	"isVerified": false,
	"hasDLDHistory": false,
	"reraPermitUrl": null,
	"addedOn": "November 6, 2023",
	"agent": "mohamed",
	"agencyName": "Al Wasl Estste",
	"agencyEmail": "alwaslrealestate112@gmail.com",
	"amenities": [
		"Maids Room",
		"Central A/C & Heating",
		"Balcony",
		"Private Garden",
		"Pets Allowed",
		"Double Glazed Windows",
		"Laundry Room",
		"Broadband Internet",
		"Satellite / Cable TV",
		"Maintenance Staff",
		"Storage Areas",
		"Waste Disposal"
	],
	"propertyType": "Villa",
	"purpose": "Sale",
	"furnished": "Unfurnished",
	"updatedAt": "1699994557",
	"completionStatus": "Ready",
	"reraDedLicenceNo": "511946",
	"propertyReference": "9873-L0fN5K",
	"id": "2023-11-5-super-deluxe-villa-for-sale-in-helwan-corn-12-569"
}
```

## ❓Limitations

Since Dubizzle allows only 80000 properties per listing/search result, you might want to break down your listing urls into smaller area if it has more than 80K results. Good News is that even if multiple list urls contains overlapping results, they will get deduplicated within same run data.

## 🔎 Identifying delisted properties

This actor provides you monitoring mode configuration using which you can get only incremental updates about newly added properties. In case, you also want to identify which properties are delisted from platform, you can use any of the following techniques with the help of this actor.

1. Running Always in full scraper mode :
    Run this actor always in full scrape mode and cross check the new incoming batch of data with your existing database. If any property that exists in yoru database but not in newly scraped data batch, that means it's not listed anymore

2. Use Key Value Store generated by scraper :
    If your are monitoring very large batch of data and you don't want to scrape everything all the time, this method involves bit of technicality but achieves the goal efectively. Apify has storage feature called [Key-value store](https://docs.apify.com/api/v2/#/reference/key-value-stores/key-collection/get-list-of-keys). When you run this scrape, this scraper stores every single property in key value store along with timestamp in `dubizzle-properties` store. Inside this store, key is property id itself and value is timestamp like this

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

    That means if any property has `lastSeen` less than latest batch you loaded, that property is delisted now. You can directly iterate through whole Key value storage using Apify key value storage API to identify this. Please refer to [this](https://docs.apify.com/api/v2/#/reference/key-value-stores/key-collection/get-list-of-keys) API documentation to do the same. Please remember store name generated by this scrape will be `dubizzle-properties`.

    Alternatively, you can iterate through your existing database active properties and use [this](https://docs.apify.com/api/v2/#/reference/key-value-stores/record/get-record) API to identify listing status.

    For this approach to work, it's important that you enable this feature via `enableDelistingTracker` (Enable Delisting tracker) input.


## 🙋‍♀️ For custom solutions

In case you need some custom solution, you can contact me : [dhrumil@techvasu.com](mailto:dhrumil@techvasu.com)

Or learn more about me on github : [https://github.com/dhrumil4u360](https://github.com/dhrumil4u360)