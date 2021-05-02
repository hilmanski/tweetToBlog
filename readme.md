# Tweet To Blog

Turn your tweet into a blog post. 
-It will filter out "retweet" , "reply to other people" , and "link/media only". 
-A thread will turn to a single post
-Server side render (SEO friendly)
-Techstack: NodeJS, Express and Mongo (mongoose) as database

- [Demo video](https://www.youtube.com/watch?v=QhosFYuXqAc)

## Usage

```bash
1. npm install
2. run mongo
3. node app.js
4. create env file based on env example (Get values from developer twitter app)
```

## Usecase

- People who wants to blog from twitter
- For people who'd like to document their tweet as a blog (save permanently or might be able to update/delete later)


## Max Result
@services/TwitterService
change MAX_RESULTS for whatever number you want to stream tweets for the first time