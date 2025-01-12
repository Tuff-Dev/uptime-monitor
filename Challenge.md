## The Challenge - Building An Uptime Monitoring Service

For this coding challenge we will be building an uptime monitoring service. It will allow one or more users to:

1. Enter one or more URLs to be monitored.
2. Configure the frequency of monitoring.
3. Define an action to take when the monitored URL is either:
    1. Too slow to respond with a full page, or
    2. Not responding at all.
4. View historical uptime and response-time data.

You could build this as a simple command line tool, just for your own use or you could build a full blown web based service hosted in the cloud. If so don’t forget AWS offer a [free tier](https://aws.amazon.com/free/), Azure offers a similar set of services that are [free (with limits) for 12 months](https://azure.microsoft.com/en-gb/free/) and Google Cloud offers [20+ free products for all customers (with limits)](https://cloud.google.com/free) and $300 in free credits (at the time of writing). Other cloud providers are also available.

### Step Zero

In this step you decide which programming language and IDE you’re going to use and you get yourself setup with a nice new project for your uptime monitor. You might like to mix a couple of programming languages for this coding challenge, one for the backend and monitoring functionality and another for the user interface.

### Step 1

In this step your goal is to allow the user to enter one or more URLs to be monitored and to set a frequency for monitoring. You will then need to store this in a database.

Depending on the solution you decide to build that could be as simple as a flat file or as complex as a cloud hosted SQL/NoSQL database. You could use any of those, but they will all have trade-offs.

### Step 2

In this step your goal is to send a HTTP HEAD request to the URLs at the specified frequency, storing the result and relevant data for each request in the database. When designing your database consider how you’ll want to use this time series data.

You could use a HTTP GET request, but a HEAD is all you need for monitoring if the site is up and responding to requests. If you don’t know the difference now would be a great time to learn.

### Step 3

In this step your goal is to allow the user to view the historic data for the requests. Your UI should allow the user to select one or more of the URLs they are monitoring and specify a date range. They should then be able to see a graph of the uptime, and ideally the round-trip time of the response.

### Step 4

In this step your goal is to allow the user to specify the use of a GET request and to then have additional data about the request and response stored and available for display via a graph. This should include time to first byte (TTFB) and the time to get the whole response.

### Step 5

In this step your goal is to allow the user to view the new data via the UI. Ideally they should also be able to access the data either via an API (if you went for a web based solution) or export it if you built it as a command line/desktop tool.

### Step 6

In this step your goal is to allow the user to configure alerts. They should be able to request alerts via email or via a webhook. They should be able to specify that the alert happens when the site is unresponsive for N attempts where N is a configurable number.

### Going Further

Much like the [URL Shortener](https://codingchallenges.fyi/challenges/challenge-url-shortener) Coding Challenge you can extend this uptime monitoring solution with signup, authentication and a payment service and you have your own fully blow SaaS business! Beyond that many uptime services will also monitor web pages for specific text or SSL certificates for expiry.