export default function Button({ children, loading }) {
  return (
    <button
      disabled={loading}
      className="w-full rounded-lg bg-black py-2.5 text-sm 
                 text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium "
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
