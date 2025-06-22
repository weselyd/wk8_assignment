# wk8_assignment

This is an improved version of the Weather Dashboard with AI feature that lets users who enjoy clouds to submit an image to the app and have it classified as one of ten different types of clouds.  The application frontend is currently hosted on GitHub pages and backend on Netlify.  If you want to deploy a version of your own, clone the back and frontend reopos and upload to your source code management system of choice.  Deploy static frontend to a location of your choosing but when deploying the backend be sure to create environment variables for OpenAI and OpenWeatherMap or the APIs will not function.

The AI model for this application is gpt-3.5-turbo for the weather advice and gpt-4o for the image classification.  Model gpt-4o was needed for image classification as 3.5-turbo is text only.  I attempted to find an open source model for this feature but was not confident that available models would be accurate enough to reliably identify different cloud types.  Since this application is only classifying clouds, there are no ethical risks associated with it.  If a user submits something that is not a cloud, the response will tell them what they uploaded did not contain clouds and to try again if they want.


Example deployment: https://weselyd.github.io/wk8_assignment/

Frontend repo: https://github.com/weselyd/wk8_assignment
Backend repo : https://github.com/weselyd/wk8_netlify

Environment variable names:
* OPENAI_KEY
* OPENWEATHER_API_KEY

# Post-Mortem Reflection
This project was challenging for me as it incorporates a lot of what I’ve learned over nearly the last two months.  I feel like I’ve covered a lot of ground during that time and have many new tools with which I have become familiarized but there are some additions and refinements to my latest Weather Dashboard that I could implement with more time to work.

1. Use of open-source model: This was expected to be in scope for this assignment but because I was unable to find a ready-made model that I was confident in that could perform image classification on clouds via API call I chose to stick with OpenAI.  This got a working product but if this were a real production app, using OpenAI could mean a significant cost increase to add the feature – especially if it was publicly available.

2. Authenticated experience: Creating an authenticated experience using something like Firebase would be great as it could automatically populate a “home” location for users and open the door to other customizable functionality.

3. Automatic update of background CSS: The app currently has a self-contained module that lets the user change the background from several different options.  The first change would be to make this persistent by saving a value assigned to it in a cookie.  Another way to extend it would be to analyze the user’s source IP address, use the IP to look up their general location, then user that to find current weather at that location, and change the background to match their current weather outside.  This might not always work for users of VPN or other proxied connections but could be a setting enabled/disabled by the user stored in a cookie – or better yet, when combined with an authenticated experience the setting could follow them around wherever they are logged in.

4. Show weather for other locations: Another setting that would likely require a cookie or user authentication would be the ability to show weather for other locations when the page is viewed.  This would be a list of locations that persist after closing the browser or possibly stored in a database.
