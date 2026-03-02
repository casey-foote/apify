# Apify KV Billing Bug POC

This POC is to confirm that something is wrong with Apify KV billing when it comes to extrenal data transfer.

## How to run

Since we are testing external data transfer, you have to run this from local machine (or from outside Apify account).

Please provide 3 inputs :

`remote` : Name of remote KV you want to use. e.g. `kv-billing-poc`

`action` : Whether you want to perform `upload` action or `download` action

`threads`: How many parallel thread you want to run. Keeping it `10` is nice!

## Observation

This actor will run from 1 to 10000 and perform 10K read/write actions. Each KV entry is jusy 2 digit number meaning size is account 2 Bytes.
One cycle transfers data of around 20KB. if you add all kind of network overhead, it can never be more than 1 MB. You will notice that Apify is billing 3GB  extrenal data transfer for this. How is that fair!
