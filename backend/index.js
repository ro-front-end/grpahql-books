const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const { MONGODB, SECRET } = require("./utils/config");
const Book = require("./models/bookSchema");
const User = require("./models/userSchema");
const jwt = require("jsonwebtoken");
const Author = require("./models/authorSchema");

mongoose
  .connect(MONGODB)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch(() => {
    console.error("couldn't connect to MongoDB");
  });

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];

// /*
//  * Suomi:
//  * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
//  * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
//  *
//  * English:
//  * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
//  * However, for simplicity, we will store the author's name in connection with the book
//  *
//  * Spanish:
//  * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
//  * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
//  */

// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "Demons",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ];

// /*
//   you can remove the placeholder query once your first one has been implemented
// */

const typeDefs = `
  type Book {
    title:String!
    published:Int
    genres:[String!]!
    author: Author
    id:ID!
  }

  type Author {
    id: ID!
    name:String
    born:Int
    bookCount:Int
    books:[Book!]!
  }

  type User {
  username: String!
  favoriteGenre: String!
  id: ID!
  }

  type Token {
  value: String!
  }



  type Query {
    booksCount: Int!
    authorsCount:Int!
    allBooks(author: String, genre:String): [Book!]!
    allAuthors:[Author!]!
    findBook(title:String!):Book
    findAuthor(name:String!):Author
    me: User
  }

  type Mutation {
    addBook(
    title:String!
    published:Int!
    author: String!
    genres:[String!]!
  ):Book
  editAuthor(
    name:String!
    setBornTo: Int!
  ):Author
  createUser(
  username: String!
  favoriteGenre: String!
  ):User
  login(
  username:String!
  password: String!
  ): Token

  }
`;

const resolvers = {
  Query: {
    booksCount: async () => await Book.countDocuments({}),
    authorsCount: async () => await Author.countDocuments({}),
    allBooks: async () => {
      const books = await Book.find({}).populate("author");
      return books.map((book) => ({
        id: book._id.toString(),
        title: book.title,
        published: book.published,
        genres: book.genres,
        author: book.author
          ? {
              id: book.author._id.toString(),
              name: book.author.name || "Unknown", // nunca null
              born: book.author.born || null,
            }
          : {
              id: null,
              name: "Unknown",
              born: null,
            },
      }));
    },
    allAuthors: async () => await Author.find({}),
    findBook: async (root, args) => await Book.findOne({ title: args.title }),
    findAuthor: async (root, args) => await Author.findOne({ name: args.name }),
    me: (root, args, context) => context.currentUser,
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const book = new Book({
        title: args.title,
        published: parseInt(args.published, 10),
        author: author._id,
        genres: args.genres.map((g) => g.trim()),
      });

      try {
        await book.save();
      } catch (error) {
        console.error("Error creating book:", error);
        throw new GraphQLError("Error creating book", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return book;
    },

    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) return null;

      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      if (!author) return null;

      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Error editing author", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = await new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        return user.save();
      } catch (error) {
        throw new GraphQLError("error creating the user", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("error creating the user", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    let currentUser = null;
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), SECRET);
      currentUser = await User.findById(decodedToken.id);
    }
    return { currentUser };
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
