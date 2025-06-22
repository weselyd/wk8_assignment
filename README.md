# wk8_assignment

This is an improved version of the Weather Dashboard with AI feature that lets users who enjoy clouds to submit an image to the app and have it classified as one of ten different types of clouds.  The application frontend is currently hosted on GitHub pages and backend on Netlify.  If you want to deploy a version of your own, clone the back and frontend reopos and upload to your source code management system of choice.  Deploy static frontend to a location of your choosing but when deploying the backend be sure to create environment variables for OpenAI and OpenWeatherMap or the APIs will not function.

The AI model for this application is gpt-3.5-turbo for the weather advice and gpt-4o for the image classification.  Model gpt-4o was needed for image classification as 3.5-turbo is text only.  I attempted to find an open source model for this feature but was not confident that available models would be accurate enough to reliably identify different cloud types.  Since this application is only classifying clouds, there are no ethical risks associated with it.  If a user submits something that is not a cloud, the response will tell them what they uploaded did not contain clouds and to try again if they want.


Example deployment: https://weselyd.github.io/wk8_assignment/

Frontend repo: https://github.com/weselyd/wk8_assignment
Backend repo : https://github.com/weselyd/wk8_netlify

Environment variable names:
* OPENAI_KEY
* OPENWEATHER_API_KEY

