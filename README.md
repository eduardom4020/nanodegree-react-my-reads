# MyReads Project

#### Author
Eduardo Melo de Carvalho Braga

## About This Project
My Reads is a project proposed by Udacity team for the course React Nanodegree. The main goal was to make a application of book shelves. In wich user can add books to shelves by searching some term and move the books bettwen these shelves.
In this project the user can do exactly this. On starting program you will view all of your three shelves (Want to Read, Currently Reading, Read). To add content to then you should click on PLUS float action button or navigate to /search, type some term (just like Android), and all books related to this content will appear. Then click on green button with down arrow to select in what shelf you want to put this book. If you click on return button you will be redirected to main page, and your book will be there.

## Testing
To run this application you only need to download the project to your local computer. Then you should have npm installed to continue to the next step. Run the following command on project's root folder:

```
npm install
```

This will install all libraries used in this project. Then run:

```
npm start
```

This will start your application.
PS: If you have an error about HOST variable, you probably have some virtual environment installed on your PC. This bug occurs frequently with my npm, so to correct this just run:

```
export HOST=
```

## The Development
In this project development I started with the Udacity's template version of the app. I trimmed all of the HTML content and changed to react components and later added new features.
The proccess flow is decribed bellow:
1. I wanted to make react router and test if it will been working. But to do this I needed to create all of components that used on project, and putted placeholder's content. With this I tested the router functions and everything went ok.
2. So I separed the float action button from page component, this way all button logic will be indepent of the page, keeping them reusable.
3. Created the book compoent that receive a book object and create all content by using this informations. Then made shelf selector button separeted from book, in order to made them reusable.
5. I made the shelves to the first page. These are reusable, at first, but after I made improvements and now an shelf can be putted in any component and can show what the programmer wants this to show. That way I used the same shelf component to show search results.
6. Finaly I refactored the code, changing some functions from App to another components, in order to keep them more detachable.

### Versions

* 0.1.0: Copied base project template from udacity repository.
* 1.0.0: Finished main application with all functions needed.

### Updates Log

0. Get base project from rpository.
1. Changed route control from App inner state to react router's Route component, using Link component to navigate bettwen them.
2. Refactored pages components. Now main page and search page are not even more functional components in App.js script. They are scripts putted in components folder, and are ready for reuse.
3. Added button separated from pages. Now it's possible to put a button only adding it's path to an json file.
4. Finished book sctructure and separate selector in another component.
5. Created shelves and functions that made books and group of books move bettwen then. Added to selector the function that moves a book from some shelf to another.
6. Created search page reuzing shelf component, applied some adjusts to all other components. The core of application is built!
7. Refactored functions moved them from app to shelfs and search page.
8. Refactored variables names and semi colons.
9. Finished adding comments.
10. Finished readme.
11. Fixed problem on shelf selector's deafult value.