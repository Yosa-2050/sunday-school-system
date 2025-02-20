
export default function NotFound() {
        return (
            <div className="py-32">
                <div className="x-auto container text-center">
                    <div className="mb-12 text-[220px] font-black leading-none text-primary-3">
                        404
                    </div>
                    <h1 className="font-[Greycliff CF] text-4xl font-extrabold md:text-3xl">
                        Nothing to see here
                    </h1>
                    <p className="mx-auto mb-12 mt-6 max-w-xl text-lg text-gray-500 dark:text-gray-400">
                        The page you are trying to open does not exist. You may have
                        mistyped the address, or the page has been moved to another
                        URL. If you think this is an error, contact support.
                    </p>
                    <div className="flex justify-center">
                        <a
                            href="/"
                            className="rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-primary-4 focus:ring-opacity-75"
                        >
                            Return to Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    

