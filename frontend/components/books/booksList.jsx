import { gql, useApolloClient, useQuery } from "@apollo/client";
import { useState } from "react";
import AddBookForm from "./addBookForm";
import EditAuthorForm from "../editAuthorForm";
import LoginForm from "../loginForm";

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author {
        name
      }
    }
  }
`;

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

export default function Library() {
  const [filter, setFilter] = useState("title");
  const [token, setToken] = useState(localStorage.getItem("token"));

  const client = useApolloClient();

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS, { skip: filter !== "title" });

  const {
    data: authorsData,
    loading: authorsLoading,
    error: authorsError,
  } = useQuery(ALL_AUTHORS, { skip: filter !== "author" });

  return (
    <section className="max-w-3xl my-8 mx-auto flex flex-col w-full sm:w-[40%] min-h-[89vh]">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-2 rounded bg-cyan-200"
      >
        <option value="title">Title</option>
        <option value="author">Author</option>
      </select>

      {filter === "title" && (
        <>
          {booksLoading && <p>Loading books...</p>}
          {booksError && <p>Error loading books: {booksError.message}</p>}
          {booksData && (
            <table className="w-full text-left text-cyan-50 bg-cyan-800 rounded-xl p-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Published</th>
                </tr>
              </thead>
              <tbody>
                {booksData?.allBooks
                  .slice()
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((book) => (
                    <tr key={book.id} className="border-b border-cyan-700">
                      <td className="px-4 py-2">{book.title}</td>
                      <td className="px-4 py-2">
                        {book.author?.name ?? "unknown"}
                      </td>
                      <td className="px-4 py-2">{book.published ?? "N/A"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {filter === "author" && (
        <>
          {authorsLoading && <p>Loading authors...</p>}
          {authorsError && <p>Error loading authors: {authorsError.message}</p>}
          {authorsData && (
            <table className="w-full text-left text-cyan-50 bg-cyan-800 rounded-xl p-4">
              <thead>
                <tr>
                  <th className="px-4 py-2">Author</th>
                  <th className="px-4 py-2">Born</th>
                  <th className="px-4 py-2">Books Count</th>
                </tr>
              </thead>
              <tbody>
                {authorsData?.allAuthors
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((author) => (
                    <tr key={author.id} className="border-b border-cyan-700">
                      <td className="px-4 py-2">{author.name}</td>
                      <td className="px-4 py-2">{author.born ?? "N/A"}</td>
                      <td className="px-4 py-2">{author.bookCount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {!token ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="mt-6 w-full mx-auto">
          {" "}
          <AddBookForm />
        </div>
      )}
      <EditAuthorForm />
      {token ? (
        <div className="flex mt-6 justify-end">
          <button
            onClick={handleLogout}
            type="button"
            className="bg-orange-700 p-2 rounded-xl hover:bg-orange-800 cursor-pointer transition duration-300 ease-in-out font-semibold w-[20%] "
          >
            Logout
          </button>
        </div>
      ) : null}
    </section>
  );
}
