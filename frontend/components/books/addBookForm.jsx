import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ALL_BOOKS } from "./booksList";

const CREATE_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $genres: [String!]!
    $published: Int!
  ) {
    addBook(
      title: $title
      author: $author
      genres: $genres
      published: $published
    ) {
      id
      title
      published
      author {
        name
      }
    }
  }
`;

const inputStyle =
  "p-4 bg-cyan-100 outline-cyan-400 border-2 border-cyan-400 focus:rounded-full rounded-xl w-full";

function AddBookForm() {
  const [showForm, setShowForm] = useState(false);
  const [createBook, { loading, error, data }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    const variables = {
      ...formData,
      published: parseInt(formData.published, 10),
      genres: formData.genres.split(",").map((g) => g.trim()),
    };
    try {
      await createBook({ variables });
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("Error creating book:", err);
    }
  };

  const handleShowForm = () => {
    setShowForm(true);
  };
  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <>
      {showForm ? (
        <form
          className="flex flex-col bg-cyan-900 p-8 gap-8 w-full mx-auto rounded-xl my-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="py-4 uppercase text-cyan-50 text-xl font-semibold">
            Add a New Book!
          </h3>

          <div className=" flex gap-4 items-center justify-center w-full">
            <input
              className={`${inputStyle}`}
              {...register("title", { required: true })}
              placeholder="Title"
            />
            {errors.title && <p>Title is required.</p>}

            <input
              className={`${inputStyle}`}
              {...register("author", { required: true })}
              placeholder="Author"
            />
            {errors.author && <p>Author is required.</p>}
          </div>

          <div className=" flex gap-4 items-center justify-center w-full">
            <input
              className={`${inputStyle}`}
              {...register("published", { required: true })}
              placeholder="Published"
            />
            {errors.published && <p>Published is required.</p>}

            <input
              className={`${inputStyle}`}
              {...register("genres", { required: true })}
              placeholder="Genres"
            />
            {errors.genres && <p>Genres is required.</p>}
          </div>

          <div className=" flex gap-4 items-center justify-between w-full ">
            <button
              className="bg-cyan-400 p-4 rounded-xl hover:bg-cyan-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-[50%] "
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Book"}{" "}
            </button>

            <button
              className="bg-slate-400 p-4 rounded-xl hover:bg-slate-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-[50%]"
              type="button"
              onClick={handleCloseForm}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {error && <p>Error:{error.message}</p>}
          {data && <p>Created: {data.addBook.title}</p>}
        </form>
      ) : (
        <button
          onClick={handleShowForm}
          className="bg-cyan-400 p-4 rounded-xl hover:bg-cyan-500 cursor-pointer transition duration-300 ease-in-out font-semibold my-4 w-full"
          type="button"
          disabled={loading}
        >
          Add Book
        </button>
      )}
    </>
  );
}

export default AddBookForm;
