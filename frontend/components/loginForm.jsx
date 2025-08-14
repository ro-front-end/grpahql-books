import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const inputStyle =
  "p-4 bg-cyan-100 outline-cyan-400 border-2 border-cyan-400 focus:rounded-full rounded-xl w-full";

function LoginForm({ onLogin }) {
  const [login, { loading, error, data }] = useMutation(LOGIN);
  const [showForm, setShowForm] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ username, password }) => {
    try {
      const result = await login({ variables: { username, password } });
      if (result.data?.login.value) {
        localStorage.setItem("token", result.data.login.value);
        onLogin(result.data.login.value);
      }
      reset();
      setShowForm(false);
    } catch (err) {
      console.error("error logging in", err);
    }
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
              {...register("username", { required: true })}
              placeholder="User name"
            />
            {errors.username && <p>User name is required.</p>}

            <input
              className={`${inputStyle}`}
              {...register("password", { required: true })}
              placeholder="Password"
            />
            {errors.password && <p>Password is required.</p>}
          </div>

          <div className=" flex gap-4 items-center justify-between w-full ">
            <button
              className="bg-cyan-400 p-4 rounded-xl hover:bg-cyan-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-[50%] "
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}{" "}
            </button>

            <button
              className="bg-slate-400 p-4 rounded-xl hover:bg-slate-500 cursor-pointer transition duration-300 ease-in-out font-semibold w-[50%]"
              type="button"
              onClick={() => setShowForm(false)}
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
          className="bg-cyan-400 p-4 rounded-xl hover:bg-cyan-500 cursor-pointer transition duration-300 ease-in-out font-semibold my-4 w-full"
          onClick={() => setShowForm(true)}
          type="button"
          disabled={loading}
        >
          Login to add Books!
        </button>
      )}
    </>
  );
}

export default LoginForm;
