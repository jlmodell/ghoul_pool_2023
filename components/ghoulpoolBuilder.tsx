import axios from "axios";
import { useRef } from "react";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function GhoulPoolBuilder() {
  const { data, error, mutate } = useSWR("/api/pool", fetcher);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ghoulName = e.currentTarget.ghoulName.value;
    const ghoulAge = e.currentTarget.ghoulAge.value;

    console.log(ghoulName, ghoulAge);

    const res = await axios.post("/api/pool", {
      name: ghoulName,
      age: +ghoulAge,
    });

    if (res.status === 201) {
      console.log("success");
      mutate();
      formRef.current.reset();
    }
  };

  return (
    <div className="grid place-items-center">
      <h1 className="text-4xl font-semibold py-5">Ghoul Pool Builder</h1>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid grid-cols-4 gap-x-2 gap-y-1"
      >
        <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600 col-span-3">
          <label
            htmlFor="ghoulName"
            className="block text-xs font-medium text-gray-900"
          >
            Name
          </label>
          <input
            type="text"
            name="ghoulName"
            id="ghoulName"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Jane Smith"
            required
          />
        </div>

        <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label
            htmlFor="ghoulAge"
            className="block text-xs font-medium text-gray-900"
          >
            Age
          </label>
          <input
            required
            type="number"
            name="ghoulAge"
            id="ghoulAge"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          />
        </div>

        <div className="col-span-4">
          <button className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-indigo-50 w-full">
            Add to my Pool
          </button>
        </div>
      </form>

      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Points
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-300"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data &&
            data?.map((ghoul, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {i + 1}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {ghoul.name} {ghoul.isAlive ? "(alive)" : "(dead)"}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {ghoul.age}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {ghoul.isAlive ? 0 : ghoul.points}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <button
                    onClick={async () => {
                      const okay = confirm("Are you sure?");
                      if (okay) {
                        await axios.delete(
                          encodeURI("/api/pool?name=" + ghoul.name)
                        );

                        mutate();
                      }
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
