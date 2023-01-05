export default function Bingo() {
  // data is array of { id: number, name: string } for 24 ids
  const data = [
    { id: 1, name: "Bingo" },
    { id: 2, name: "Bongo" },
    { id: 3, name: "Bungo" },
    { id: 4, name: "Bango" },
    { id: 5, name: "Bungo" },
    { id: 6, name: "Bongo" },
    { id: 7, name: "Bingo" },
    { id: 8, name: "Bango" },
    { id: 9, name: "Bungo" },
    { id: 10, name: "Bongo" },
    { id: 11, name: "Bingo" },
    { id: 12, name: "Bango" },
    { id: 13, name: "Bungo" },
    { id: 14, name: "Bongo" },
    { id: 15, name: "Bingo" },
    { id: 16, name: "Bango" },
    { id: 17, name: "Bungo" },
    { id: 18, name: "Bongo" },
    { id: 19, name: "Bingo" },
    { id: 20, name: "Bango" },
    { id: 21, name: "Bungo" },
    { id: 22, name: "Bongo" },
    { id: 23, name: "Bingo" },
    { id: 24, name: "Bango" },
  ];

  // build a table with 5 rows and 5 columns and randomize the data

  let randomized = data.sort(() => Math.random() - 0.5);
  randomized = [
    ...randomized.slice(0, 12),
    { id: 25, name: "mitch mconnell" },
    ...randomized.slice(12),
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 py-8 bg-white rounded-md">
        <h1 className="text-2xl font-bold text-gray-900">Bingo</h1>
        <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4 py-8 bg-white rounded-md">
          <table className="mt-8 w-full">
            <tbody className="bg-white grid grid-cols-5 gap-1">
              {randomized.map((item) => {
                return (
                  <tr className="max-w-1/5 min-w-1/5">
                    <td className="max-w-1/5 min-w-1/5 p-6 border-2 border-gray-300 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {item.id}| {item.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
