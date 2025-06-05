export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="text-red-600 text-sm px-6 py-4 bg-red-50 border border-red-200 rounded">
    {message}
  </div>
);
