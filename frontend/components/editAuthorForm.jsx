import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
      bookCount
    }
  }
`;

const inputStyle =
  "p-4 bg-cyan-100 outline-cyan-400 border-2 border-cyan-400 focus:rounded-full rounded-xl w-full";

function EditAuthorForm() {
  const [showForm, setShowForm] = useState(false);
  const { data: authorsData, loading: authorsLoading } = useQuery(ALL_AUTHORS);
  const [editAuthor, { loading, error, data }] = useMutation(EDIT_AUTHOR, {
    refetchQueries: ["allAuthors"],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleShowForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const onSubmit = async (formData) => {
    await editAuthor({
      variables: {
        name: formData.name,
        setBornTo: parseInt(formData.setBornTo, 10),
      },
    });
    reset();
    handleCloseForm();
  };

  return (
    <>
      {showForm ? (
        <form
          className="flex flex-col bg-cyan-900 p-8 gap-8 w-full mx-auto rounded-xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="py-4 uppercase text-cyan-50 text-xl font-semibold">
            Edit Author!
          </h3>

          <div className="flex gap-4 items-center justify-center w-full">
            {authorsLoading ? (
              <p className="text-cyan-50">Loading authors...</p>
            ) : (
              <select
                className={`${inputStyle}`}
                {...register("name", { required: true })}
                defaultValue=""
              >
                <option value="" disabled>
                  Select an author
                </option>
                {authorsData?.allAuthors?.map((author) => (
                  <option key={author.id} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            )}
            {errors.name && <p className="text-red-400">Author is required.</p>}

            <input
              className={`${inputStyle}`}
              {...register("setBornTo", { required: true })}
              type="number"
              placeholder="Birth year"
            />
            {errors.setBornTo && (
              <p className="text-red-400">Birth year is required.</p>
            )}
          </div>

          <div className="flex gap-4 items-center justify-between w-full ">
            <button
              className="bg-cyan-400 p-4 rounded-xl hover:bg-cyan-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-[50%]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Editing..." : "Edit author"}
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

          {error && <p className="text-red-400">Error: {error.message}</p>}
          {data && (
            <p className="text-green-400">
              Updated: {data.editAuthor.name} (Born {data.editAuthor.born})
            </p>
          )}
        </form>
      ) : (
        <button
          onClick={handleShowForm}
          className="bg-amber-400 p-4 rounded-xl hover:bg-amber-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-full"
          type="button"
          disabled={loading}
        >
          Edit Author
        </button>
      )}
    </>
  );
}

export default EditAuthorForm;
