import React from "react";

const Alert = ({ errorMessage, errorMessageType, showErrorMessage }) => {
    return (
        <div
            role="alert"
            className={`rounded absolute sm:w-96 max-w-xs z-50 right-0 top-4 border-s-4 transition-all duration-200 border-red-500 bg-red-50 p-4 ${
                showErrorMessage
                    ? "sm:-translate-x-4 -translate-x-2"
                    : "translate-x-full"
            }`}
        >
            <div className="flex items-center gap-2 text-red-800">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                    />
                </svg>

                <strong className="block font-medium">
                    {" "}
                    {errorMessageType}{" "}
                </strong>
            </div>

            <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        </div>
    );
};

export default Alert;
