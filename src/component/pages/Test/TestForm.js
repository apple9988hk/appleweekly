import { useForm } from "react-hook-form";

export default function TestForm() {
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  // console.log(watch("example")); // watch input value by passing the name of it

  return (
    <div className="max-w-7xl mx-auto p-3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class="mb-6">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="name@flowbite.com"
            {...register("email", { required: true })}
            required
          ></input>
        </div>

        <div class="mb-6">
          <label
            for="countries"
            class="block mb-2 text-sm font-medium text-gray-900"
          >
            Select your country
          </label>
          <select
            id="countries"
            {...register("countries", { required: true })}
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          >
            <option>United States</option>
            <option>Canada</option>
            <option>France</option>
            <option>Germany</option>
          </select>
        </div>

        <div class="mb-6">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 "
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            {...register("password", { required: true })}
            required
          ></input>
        </div>
        <div class="flex items-start mb-6">
          <div class="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              {...register("remember")}
            ></input>
          </div>
          <label for="remember" class="ml-2 text-sm font-medium text-gray-900">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
      <Form2 />
    </div>
  );
}

function Form2() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto my-4 p-4 bg-white rounded-md shadow-md">
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
        <input id="name" type="text" name="name" {...register('name', { required: true })} className="w-full px-3 py-2 border rounded-md border-gray-400 focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
        <input id="email" type="email" name="email" {...register('email', { required: true })} className="w-full px-3 py-2 border rounded-md border-gray-400 focus:outline-none focus:border-indigo-500" />
      </div>
      <div className="mb-4">
        <label htmlFor="select" className="block text-gray-700 font-bold mb-2">Select an Option:</label>
        <select id="select" name="select" {...register('select', { required: true })} className="w-full px-3 py-2 border rounded-md border-gray-400 focus:outline-none focus:border-indigo-500">
          <option value="" disabled hidden>Please select</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Submit</button>
    </form>
  );
}