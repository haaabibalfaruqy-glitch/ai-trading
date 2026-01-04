// components/ExecutionGate.tsx
import React from "react";

type Props = {
  onConnect: () => void;
  children?: React.ReactNode; // optional
};

const ExecutionGate: React.FC<Props> = ({ onConnect, children }) => {
  const handleConnect = () => {
    onConnect();
  };

  return (
    <div className="execution-gate border p-4 rounded-md">
      <button
        onClick={handleConnect}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Connect
      </button>

      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ExecutionGate;
