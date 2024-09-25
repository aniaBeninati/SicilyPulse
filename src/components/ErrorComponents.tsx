import { labels } from "@/data/labels"

interface ErrorComponentsProps {
    children?: React.ReactNode;
    message?: string;
}

const ErrorComponents = ({ children, message }: ErrorComponentsProps) => {
    return (
        <div className="grid h-screen place-content-center bg-white px-4">
            <div className="text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1024 768"
                    className="mx-auto h-56 w-auto text-black sm:h-64"
                >
                </svg>

                <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {labels.errorHuHo}
                </h1>

                <p className="mt-4 text-gray-500">{message}</p>
                {children}
            </div>
        </div>
    );
};

export default ErrorComponents;