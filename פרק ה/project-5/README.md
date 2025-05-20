C:\Users\Nabet\Desktop\לימודים\שנה ד\full stack\פרק ה\project-5
json-server --watch db.json --port 3001
npm run dev
http://localhost:3001
http://localhost:5173/


בסיס נתונים קטן
{
  "users": [
    {
      "id": "1",
      "name": "Leanne Graham",
      "username": "Bret",
      "email": "Sincere@april.biz",
      "website": "bret1234!"
    },
    {
      "id": "c222",
      "name": "name",
      "username": "name",
      "email": "name@gmail.com",
      "website": "123456abc"
    }
  ],
  "posts": [
    {
      "id": "1",
      "userId": "1",
      "title": "Post Title 1",
      "body": "This is the body of the first post."
    },
    {
      "id": "0b5e",
      "userId": "1",
      "title": "post2",
      "body": "this is a new post"
    },
    {
      "id": "d393",
      "userId": "c222",
      "title": "אורווזיון",
      "body": "הגענו למקום 2 באורוויזון"
    }
  ],
  "comments": [
    {
      "id": "1",
      "postId": "1",
      "name": "Bret",
      "email": "email@example.com",
      "body": "Great post!"
    },
    {
      "id": "a779",
      "postId": "1",
      "name": "Bret",
      "email": "Sincere@april.biz",
      "body": "this is new comment"
    },
    {
      "id": "746a",
      "postId": "0b5e",
      "name": "Bret",
      "email": "Sincere@april.biz",
      "body": "hi"
    },
    {
      "id": "7d0a",
      "postId": "1",
      "name": "Bret",
      "email": "Sincere@april.biz",
      "body": "hi"
    },
    {
      "id": "28e3",
      "postId": "0b5e",
      "name": "Bret",
      "email": "Sincere@april.biz",
      "body": "שלום"
    },
    {
      "id": "6ccc",
      "postId": "0b5e",
      "name": "Bret",
      "email": "Sincere@april.biz",
      "body": "ביי"
    },
    {
      "id": "35eb",
      "postId": "1",
      "name": "name",
      "email": "name@gmail.com",
      "body": "hi1"
    },
    {
      "id": "e950",
      "postId": "d393",
      "name": "name",
      "email": "name@gmail.com",
      "body": "#2"
    }
  ],
  "albums": [
    {
      "id": "1",
      "userId": "1",
      "title": "Animal Album"
    },
    {
      "id": "5483",
      "userId": "1",
      "title": "תמונות נוף "
    },
    {
      "id": "d3c8",
      "userId": "1",
      "title": "view"
    }
  ],
  "photos": [
    {
      "id": "1",
      "albumId": "1",
      "title": "dog",
      "url": "https://picsum.photos/id/237/400/600",
      "thumbnailUrl": "https://picsum.photos/id/237/200/300"
    },
    {
      "id": "8686",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/630/300/450.jpg?hmac=WX5tZLU6T251GeqAj0ogNWg94cPMuAM_1V2ZdnytmTk",
      "title": "Photo 3",
      "thumbnailUrl": "https://fastly.picsum.photos/id/630/300/450.jpg?hmac=WX5tZLU6T251GeqAj0ogNWg94cPMuAM_1V2ZdnytmTk"
    },
    {
      "id": "2513",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/572/300/450.jpg?hmac=wSQDgYmb518BHWoBriGuD7-BbWNQYagZYLAoeJIXn14",
      "title": "Photo 4",
      "thumbnailUrl": "https://fastly.picsum.photos/id/572/300/450.jpg?hmac=wSQDgYmb518BHWoBriGuD7-BbWNQYagZYLAoeJIXn14"
    },
    {
      "id": "a53c",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/412/300/450.jpg?hmac=o-Aib9wqNl2dmGJov6JGX6vSP157cY35JOHyLu_Yn6c",
      "title": "Photo 5",
      "thumbnailUrl": "https://fastly.picsum.photos/id/412/300/450.jpg?hmac=o-Aib9wqNl2dmGJov6JGX6vSP157cY35JOHyLu_Yn6c"
    },
    {
      "id": "d9e2",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/415/300/450.jpg?hmac=AnghMhYTF5trEvQr6ZfEIeJWoxY_J8wdWxotui3xUoY",
      "title": "Photo 6",
      "thumbnailUrl": "https://fastly.picsum.photos/id/415/300/450.jpg?hmac=AnghMhYTF5trEvQr6ZfEIeJWoxY_J8wdWxotui3xUoY"
    },
    {
      "id": "0505",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/966/300/450.jpg?hmac=1dZBgOSjHR0QNX2stXHcRPnEXVVQxMHKaXxfsUaue3o",
      "title": "Photo 5",
      "thumbnailUrl": "https://fastly.picsum.photos/id/966/300/450.jpg?hmac=1dZBgOSjHR0QNX2stXHcRPnEXVVQxMHKaXxfsUaue3o"
    },
    {
      "id": "fe74",
      "albumId": "5483",
      "url": "https://fastly.picsum.photos/id/116/300/450.jpg?hmac=yEp_86s8KDrj62C-928sugtPNvGq-eTA2_xOstQabgg",
      "title": "Photo 6",
      "thumbnailUrl": "https://fastly.picsum.photos/id/116/300/450.jpg?hmac=yEp_86s8KDrj62C-928sugtPNvGq-eTA2_xOstQabgg"
    },
    {
      "id": "71e1",
      "albumId": "d3c8",
      "url": "https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tUk",
      "title": "Photo 1",
      "thumbnailUrl": "https://fastly.picsum.photos/id/559/600/400.jpg?hmac=sRJHfq808moVesuKlfinoDI8WW6bDAUb-6MEFtm0tUk"
    },
    {
      "id": "3b9e",
      "albumId": "d3c8",
      "url": "https://fastly.picsum.photos/id/724/300/200.jpg?hmac=noXikCG-jTwpsWI_sfPENFpGvq1UtFKfiy4ARKbcdN0",
      "title": "Photo 2",
      "thumbnailUrl": "https://fastly.picsum.photos/id/724/300/200.jpg?hmac=noXikCG-jTwpsWI_sfPENFpGvq1UtFKfiy4ARKbcdN0"
    },
    {
      "id": "a814",
      "albumId": "1",
      "url": "https://media.istockphoto.com/id/1796374503/photo/the-lion-king.webp?a=1&b=1&s=612x612&w=0&k=20&c=WHVZW8kYz5I-hfkES58duFi2VrXI_Z0hXNweq3MUSwE=",
      "title": "lion",
      "thumbnailUrl": "https://media.istockphoto.com/id/1796374503/photo/the-lion-king.webp?a=1&b=1&s=612x612&w=0&k=20&c=WHVZW8kYz5I-hfkES58duFi2VrXI_Z0hXNweq3MUSwE="
    },
    {
      "id": "018d",
      "albumId": "d3c8",
      "url": "https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE",
      "title": "ים",
      "thumbnailUrl": "https://fastly.picsum.photos/id/16/2500/1667.jpg?hmac=uAkZwYc5phCRNFTrV_prJ_0rP0EdwJaZ4ctje2bY7aE"
    }
  ],
  "todos": [
    {
      "id": "1",
      "userId": "1",
      "title": "Do homework",
      "completed": true
    },
    {
      "id": "f7a3",
      "userId": "1",
      "title": "bay milk",
      "completed": false
    },
    {
      "id": "da21",
      "userId": "1",
      "title": "go to sleep",
      "completed": false
    },
    {
      "id": "e906",
      "userId": "c222",
      "title": "פגישת זום ב6",
      "completed": false
    }
  ]
}